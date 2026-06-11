"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../../lib/api";

export default function AnalyticsPage() {
  const [candidates, setCandidates] = useState([]);
  const [workflows, setWorkflows] = useState([]);

  useEffect(() => {
    Promise.all([apiFetch("/candidates"), apiFetch("/workflow")]).then(([candidateData, workflowData]) => {
      setCandidates(candidateData);
      setWorkflows(workflowData);
    });
  }, []);

  const stats = useMemo(() => {
    const shortlisted = candidates.filter((candidate) => candidate.status === "shortlisted").length;
    const completed = workflows.filter((workflow) => workflow.status === "completed").length;
    return {
      shortlistRate: candidates.length ? Math.round((shortlisted / candidates.length) * 100) : 0,
      workflowCompletionRate: workflows.length ? Math.round((completed / workflows.length) * 100) : 0,
      averageScore: candidates.length ? Math.round(candidates.reduce((sum, item) => sum + item.match_score, 0) / candidates.length) : 0
    };
  }, [candidates, workflows]);

  return (
    <section>
      <h1 className="text-2xl font-semibold">Analytics</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Metric label="Shortlist rate" value={`${stats.shortlistRate}%`} />
        <Metric label="Workflow completion" value={`${stats.workflowCompletionRate}%`} />
        <Metric label="Average match score" value={stats.averageScore} />
      </div>
    </section>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-lg border border-border bg-white p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}
