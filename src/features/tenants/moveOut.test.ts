import { describe, expect, it } from "vitest";

import { moveOutDateError } from "./moveOut";

describe("moveOutDateError", () => {
  it("accepts today", () => {
    expect(moveOutDateError("2026-10-12", "2026-01-01", "2026-10-12")).toBeNull();
  });
  it("accepts the move-in date", () => {
    expect(moveOutDateError("2026-01-01", "2026-01-01", "2026-10-12")).toBeNull();
  });
  it("rejects an empty date", () => {
    expect(moveOutDateError("", "2026-01-01", "2026-10-12")).toBe("Choose the move-out date.");
  });
  it("rejects a date before move-in", () => {
    expect(moveOutDateError("2025-12-31", "2026-01-01", "2026-10-12")).toBe(
      "The move-out date cannot be before the move-in date.",
    );
  });
  it("rejects a future date", () => {
    expect(moveOutDateError("2026-10-13", "2026-01-01", "2026-10-12")).toBe(
      "The move-out date cannot be in the future.",
    );
  });
});
