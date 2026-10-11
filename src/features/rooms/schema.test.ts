import { describe, expect, it } from "vitest";

import { hasDuplicateRoomName, naturalRoomSort } from "./schema";

describe("room ordering", () => {
  it("sorts room numbers naturally", () => {
    const sorted = naturalRoomSort([{ name: "Room 10" }, { name: "Room 2" }, { name: "Room 1" }]);
    expect(sorted.map((room) => room.name)).toEqual(["Room 1", "Room 2", "Room 10"]);
  });
});

describe("duplicate room names", () => {
  it("detects duplicates regardless of case and spacing", () => {
    expect(hasDuplicateRoomName(["Room 1", "room 1", "Room 2"])).toBe(true);
    expect(hasDuplicateRoomName(["Room 1", "Room 2", "Room 3"])).toBe(false);
  });
});
