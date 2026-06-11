import fs from "fs";

const knownSkills = ["React", "JavaScript", "CSS", "Next.js", "Tailwind CSS", "Node.js", "MongoDB", "Express"];

export async function resumeParserAgent({ candidate, resumePath }) {
  const content = fs.existsSync(resumePath) ? fs.readFileSync(resumePath, "utf-8") : "";
  const skills = knownSkills.filter((skill) => content.toLowerCase().includes(skill.toLowerCase()));
  const experienceMatch = content.match(/(\d+)\+?\s*(years|yrs)/i);

  return {
    success: true,
    data: {
      name: candidate.name,
      skills,
      experience: experienceMatch ? Number(experienceMatch[1]) : 0,
      education: content.match(/(B\.?Tech|M\.?Tech|BSc|MSc|MBA)/i)?.[0] || "Not specified",
      projects: content.match(/project[s]?:?(.+)/i)?.[1]?.split(",").map((item) => item.trim()) || []
    }
  };
}
