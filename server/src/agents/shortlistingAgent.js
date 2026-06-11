import { getShortlistingSpec } from "../utils/specLoader.js";

export async function shortlistingAgent({ match }) {
  const score = match.data.match_score;
  const spec = getShortlistingSpec();
  const decision =
    spec.decisions.find((rule) => {
      const aboveMin = rule.minimum_score === undefined || score >= rule.minimum_score;
      const belowMax = rule.maximum_score === undefined || score <= rule.maximum_score;
      return aboveMin && belowMax;
    }) || spec.decisions[spec.decisions.length - 1];

  return {
    success: true,
    data: {
      status: decision.status,
      recommendation: decision.recommendation,
      match_score: score
    }
  };
}
