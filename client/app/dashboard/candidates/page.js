"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../../lib/api";

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    apiFetch("/candidates").then(setCandidates);
  }, []);

  return (
    <section>
      <h1 className="text-2xl font-semibold">Candidates</h1>
      <div className="mt-6 overflow-hidden rounded-lg border border-border bg-white">
        {candidates.map((candidate) => (
          <div key={candidate._id} className="grid gap-2 border-b border-border p-4 last:border-b-0 md:grid-cols-5">
            <div>
              <p className="font-medium">{candidate.name}</p>
              <p className="text-sm text-muted">{candidate.email}</p>
            </div>
            <p className="text-sm">{candidate.job_id?.title || "Unknown job"}</p>
            <p className="text-sm">Score: {candidate.match_score}</p>
            <p className="text-sm capitalize">{candidate.status}</p>
            <p className="text-sm text-muted">{new Date(candidate.created_at).toLocaleDateString()}</p>
          </div>
        ))}
        {!candidates.length ? <p className="p-4 text-sm text-muted">No candidates yet.</p> : null}
      </div>
    </section>
  );
}
