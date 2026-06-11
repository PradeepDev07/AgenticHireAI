import { z } from "zod";

export const workflowIdSchema = z.object({
  body: z.object({}),
  params: z.object({ id: z.string().min(12) }),
  query: z.object({})
});

export const startWorkflowSchema = z.object({
  body: z.object({
    candidate_id: z.string().min(12),
    job_id: z.string().min(12)
  }),
  params: z.object({}),
  query: z.object({})
});

export const workflowActionSchema = z.object({
  body: z.object({
    workflow_id: z.string().min(12),
    approved: z.boolean().optional()
  }),
  params: z.object({}),
  query: z.object({})
});
