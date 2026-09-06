import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isOpenAt, minutesToHm, hmToMinutes } from "./hours.ts";

describe("hours", () => {
  it("supports split shifts", () => {
    const shifts = [
      { weekday: 1 as const, openMinutes: 11 * 60, closeMinutes: 15 * 60 },
      { weekday: 1 as const, openMinutes: 17 * 60, closeMinutes: 23 * 60 },
    ];
    const mondayLunch = "2026-08-31T07:00:00.000Z"; // 12:30 IST
    const mondayGap = "2026-08-31T10:30:00.000Z"; // 16:00 IST
    assert.equal(
      isOpenAt({ nowIso: mondayLunch, shifts, closures: [], weeklyHolidays: [] }),
      true,
    );
    assert.equal(
      isOpenAt({ nowIso: mondayGap, shifts, closures: [], weeklyHolidays: [] }),
      false,
    );
  });

  it("emergency close wins unless admin override", () => {
    const shifts = [{ weekday: 1 as const, openMinutes: 0, closeMinutes: 24 * 60 }];
    const nowIso = "2026-08-31T07:00:00.000Z";
    assert.equal(
      isOpenAt({ nowIso, shifts, closures: [], weeklyHolidays: [], emergencyClosed: true }),
      false,
    );
    assert.equal(
      isOpenAt({
        nowIso,
        shifts,
        closures: [],
        weeklyHolidays: [],
        emergencyClosed: true,
        adminOverride: true,
      }),
      true,
    );
  });

  it("roundtrips hh:mm", () => {
    assert.equal(minutesToHm(hmToMinutes("17:30")), "17:30");
  });
});
