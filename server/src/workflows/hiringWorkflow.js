import path from "path";
import Candidate from "../models/Candidate.js";
import Job from "../models/Job.js";
import Workflow from "../models/Workflow.js";
import { resumeParserAgent } from "../agents/resumeParserAgent.js";
import { embeddingAgent } from "../agents/embeddingAgent.js";
import { matchingAgent } from "../agents/matchingAgent.js";
import { shortlistingAgent } from "../agents/shortlistingAgent.js";
import { interviewAgent } from "../agents/interviewAgent.js";
import { emailAgent } from "../agents/emailAgent.js";
import { getHiringSpec, getRetryPolicy, getWorkflowSpec } from "../utils/specLoader.js";
import { writeWorkflowLog } from "../services/logService.js";

const handlers = {
  resume_parser: async (context) => {
    const output = await resumeParserAgent({
      candidate: context.candidate,
      resumePath: path.join(process.cwd(), context.candidate.resume_url)
    });
    context.parsedResume = output;
    await Candidate.findByIdAndUpdate(context.candidate._id, { parsed_resume_json: output.data });
    return output;
  },
  embedding_agent: async (context) => {
    return embeddingAgent({ candidate: context.candidate, parsedResume: context.parsedResume });
  },
  matching_agent: async (context) => {
    const output = await matchingAgent({ parsedResume: context.parsedResume, hiringSpec: context.hiringSpec });
    context.match = output;
    await Candidate.findByIdAndUpdate(context.candidate._id, { match_score: output.data.match_score });
    return output;
  },
  shortlisting_agent: async (context) => {
    const output = await shortlistingAgent({ match: context.match });
    context.shortlist = output;
    await Candidate.findByIdAndUpdate(context.candidate._id, { status: output.data.status });
    return output;
  },
  human_approval: async (context) => {
    return {
      success: true,
      data: {
        status: "waiting_approval",
        message: "Recruiter approval required"
      }
    };
  },
  interview_agent: async (context) => {
    return interviewAgent({ hiringSpec: context.hiringSpec, candidate: context.candidate });
  },
  email_agent: async (context) => {
    return emailAgent({ candidate: context.candidate, job: context.job, shortlist: context.shortlist });
  }
};

function initializeGraph(workflowSpec) {
  return workflowSpec.workflow.map((name) => ({
    name,
    status: "pending",
    attempts: 0,
    output: null,
    error: null
  }));
}

export async function createWorkflow(candidateId, jobId) {
  const job = await Job.findById(jobId);
  if (!job) {
    const error = new Error("Job not found");
    error.status = 404;
    throw error;
  }

  const workflowSpec = getWorkflowSpec(job.workflow_spec_id);
  const workflow = await Workflow.create({
    candidate_id: candidateId,
    job_id: jobId,
    workflow_spec_id: job.workflow_spec_id,
    current_state: workflowSpec.workflow[0],
    status: "running",
    graph: initializeGraph(workflowSpec)
  });

  runWorkflow(workflow._id).catch((error) => {
    console.error("Workflow failed", error);
  });

  return workflow;
}

export async function runWorkflow(workflowId, options = {}) {
  const workflow = await Workflow.findById(workflowId);
  if (!workflow) {
    const error = new Error("Workflow not found");
    error.status = 404;
    throw error;
  }

  const candidate = await Candidate.findById(workflow.candidate_id);
  const job = await Job.findById(workflow.job_id);
  const workflowSpec = getWorkflowSpec(workflow.workflow_spec_id);
  const retryPolicy = getRetryPolicy();
  const context = {
    workflow,
    candidate,
    job,
    hiringSpec: getHiringSpec(job.hiring_spec_id)
  };

  const parsedStep = workflow.graph.find((item) => item.name === "resume_parser");
  const matchingStep = workflow.graph.find((item) => item.name === "matching_agent");
  const shortlistingStep = workflow.graph.find((item) => item.name === "shortlisting_agent");
  context.parsedResume = parsedStep?.output || null;
  context.match = matchingStep?.output || null;
  context.shortlist = shortlistingStep?.output || null;

  for (const stepName of workflowSpec.workflow) {
    const step = workflow.graph.find((item) => item.name === stepName);
    if (step.status === "success") continue;
    if (stepName === "human_approval" && !options.approved) {
      step.status = "waiting_approval";
      step.attempts += 1;
      workflow.current_state = stepName;
      workflow.status = "waiting_approval";
      step.output = await handlers[stepName](context);
      await workflow.save();
      await writeWorkflowLog({
        workflowId,
        agentName: stepName,
        input: { candidate_id: candidate._id, job_id: job._id },
        output: step.output,
        status: "waiting_approval"
      });
      return workflow;
    }

    let attempt = 0;
    while (attempt <= retryPolicy.max_retries) {
      attempt += 1;
      step.attempts += 1;
      step.status = "running";
      workflow.current_state = stepName;
      workflow.status = "running";
      await workflow.save();

      try {
        const output = await handlers[stepName](context);
        step.status = "success";
        step.output = output;
        step.error = null;
        await writeWorkflowLog({
          workflowId,
          agentName: stepName,
          input: { candidate_id: candidate._id, job_id: job._id },
          output,
          status: "success"
        });
        break;
      } catch (error) {
        step.status = "failed";
        step.error = error.stack || error.message;
        await writeWorkflowLog({
          workflowId,
          agentName: stepName,
          input: { candidate_id: candidate._id, job_id: job._id },
          status: "failed",
          error: error.stack || error.message
        });

        if (attempt > retryPolicy.max_retries) {
          workflow.status = "failed";
          await workflow.save();
          throw error;
        }
      }
    }
  }

  workflow.current_state = "completed";
  workflow.status = "completed";
  await workflow.save();
  return workflow;
}

export async function approveWorkflow(workflowId, approved = true) {
  const workflow = await Workflow.findById(workflowId);
  if (!workflow) {
    const error = new Error("Workflow not found");
    error.status = 404;
    throw error;
  }

  if (!approved) {
    await Candidate.findByIdAndUpdate(workflow.candidate_id, { status: "rejected" });
    workflow.status = "rejected";
    workflow.current_state = "human_approval";
    await workflow.save();
    return workflow;
  }

  return runWorkflow(workflowId, { approved: true });
}
