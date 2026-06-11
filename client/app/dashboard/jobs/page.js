"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { apiFetch } from "../../../lib/api";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    apiFetch("/jobs").then(setJobs);
  }, []);

  return (
    <section>
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Jobs</h1>
        <Link href="/dashboard/jobs/create"><Button>Create job</Button></Link>
      </div>
      <div className="mt-6 overflow-hidden rounded-lg border border-border bg-white">
        {jobs.map((job) => (
          <div key={job._id} className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4 last:border-b-0">
            <div>
              <h2 className="font-semibold">{job.title}</h2>
              <p className="text-sm text-muted">{job.required_skills.join(", ")}</p>
            </div>
            <Link className="text-sm font-medium text-primary" href={`/jobs/${job._id}/apply`}>
              Public apply page
            </Link>
          </div>
        ))}
        {!jobs.length ? <p className="p-4 text-sm text-muted">No jobs yet.</p> : null}
      </div>
    </section>
  );
}
