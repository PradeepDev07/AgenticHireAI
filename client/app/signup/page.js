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
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

export default function SignupPage() {
  const router = useRouter();
  const signup = useAuthStore((state) => state.signup);
  const error = useAuthStore((state) => state.error);
  const { register, handleSubmit, formState } = useForm({ resolver: zodResolver(schema) });

  async function onSubmit(values) {
    await signup({ ...values, role: "recruiter" });
    router.push("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm rounded-lg border border-border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Create recruiter account</h1>
        <div className="mt-6 space-y-4">
          <Input placeholder="Name" {...register("name")} />
          <Input placeholder="Email" {...register("email")} />
          <Input placeholder="Password" type="password" {...register("password")} />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button className="w-full" disabled={formState.isSubmitting}>
            Sign up
          </Button>
        </div>
        <p className="mt-4 text-sm text-muted">
          Already registered? <Link className="font-medium text-primary" href="/login">Login</Link>
        </p>
      </form>
    </main>
  );
}
