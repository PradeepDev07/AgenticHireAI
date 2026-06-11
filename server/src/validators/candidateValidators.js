import { z } from "zod";

export const uploadCandidateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  job_id: z.string().min(12)
});

export const candidateIdSchema = z.object({
  body: z.object({}),
  params: z.object({ id: z.string().min(12) }),
  query: z.object({})
});
