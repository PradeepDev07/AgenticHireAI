import { describe, expect, test } from "@jest/globals";
import { createJobSchema } from "../src/validators/jobValidators.js";

describe("job validators", () => {
  test("accepts a valid create job payload", () => {
    const result = createJobSchema.safeParse({
      body: {
        title: "Frontend Developer",
        description: "Build accessible hiring workflows for recruiters.",
        required_skills: ["React"],
        preferred_skills: ["Next.js"],
        min_experience: 2
      },
      params: {},
      query: {}
    });

    expect(result.success).toBe(true);
  });
});
