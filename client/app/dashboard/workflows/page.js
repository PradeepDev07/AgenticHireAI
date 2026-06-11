"use client";

import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { WorkflowGraph } from "../../../components/workflow/workflow-graph";
import { apiFetch } from "../../../lib/api";

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState([]);
  const [selected, setSelected] = useState(null);

  async function load() {
    const data = await apiFetch("/workflow");
    setWorkflows(data);
    setSelected((current) => current || data[0] || null);
  }

  useEffect(() => {
    load();
  }, []);

  async function approve(workflowId) {
    const workflow = await apiFetch("/workflow/approve", {
      method: "POST",
      body: { workflow_id: workflowId, approved: true }
    });
    setSelected(workflow);
    await load();
  }

  async function retry(workflowId) {
    const workflow = await apiFetch("/workflow/retry", {
      method: "POST",
      body: { workflow_id: workflowId }
    });
    setSelected(workflow);
    await load();
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold">Workflow monitoring</h1>
      <div className="mt-6 grid gap-4 lg:grid-cols-[320px_1fr]">
        <div className="overflow-hidden rounded-lg border border-border bg-white">
          {workflows.map((workflow) => (
            <button
              key={workflow._id}
              className="block w-full border-b border-border p-4 text-left text-sm last:border-b-0 hover:bg-slate-50"
              onClick={() => setSelected(workflow)}
            >
              <p className="font-medium">{workflow.candidate_id?.name || "Candidate"}</p>
              <p className="text-muted">{workflow.job_id?.title || "Job"} · {workflow.status}</p>
            </button>
          ))}
          {!workflows.length ? <p className="p-4 text-sm text-muted">No workflows yet.</p> : null}
        </div>
        <div className="space-y-4">
          {selected ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-white p-4">
                <div>
                  <p className="font-semibold">{selected.candidate_id?.name}</p>
                  <p className="text-sm text-muted">Current state: {selected.current_state}</p>
                </div>
                <div className="flex gap-2">
                  {selected.status === "waiting_approval" ? <Button onClick={() => approve(selected._id)}>Approve</Button> : null}
                  {selected.status === "failed" ? <Button variant="secondary" onClick={() => retry(selected._id)}>Retry</Button> : null}
                </div>
              </div>
              <WorkflowGraph workflow={selected} />
            </>
          ) : (
            <div className="rounded-lg border border-border bg-white p-6 text-sm text-muted">Select a workflow to inspect execution order, retries, and approval checkpoints.</div>
          )}
        </div>
      </div>
    </section>
  );
}
