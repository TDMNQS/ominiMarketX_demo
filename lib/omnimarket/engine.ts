import { z } from 'zod';
import { marketById, type Market } from './markets';
export type Outcome = 'Yes' | 'No';
export type Action = 'Buy' | 'Sell';
const cents = z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);
const outcomeSchema = z.enum(['Yes', 'No']);
const receiptSchema = z.object({ id: z.string().min(1), marketId: z.string(), title: z.string(), outcome: outcomeSchema, action: z.enum(['Buy', 'Sell']), quantity: z.number().int().positive(), price: cents, gross: cents, fee: cents, net: cents, balanceAfter: cents, timestamp: z.string().datetime() });
const positionSchema = z.object({ marketId: z.string(), outcome: outcomeSchema, quantity: z.number().int().positive(), cost: cents });
const postSchema = z.object({ id: z.string(), author: z.string(), initials: z.string(), text: z.string().max(600), marketId: z.string().optional(), likes: z.number().int().nonnegative(), liked: z.boolean(), comments: z.array(z.object({ id: z.string(), text: z.string().max(300) })).max(100) });
export const stateSchema = z.object({ version: z.literal(1), balance: cents, positions: z.array(positionSchema), receipts: z.array(receiptSchema), watchlist: z.array(z.string()), posts: z.array(postSchema).max(500) });
export type DemoState = z.infer<typeof stateSchema>;
export type Receipt = z.infer<typeof receiptSchema>;
export type Post = z.infer<typeof postSchema>;
export const initialState: DemoState = { version: 1, balance: 1000000, positions: [], receipts: [], watchlist: [], posts: [
 { id: 'sample-1', author: 'Alex Morgan', initials: 'AM', text: 'The next FOMC meeting is the one to watch. Inflation data could change this market quickly. What is your read?', marketId: 'fed-rate-cut', likes: 24, liked: false, comments: [] },
 { id: 'sample-2', author: 'Sarah Chen', initials: 'SC', text: 'Prediction markets are about probabilities, not certainty. I always check the resolution rules before taking a position.', marketId: 'bitcoin-120k', likes: 18, liked: false, comments: [] },
 { id: 'sample-3', author: 'Marcus Lee', initials: 'ML', text: 'Watching the next Starship flight. The difference between a suborbital flight and stable orbit matters for this market.', marketId: 'spacex-launch', likes: 12, liked: false, comments: [] },
] };
export type Order = { id: string; marketId: string; outcome: Outcome; action: Action; quantity: number };
export function quote(market: Market, outcome: Outcome, action: Action, quantity: number) {
  if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > 10000) throw new Error('Enter a whole number from 1 to 10,000 shares.');
  const price = outcome === 'Yes' ? market.price : 100 - market.price;
  const gross = price * quantity;
  // All amounts are integer cents. The 1% demo fee rounds up to one cent.
  const fee = Math.ceil(gross / 100);
  return { price, gross, fee, net: action === 'Buy' ? gross + fee : gross - fee };
}
export function executeTrade(state: DemoState, order: Order, now = new Date()): DemoState {
  if (state.receipts.some(r => r.id === order.id)) throw new Error('This order has already been executed.');
  if (!order.id) throw new Error('Missing order identifier.');
  const market = marketById(order.marketId);
  if (!market) throw new Error('Market not found.');
  if (now.getTime() >= new Date(market.close).getTime()) throw new Error('This market is closed.');
  if (!['Yes', 'No'].includes(order.outcome) || !['Buy', 'Sell'].includes(order.action)) throw new Error('Invalid order.');
  const amounts = quote(market, order.outcome, order.action, order.quantity);
  const existing = state.positions.find(p => p.marketId === order.marketId && p.outcome === order.outcome);
  if (order.action === 'Buy' && amounts.net > state.balance) throw new Error('Not enough virtual funds. Reduce the number of shares.');
  if (order.action === 'Sell' && (!existing || order.quantity > existing.quantity)) throw new Error('You do not hold enough shares of this outcome.');
  const positions = state.positions.filter(p => p !== existing);
  if (order.action === 'Buy') positions.push({ marketId: order.marketId, outcome: order.outcome, quantity: (existing?.quantity ?? 0) + order.quantity, cost: (existing?.cost ?? 0) + amounts.net });
  else if (existing && existing.quantity > order.quantity) positions.push({ ...existing, quantity: existing.quantity - order.quantity, cost: existing.cost - Math.round(existing.cost * order.quantity / existing.quantity) });
  const balance = state.balance + (order.action === 'Buy' ? -amounts.net : amounts.net);
  const receipt: Receipt = { ...order, title: market.title, ...amounts, balanceAfter: balance, timestamp: now.toISOString() };
  return { ...state, balance, positions, receipts: [receipt, ...state.receipts] };
}
export function restoreState(raw: string | null): DemoState {
  if (!raw) return structuredClone(initialState);
  const state = stateSchema.parse(JSON.parse(raw));
  const ids = new Set<string>();
  for (const position of state.positions) {
    const key = `${position.marketId}:${position.outcome}`;
    if (!marketById(position.marketId) || ids.has(key)) throw new Error('Invalid saved position.');
    ids.add(key);
  }
  if (new Set(state.receipts.map(r => r.id)).size !== state.receipts.length) throw new Error('Duplicate saved receipt.');
  if (state.watchlist.some(id => !marketById(id))) throw new Error('Invalid saved watchlist.');
  return state;
}
