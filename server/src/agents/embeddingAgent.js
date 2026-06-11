import { storeDocument } from "../rag/ragService.js";

export async function embeddingAgent({ candidate, parsedResume }) {
  const text = JSON.stringify(parsedResume.data);
  const result = await storeDocument({
    type: "resume",
    id: String(candidate._id),
    text,
    metadata: { candidate_id: String(candidate._id), job_id: String(candidate.job_id) }
  });

  return { success: true, data: result };
}
