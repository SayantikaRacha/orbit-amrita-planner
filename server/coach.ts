/**
 * Server-only adapter. Mount this behind an authenticated API route.
 * Never call this module from browser code or expose OPENAI_API_KEY.
 */
type CoachContext = {
  currentCgpa: number;
  targetCgpa: number;
  requiredAverage: number;
  remainingCredits: number;
  weeklyHours: number;
  priorities: string[];
  userSafetyId: string;
};

export async function createCoachReply(message: string, context: CoachContext) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Coach is not configured");

  const instructions = [
    "You are Orbit, a supportive study coach for university students.",
    "Give actionable study advice only. Do not interpret university policy, promise grades, or calculate/override GPA.",
    "Treat the supplied GPA figures as authoritative. If asked about an official rule, say that the student should consult Amrita's official regulations.",
    "Do not request personally identifying information, raw documents, or grades beyond the supplied summary.",
    "Keep replies under 180 words and use a calm, practical tone."
  ].join(" ");

  const input = {
    question: message.slice(0, 1200),
    confirmedPlan: {
      currentCgpa: context.currentCgpa,
      targetCgpa: context.targetCgpa,
      requiredAverage: context.requiredAverage,
      remainingCredits: context.remainingCredits,
      weeklyHours: context.weeklyHours,
      priorities: context.priorities
    }
  };

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: process.env.OPENAI_COACH_MODEL || "gpt-5-mini",
      store: false,
      safety_identifier: context.userSafetyId,
      instructions,
      input: JSON.stringify(input),
      max_output_tokens: 350
    })
  });
  if (!response.ok) throw new Error("Coach service unavailable");
  const payload = await response.json() as { output_text?: string };
  return payload.output_text || "I couldn't prepare a reply right now. Please try again.";
}

