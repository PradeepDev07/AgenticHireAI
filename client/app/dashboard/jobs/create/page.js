"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import { apiFetch } from "../../../../lib/api";

const schema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  required_skills: z.string().optional(),
  preferred_skills: z.string().optional(),
  min_experience: z.coerce.number().min(0)
});

export default function CreateJobPage() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { min_experience: 0 }
  });

  async function onSubmit(values) {
    setError(null);
    try {
      await apiFetch("/jobs", {
        method: "POST",
        body: {
          ...values,
          required_skills: toList(values.required_skills),
          preferred_skills: toList(values.preferred_skills),
          workflow_spec_id: "default-hiring-workflow",
          hiring_spec_id: "frontend-developer"
        }
      });
      router.push("/dashboard/jobs");
    } catch (apiError) {
      setError(apiError.message);
    }
  }

  return (
    <section className="max-w-2xl">
      <h1 className="text-2xl font-semibold">Create job</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4 rounded-lg border border-border bg-white p-5">
        <Input placeholder="Frontend Developer" {...register("title")} />
        <Textarea placeholder="Describe the role, team, and expectations." {...register("description")} />
        <Input placeholder="Required skills, comma separated" {...register("required_skills")} />
        <Input placeholder="Preferred skills, comma separated" {...register("preferred_skills")} />
        <Input type="number" placeholder="Minimum experience" {...register("min_experience")} />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button disabled={formState.isSubmitting}>Create job</Button>
      </form>
    </section>
  );
}

function toList(value = "") {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}
