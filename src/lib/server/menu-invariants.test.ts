import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("historical price snapshots", () => {
  it("menu writes never touch order_items", () => {
    const src = readFileSync(new URL("./api-menu.ts", import.meta.url), "utf8");
    assert.equal(src.includes("order_items"), false);
    assert.equal(src.includes("order_item_addons"), false);
  });
});

describe("public catalog", () => {
  it("excludes simulated kitchens from the customer catalog", () => {
    const src = readFileSync(new URL("./api-menu.ts", import.meta.url), "utf8");
    assert.match(src, /verification_status = 'VERIFIED'/);
    assert.match(src, /data_label in \('REAL','VERIFIED'\)/);
  });
});
