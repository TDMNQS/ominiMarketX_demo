'use client';
import Link from 'next/link';
import { ArrowUpRight, Clock3, Star, TrendingDown, TrendingUp, Users } from 'lucide-react';
import { compact, imagePosition, type Market } from '@/lib/omnimarket/markets';
import { toggleWatchlist, useDemo } from '@/lib/omnimarket/store';
import { cn } from '@/lib/utils';
export function MarketArt({ market, className = '' }: { market: Market; className?: string }) { return <div role="img" aria-label={`${market.category} editorial illustration`} className={cn('market-art shrink-0 rounded-lg', className)} style={{ backgroundPosition: imagePosition(market.image) }}/>; }
export function MarketCard({ market, index = 0 }: { market: Market; index?: number }) {
 const { state, ready } = useDemo(); const saved = state.watchlist.includes(market.id);
 return <article className="panel market-card reveal flex min-w-0 flex-col" style={{ animationDelay: `${index * 55}ms` }}>
  <div className="flex items-center justify-between px-4 pt-4"><span className="text-sm text-muted-foreground">{market.category}</span><button className={cn('icon-button size-7',saved && 'text-primary')} aria-label={`${saved ? 'Remove' : 'Add'} ${market.title} ${saved ? 'from' : 'to'} watchlist`} aria-pressed={saved} disabled={!ready} onClick={() => toggleWatchlist(market.id)}><Star className="size-4" fill={saved ? 'currentColor' : 'none'}/></button></div>
  <Link href={`/market/${market.id}`} className="flex min-h-24 items-start gap-3 px-4 pt-3"><MarketArt market={market} className="size-12"/><h3 className="text-pretty text-base leading-snug font-medium hover:text-primary">{market.title}</h3></Link>
  <div className="flex items-end justify-between px-4 py-4"><div className="flex items-baseline gap-2"><span className="font-mono text-[30px] leading-none font-medium tracking-tight">{market.price}<span className="text-xl">%</span></span><span className="text-sm text-muted-foreground">chance</span></div><span className={cn('flex items-center gap-1 font-mono text-sm',market.change >= 0 ? 'text-primary' : 'text-destructive')}>{market.change >= 0 ? <TrendingUp className="size-4"/> : <TrendingDown className="size-4"/>}{market.change > 0 ? '+' : ''}{market.change} pp</span></div>
  <div className="grid grid-cols-2 gap-2 px-4"><Link className="outcome-yes" href={`/market/${market.id}?outcome=Yes`}>Yes <span className="font-mono">{market.price}¢ <ArrowUpRight className="inline size-3.5"/></span></Link><Link className="outcome-no" href={`/market/${market.id}?outcome=No`}>No <span className="font-mono">{100-market.price}¢ <ArrowUpRight className="inline size-3.5"/></span></Link></div>
  <div className="mx-4 mt-4 flex items-center justify-between border-t border-border py-3 text-sm text-muted-foreground"><span>${compact(market.volume)} vol.</span><span className="flex items-center gap-1.5"><Users className="size-3.5"/>{compact(market.traders)}</span><span className="flex items-center gap-1.5"><Clock3 className="size-3.5"/>{new Date(market.close).toLocaleDateString('en-US',{month:'short',day:'numeric',timeZone:'UTC'})}</span></div>
 </article>;
}
