"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { apiFetch } from "../../lib/api";

export default function DashboardPage() {
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    Promise.all([apiFetch("/jobs"), apiFetch("/candidates")]).then(([jobData, candidateData]) => {
      setJobs(jobData);
      setCandidates(candidateData);
    });
  }, []);

  const shortlisted = candidates.filter((candidate) => candidate.status === "shortlisted").length;

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Recruitment dashboard</h1>
          <p className="text-sm text-muted">Create jobs, monitor autonomous workflows, and review AI decisions.</p>
        </div>
        <Link href="/dashboard/jobs/create"><Button>Create job</Button></Link>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Metric label="Open jobs" value={jobs.length} />
        <Metric label="Candidates" value={candidates.length} />
        <Metric label="Shortlisted" value={shortlisted} />
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
