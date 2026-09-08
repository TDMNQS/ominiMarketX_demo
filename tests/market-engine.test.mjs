import assert from "node:assert/strict";
import test from "node:test";

import {
  mergeBuyPosition,
  quoteBuy,
  quoteSell,
  reduceSellPosition,
} from "../lib/market-engine.ts";

test("quotes a demo purchase with explicit fees and predictable precision", () => {
  const quote = quoteBuy(10, 0.735);
  assert.equal(quote.shares, 13.6054);
  assert.equal(quote.fee, 0.02);
  assert.equal(quote.total, 10.02);
});

test("rejects demo purchases outside the supported limits", () => {
  assert.throws(() => quoteBuy(5, 0.5), /Minimum demo trade/);
  assert.throws(() => quoteBuy(5_001, 0.5), /Maximum demo trade/);
});

test("quotes a sale after deducting the disclosed fee", () => {
  const quote = quoteSell(10, 0.73);
  assert.equal(quote.fee, 0.01);
  assert.equal(quote.proceeds, 7.29);
  assert.equal(quote.total, 7.29);
});

test("merges repeat purchases using a weighted average price", () => {
  const current = {
    marketId: "ramayana",
    outcome: "YES",
    shares: 10,
    averagePrice: 0.5,
    invested: 5,
  };
  const merged = mergeBuyPosition(current, "ramayana", "YES", 10, 0.8);
  assert.equal(merged.shares, 22.5);
  assert.equal(merged.invested, 15);
  assert.equal(merged.averagePrice, 0.6667);
});

test("prevents a user from selling more shares than they hold", () => {
  const position = {
    marketId: "ramayana",
    outcome: "YES",
    shares: 13.45,
    averagePrice: 0.735,
    invested: 10,
  };
  assert.throws(() => reduceSellPosition(position, 20), /cannot sell more shares/);
  assert.equal(reduceSellPosition(position, 13.45), null);
});
