import { describe, expect, test } from "@jest/globals";
import { shortlistingAgent } from "../src/agents/shortlistingAgent.js";

describe("shortlistingAgent", () => {
  test("uses spec thresholds for shortlist", async () => {
    const result = await shortlistingAgent({ match: { data: { match_score: 85 } } });
    expect(result.data.status).toBe("shortlisted");
  });

  test("uses spec thresholds for hold", async () => {
    const result = await shortlistingAgent({ match: { data: { match_score: 65 } } });
    expect(result.data.status).toBe("hold");
  });

  test("uses spec thresholds for rejection", async () => {
    const result = await shortlistingAgent({ match: { data: { match_score: 40 } } });
    expect(result.data.status).toBe("rejected");
  });
});
