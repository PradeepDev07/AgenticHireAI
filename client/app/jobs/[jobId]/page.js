"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "../../../components/ui/button";
import { apiFetch } from "../../../lib/api";

export default function PublicJobPage() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    apiFetch(`/jobs/${jobId}`).then(setJob);
  }, [jobId]);

  if (!job) return <main className="p-6 text-sm text-muted">Loading job...</main>;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">Public job opening</p>
      <h1 className="mt-2 text-4xl font-semibold">{job.title}</h1>
      <p className="mt-4 text-slate-700">{job.description}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {job.required_skills.map((skill) => (
          <span key={skill} className="rounded-full bg-blue-50 px-3 py-1 text-sm text-primary">{skill}</span>
        ))}
      </div>
      <Link href={`/jobs/${job._id}/apply`} className="mt-8 inline-flex">
        <Button>Apply now</Button>
      </Link>
    </main>
  );
}
