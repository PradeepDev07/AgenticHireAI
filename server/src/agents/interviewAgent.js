export async function interviewAgent({ hiringSpec, candidate }) {
  return {
    success: true,
    data: {
      rounds: hiringSpec.interview_rounds,
      questions: hiringSpec.required_skills.map((skill) => `Describe a production problem you solved with ${skill}.`),
      coding_task: `Build a small ${hiringSpec.role} feature using ${hiringSpec.required_skills[0]}.`,
      rubric: ["technical accuracy", "communication", "problem decomposition"]
    }
  };
}
