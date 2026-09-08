export type Market = { id: string; title: string; category: string; price: number; change: number; volume: number; traders: number; image: number; close: string; source: string; rule: string; tag?: string };
export const markets: Market[] = [
  { id: 'fed-rate-cut', title: 'Will the Fed cut interest rates in September?', category: 'Economics', price: 78, change: 8, volume: 2450000, traders: 1248, image: 5, close: '2026-09-30T23:59:00Z', source: 'https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm', rule: 'Resolves Yes if the Federal Reserve announces a reduction in the upper bound of its target federal funds rate during September 2026. Otherwise resolves No. The official FOMC statement is the reference source.', tag: 'Most traded' },
  { id: 'bitcoin-120k', title: 'Will Bitcoin hit $120,000 before October?', category: 'Crypto', price: 64, change: 12, volume: 1830000, traders: 986, image: 1, close: '2026-09-30T23:59:00Z', source: 'https://www.coinbase.com/price/bitcoin', rule: 'Illustrative resolution rule: Yes if the Coinbase BTC-USD spot price reaches $120,000 before October 1, 2026 UTC. No otherwise. This demo does not fetch or settle against the price feed.', tag: 'Trending' },
  { id: 'spacex-launch', title: 'Will Starship reach orbit on its next flight?', category: 'Science', price: 86, change: 5, volume: 942000, traders: 672, image: 2, close: '2026-12-31T23:59:00Z', source: 'https://www.spacex.com/launches/', rule: 'Illustrative resolution rule: Yes if SpaceX confirms that the next Starship flight launched after September 8, 2026 reaches a stable Earth orbit before year-end. No otherwise. A suborbital trajectory does not qualify.' },
  { id: 'senate-control', title: 'Will Democrats win control of the Senate?', category: 'Politics', price: 42, change: -3, volume: 3200000, traders: 2140, image: 0, close: '2026-11-30T23:59:00Z', source: 'https://www.senate.gov/', rule: 'Illustrative resolution rule: Yes if the certified 2026 election results give Democrats at least 51 Senate seats, counting independents caucusing with them. No otherwise. This simplified demo excludes delayed certifications.' },
  { id: 'champions-league', title: 'Will Arsenal win the 2026–27 Champions League?', category: 'Sports', price: 24, change: 4, volume: 786000, traders: 541, image: 3, close: '2027-06-30T23:59:00Z', source: 'https://www.uefa.com/uefachampionsleague/', rule: 'Resolves Yes if UEFA declares Arsenal the winner of the 2026–27 Champions League. Otherwise resolves No. In this frontend demo, resolution and payouts are not executed.' },
  { id: 'ai-breakthrough', title: 'Will an AI model score 90% on ARC-AGI-2 in 2026?', category: 'Technology', price: 57, change: -6, volume: 1250000, traders: 804, image: 4, close: '2026-12-31T23:59:00Z', source: 'https://arcprize.org/', rule: 'Illustrative resolution rule: Yes if ARC Prize publicly verifies a score of at least 90% on the ARC-AGI-2 private evaluation set by December 31, 2026 UTC. No otherwise.' },
];
export const categories = ['All markets', 'Politics', 'Crypto', 'Sports', 'Economics', 'Technology', 'Science'];
export const money = (cents: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
export const compact = (value: number) => new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
export const marketById = (id: string) => markets.find(m => m.id === id);
export const imagePosition = (index: number) => `${(index % 3) * 50}% ${Math.floor(index / 3) * 100}%`;
export function history(market: Market, range = '1W') {
  const length = range === '1D' ? 24 : range === '1W' ? 28 : 40;
  const scale = range === '1D' ? .6 : range === '1W' ? 1 : 1.8;
  return Array.from({ length }, (_, i) => {
    const fraction = i / (length - 1);
    const wobble = Math.sin(i * 2.1) * 2.5 * (1 - fraction);
    const chance = Math.max(1, Math.min(99, market.price - market.change * scale * (1 - fraction) + wobble));
    return { time: range === '1D' ? `${i}:00` : `Day ${i + 1}`, chance: Math.round(chance * 10) / 10 };
  });
}
