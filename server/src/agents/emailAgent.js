import { getEmailTemplates } from "../utils/specLoader.js";

function render(template, data) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] || "");
}

export async function emailAgent({ candidate, job, shortlist }) {
  const templates = getEmailTemplates();
  const template = shortlist.data.status === "rejected" ? templates.rejection : templates.interview_invite;
  const data = { candidateName: candidate.name, jobTitle: job.title };

  return {
    success: true,
    data: {
      to: candidate.email,
      subject: render(template.subject, data),
      body: render(template.body, data),
      delivered: Boolean(process.env.RESEND_API_KEY) ? "queued" : "simulated"
    }
  };
}
