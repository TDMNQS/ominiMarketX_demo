import type { Outcome } from "./market-engine";

export type Category = "All" | "Entertainment" | "Technology" | "Crypto" | "Economy" | "Sports";

export type Market = {
  id: string;
  question: string;
  shortLabel: string;
  category: Exclude<Category, "All">;
  yesPrice: number;
  change: number;
  volume: number;
  traders: number;
  closes: string;
  resolution: string;
  source: string;
  accent: string;
  symbol: string;
  trend: number[];
  status?: "open" | "closing";
};

export const markets: Market[] = [
  {
    id: "ramayana",
    question: "Will Ramayana: Part One gross at least ₹1,500 crore worldwide?",
    shortLabel: "Ramayana ₹1,500cr",
    category: "Entertainment",
    yesPrice: 0.735,
    change: 6.2,
    volume: 184_300,
    traders: 2_481,
    closes: "Nov 8, 2026",
    resolution: "YES if worldwide theatrical gross reaches ₹1,500 crore or more. Streaming, digital, merchandise and licensing revenue are excluded.",
    source: "Box Office Mojo / official box-office reporting",
    accent: "#ff4f86",
    symbol: "R",
    trend: [52, 61, 68, 74, 76, 79, 86, 90, 69, 73, 78, 81, 76, 80, 83, 87, 79, 82, 71, 75, 59, 64, 45, 49, 44, 51, 58, 70, 73],
  },
  {
    id: "gta-vi",
    question: "Will GTA VI launch before June 2027?",
    shortLabel: "GTA VI launch",
    category: "Technology",
    yesPrice: 0.62,
    change: -2.4,
    volume: 428_900,
    traders: 5_920,
    closes: "May 31, 2027",
    resolution: "YES if Rockstar Games commercially releases GTA VI on at least one announced platform before June 1, 2027 UTC.",
    source: "Rockstar Games official release channels",
    accent: "#8758ff",
    symbol: "VI",
    trend: [68, 72, 71, 73, 75, 70, 69, 67, 65, 66, 63, 61, 64, 62, 60, 59, 61, 62, 63, 62],
  },
  {
    id: "bitcoin-150k",
    question: "Will Bitcoin trade above $150,000 before 2027?",
    shortLabel: "Bitcoin $150K",
    category: "Crypto",
    yesPrice: 0.41,
    change: 3.8,
    volume: 781_400,
    traders: 8_214,
    closes: "Dec 31, 2026",
    resolution: "YES if the BTC/USD spot price reaches or exceeds $150,000 on the reference exchange before the close date.",
    source: "Coinbase BTC-USD spot index",
    accent: "#ffb13b",
    symbol: "₿",
    trend: [31, 32, 35, 34, 36, 39, 41, 38, 40, 42, 44, 43, 46, 44, 42, 41],
  },
  {
    id: "fed-rate",
    question: "Will the US Federal Reserve cut rates at its December meeting?",
    shortLabel: "Fed December cut",
    category: "Economy",
    yesPrice: 0.57,
    change: 1.1,
    volume: 633_100,
    traders: 6_405,
    closes: "Dec 16, 2026",
    resolution: "YES if the Federal Open Market Committee lowers the target federal funds range at its December 2026 meeting.",
    source: "Federal Reserve FOMC statement",
    accent: "#2ed8a3",
    symbol: "%",
    trend: [44, 46, 43, 47, 49, 48, 51, 50, 54, 55, 53, 56, 57],
  },
  {
    id: "ai-agents",
    question: "Will an AI agent rank in the top 10 on a major coding benchmark this year?",
    shortLabel: "AI coding top 10",
    category: "Technology",
    yesPrice: 0.81,
    change: 8.4,
    volume: 311_700,
    traders: 4_106,
    closes: "Dec 30, 2026",
    resolution: "YES if an autonomous agent appears in the top 10 of the verified SWE-bench leaderboard before the close date.",
    source: "SWE-bench verified leaderboard",
    accent: "#4d8dff",
    symbol: "AI",
    trend: [59, 61, 63, 66, 64, 69, 72, 70, 75, 78, 76, 81],
  },
  {
    id: "india-world-cup",
    question: "Will India reach the final of the next ICC Men’s T20 World Cup?",
    shortLabel: "India T20 final",
    category: "Sports",
    yesPrice: 0.68,
    change: 4.6,
    volume: 524_600,
    traders: 7_115,
    closes: "Mar 8, 2027",
    resolution: "YES if India qualifies for and plays in the final match of the next ICC Men’s T20 World Cup.",
    source: "International Cricket Council",
    accent: "#5fa8ff",
    symbol: "IN",
    trend: [52, 53, 57, 61, 59, 63, 65, 64, 67, 66, 68],
  },
];

export const categoryOptions: Category[] = ["All", "Entertainment", "Technology", "Crypto", "Economy", "Sports"];

export function marketById(id: string) {
  return markets.find((market) => market.id === id) ?? markets[0];
}

export function priceForOutcome(market: Market, outcome: Outcome) {
  return outcome === "YES" ? market.yesPrice : 1 - market.yesPrice;
}

export function formatCompact(value: number) {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

export function formatUsdc(value: number) {
  return new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}
