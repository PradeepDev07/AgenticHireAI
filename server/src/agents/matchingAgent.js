import { semanticSearch } from "../rag/ragService.js";

export async function matchingAgent({ parsedResume, hiringSpec }) {
  const skills = parsedResume.data.skills || [];
  const requiredHits = hiringSpec.required_skills.filter((skill) => skills.includes(skill));
  const preferredHits = hiringSpec.preferred_skills.filter((skill) => skills.includes(skill));
  const requiredWeight = requiredHits.length / Math.max(hiringSpec.required_skills.length, 1);
  const preferredWeight = preferredHits.length / Math.max(hiringSpec.preferred_skills.length, 1);
  const experienceWeight = Math.min((parsedResume.data.experience || 0) / 5, 1);
  const score = Math.round(requiredWeight * 60 + preferredWeight * 25 + experienceWeight * 15);
  const missing_skills = hiringSpec.required_skills.filter((skill) => !skills.includes(skill));
  const context = await semanticSearch([...hiringSpec.required_skills, ...skills].join(" "));

  return {
    success: true,
    data: {
      match_score: score,
      missing_skills,
      recommendation: score >= hiringSpec.minimum_score ? "Shortlist" : "Review",
      rag_context_count: context.length
    }
  };
}
