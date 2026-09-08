'use client';
import useSWR, { mutate } from 'swr';
import { toast } from 'sonner';
import { executeTrade, initialState, restoreState, type DemoState, type Order } from './engine';
const KEY = 'omnimarketx-demo-v1';
let current: DemoState | undefined;
let storageWarning = false;
function load() {
  if (current) return current;
  try { current = restoreState(window.localStorage.getItem(KEY)); }
  catch { current = structuredClone(initialState); storageWarning = true; }
  return current;
}
function commit(next: DemoState) {
  current = next;
  try { window.localStorage.setItem(KEY, JSON.stringify(next)); }
  catch { storageWarning = true; toast.error('Browser storage is unavailable. Changes will last only for this session.'); }
  void mutate(KEY, next, { revalidate: false });
}
export function useDemo() {
  const { data = initialState, isLoading } = useSWR(KEY, load, { fallbackData: initialState, revalidateOnFocus: false, revalidateOnReconnect: false });
  return { state: data, ready: !isLoading && !!current, storageWarning };
}
export function trade(order: Order) {
  const next = executeTrade(load(), order);
  commit(next);
  return next.receipts[0];
}
export function toggleWatchlist(id: string) {
  const state = load();
  const included = state.watchlist.includes(id);
  commit({ ...state, watchlist: included ? state.watchlist.filter(x => x !== id) : [...state.watchlist, id] });
  toast.success(included ? 'Removed from watchlist' : 'Added to watchlist');
}
export function addPost(text: string, marketId?: string) {
  const clean = text.trim();
  const state = load();
  if (!clean || clean.length > 600) throw new Error('Write a post between 1 and 600 characters.');
  if (state.posts.length >= 500) throw new Error('Demo post limit reached. Reset the demo to start again.');
  commit({ ...state, posts: [{ id: crypto.randomUUID(), author: 'You', initials: 'NQ', text: clean, marketId, likes: 0, liked: false, comments: [] }, ...state.posts] });
}
export function likePost(id: string) {
  const state = load();
  commit({ ...state, posts: state.posts.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p) });
}
export function commentOnPost(id: string, text: string) {
  const clean = text.trim();
  if (!clean || clean.length > 300) throw new Error('Comments must contain 1–300 characters.');
  const state = load();
  if ((state.posts.find(p => p.id === id)?.comments.length ?? 0) >= 100) throw new Error('Demo comment limit reached.');
  commit({ ...state, posts: state.posts.map(p => p.id === id ? { ...p, comments: [...p.comments, { id: crypto.randomUUID(), text: clean }] } : p) });
}
export function resetDemo() { commit(structuredClone(initialState)); toast.success('Demo reset. Your virtual balance is $10,000.'); }
