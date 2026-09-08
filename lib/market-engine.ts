export type Outcome = "YES" | "NO";

export type Position = {
  marketId: string;
  outcome: Outcome;
  shares: number;
  averagePrice: number;
  invested: number;
};

export type TradeResult = {
  shares: number;
  fee: number;
  total: number;
  proceeds?: number;
};

export const DEMO_STARTING_BALANCE = 10_000;
export const MIN_TRADE = 10;
export const MAX_TRADE = 5_000;
export const FEE_RATE = 0.002;

export function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function roundShares(value: number) {
  return Math.round((value + Number.EPSILON) * 10_000) / 10_000;
}

export function quoteBuy(amount: number, price: number): TradeResult {
  if (!Number.isFinite(amount) || amount < MIN_TRADE) {
    throw new Error(`Minimum demo trade is ${MIN_TRADE} USDC.`);
  }
  if (amount > MAX_TRADE) {
    throw new Error(`Maximum demo trade is ${MAX_TRADE} USDC.`);
  }
  if (price <= 0 || price >= 1) {
    throw new Error("Market price must be between 0 and 1.");
  }

  const fee = roundMoney(amount * FEE_RATE);
  return {
    shares: roundShares(amount / price),
    fee,
    total: roundMoney(amount + fee),
  };
}

export function quoteSell(shares: number, price: number): TradeResult {
  if (!Number.isFinite(shares) || shares <= 0) {
    throw new Error("Enter a valid number of shares.");
  }
  if (price <= 0 || price >= 1) {
    throw new Error("Market price must be between 0 and 1.");
  }

  const gross = roundMoney(shares * price);
  const fee = roundMoney(gross * FEE_RATE);
  return {
    shares: roundShares(shares),
    fee,
    proceeds: roundMoney(gross - fee),
    total: roundMoney(gross - fee),
  };
}

export function mergeBuyPosition(
  current: Position | undefined,
  marketId: string,
  outcome: Outcome,
  amount: number,
  price: number,
) {
  const quote = quoteBuy(amount, price);
  if (!current) {
    return {
      marketId,
      outcome,
      shares: quote.shares,
      averagePrice: price,
      invested: roundMoney(amount),
    } satisfies Position;
  }

  const shares = roundShares(current.shares + quote.shares);
  const invested = roundMoney(current.invested + amount);
  return {
    ...current,
    shares,
    invested,
    averagePrice: Math.round((invested / shares) * 10_000) / 10_000,
  } satisfies Position;
}

export function reduceSellPosition(current: Position, shares: number) {
  if (shares > current.shares + Number.EPSILON) {
    throw new Error("You cannot sell more shares than you own.");
  }
  const remaining = roundShares(current.shares - shares);
  if (remaining <= 0.0001) return null;

  return {
    ...current,
    shares: remaining,
    invested: roundMoney(remaining * current.averagePrice),
  } satisfies Position;
}
