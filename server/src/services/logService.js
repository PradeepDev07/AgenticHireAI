import fs from "fs";
import path from "path";
import WorkflowLog from "../models/WorkflowLog.js";

export async function writeWorkflowLog({ workflowId, agentName, input, output, status, error }) {
  const entry = await WorkflowLog.create({
    workflow_id: workflowId,
    agent_name: agentName,
    input,
    output,
    status,
    error
  });

  const line = JSON.stringify({
    timestamp: new Date().toISOString(),
    workflow_id: workflowId,
    agent_name: agentName,
    status,
    error
  });

  fs.appendFileSync(path.join(process.cwd(), "logs", "workflow.log"), `${line}\n`);
  return entry;
}
