"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ApplyPage() {
  const { jobId } = useParams();
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  async function onSubmit(event) {
    event.preventDefault();
    setError(null);
    setStatus("Uploading resume and starting workflow...");
    const formData = new FormData(event.currentTarget);
    formData.set("job_id", jobId);

    const response = await fetch(`${API_URL}/candidates/upload`, {
      method: "POST",
      body: formData
    });
    const payload = await response.json();

    if (!response.ok || !payload.success) {
      setError(payload.error?.message || "Application failed");
      setStatus(null);
      return;
    }

    setStatus(`Application submitted. Workflow ${payload.data.workflow._id} is running.`);
    event.currentTarget.reset();
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Apply for this role</h1>
      <p className="mt-2 text-sm text-muted">Your resume upload automatically starts the AI evaluation workflow.</p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-lg border border-border bg-white p-5">
        <Input name="name" placeholder="Full name" required />
        <Input name="email" type="email" placeholder="Email" required />
        <Input name="phone" placeholder="Phone" />
        <Input name="resume" type="file" accept=".pdf,.txt" required />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {status ? <p className="text-sm text-green-700">{status}</p> : null}
        <Button>Submit application</Button>
      </form>
    </main>
  );
}
