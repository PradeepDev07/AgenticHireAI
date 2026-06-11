"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useAuthStore } from "../../store/authStore";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const error = useAuthStore((state) => state.error);
  const { register, handleSubmit, formState } = useForm({ resolver: zodResolver(schema) });

  async function onSubmit(values) {
    await login(values);
    router.push("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm rounded-lg border border-border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Recruiter login</h1>
        <p className="mt-1 text-sm text-muted">Access jobs, candidates, workflows, and approvals.</p>
        <div className="mt-6 space-y-4">
          <Input placeholder="Email" {...register("email")} />
          <Input placeholder="Password" type="password" {...register("password")} />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button className="w-full" disabled={formState.isSubmitting}>
            Login
          </Button>
        </div>
        <p className="mt-4 text-sm text-muted">
          Need an account? <Link className="font-medium text-primary" href="/signup">Sign up</Link>
        </p>
      </form>
    </main>
  );
}
