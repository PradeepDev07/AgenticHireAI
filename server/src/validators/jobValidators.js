import { z } from "zod";

const objectId = z.string().min(12);

export const createJobSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    description: z.string().min(10),
    required_skills: z.array(z.string()).default([]),
    preferred_skills: z.array(z.string()).default([]),
    min_experience: z.coerce.number().min(0).default(0),
    workflow_spec_id: z.string().default("default-hiring-workflow"),
    hiring_spec_id: z.string().default("frontend-developer")
  }),
  params: z.object({}),
  query: z.object({})
});

export const updateJobSchema = z.object({
  body: createJobSchema.shape.body.partial(),
  params: z.object({ id: objectId }),
  query: z.object({})
});

export const jobIdSchema = z.object({
  body: z.object({}),
  params: z.object({ id: objectId }),
  query: z.object({})
});
