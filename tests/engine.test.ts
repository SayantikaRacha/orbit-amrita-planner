import test from "node:test";
import assert from "node:assert/strict";
import { calculateGpa, cse2023, goalScenario, sampleAttempts } from "../src/engine.ts";

test("confirmed credit-weighted GPA ignores pass/fail courses", () => {
  const result = calculateGpa(cse2023, sampleAttempts);
  assert.equal(result.earnedCredits, 42);
  assert.equal(result.cgpa.toFixed(2), "8.69");
});

test("graduation goal exposes an achievable scenario", () => {
  const scenario = goalScenario(cse2023, sampleAttempts, 8.5);
  assert.equal(scenario.remainingCredits > 0, true);
  assert.equal(scenario.feasible, true);
});

test("impossible goal is flagged", () => {
  assert.equal(goalScenario(cse2023, sampleAttempts, 10).feasible, false);
});

