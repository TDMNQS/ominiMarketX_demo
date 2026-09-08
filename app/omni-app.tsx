"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  Bell,
  Bookmark,
  Check,
  ChevronRight,
  CircleDollarSign,
  Command,
  Compass,
  Copy,
  ExternalLink,
  Eye,
  Gauge,
  Info,
  Menu,
  MessageCircle,
  Moon,
  MoreHorizontal,
  Newspaper,
  PanelLeftClose,
  PieChart,
  Plus,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Sun,
  TrendingUp,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { toast, Toaster } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DEMO_STARTING_BALANCE,
  MAX_TRADE,
  MIN_TRADE,
  mergeBuyPosition,
  quoteBuy,
  quoteSell,
  reduceSellPosition,
  roundMoney,
  type Outcome,
  type Position,
} from "@/lib/market-engine";
import {
  categoryOptions,
  formatCompact,
  formatUsdc,
  marketById,
  markets,
  priceForOutcome,
  type Category,
  type Market,
} from "@/lib/market-data";

type View = "explore" | "portfolio" | "activity" | "social" | "market";
type TradeMode = "BUY" | "SELL";

type Transaction = {
  id: string;
  type: TradeMode;
  marketId: string;
  outcome: Outcome;
  shares: number;
  price: number;
  fee: number;
  total: number;
  timestamp: string;
};

type SocialPost = {
  id: string;
  name: string;
  handle: string;
  initials: string;
  timestamp: string;
  body: string;
  marketId?: string;
  outcome?: Outcome;
  likes: number;
  comments: number;
};

const seedPositions: Position[] = [
  { marketId: "ramayana", outcome: "YES", shares: 13.45, averagePrice: 0.735, invested: 10 },
  { marketId: "fed-rate", outcome: "NO", shares: 58.82, averagePrice: 0.34, invested: 20 },
];

const seedTransactions: Transaction[] = [
  {
    id: "OMX-D7F2A9",
    type: "BUY",
    marketId: "ramayana",
    outcome: "YES",
    shares: 13.45,
    price: 0.735,
    fee: 0.02,
    total: 10.02,
    timestamp: "Sep 8, 2026 · 10:34 PM",
  },
  {
    id: "OMX-B91C42",
    type: "BUY",
    marketId: "fed-rate",
    outcome: "NO",
    shares: 58.82,
    price: 0.34,
    fee: 0.04,
    total: 20.04,
    timestamp: "Sep 7, 2026 · 6:12 PM",
  },
];

const seedPosts: SocialPost[] = [
  {
    id: "post-1",
    name: "Maya Kapoor",
    handle: "@mayamakesmarkets",
    initials: "MK",
    timestamp: "18m",
    body: "The Ramayana market moved seven points this week. Distribution scale looks strong, but the ₹1,500 crore threshold still leaves meaningful execution risk.",
    marketId: "ramayana",
    outcome: "YES",
    likes: 128,
    comments: 24,
  },
  {
    id: "post-2",
    name: "Arjun Rao",
    handle: "@signalofarjun",
    initials: "AR",
    timestamp: "42m",
    body: "Watching the December rate-cut probability. The interesting signal is not the level—it is how quickly conviction returns after each macro print.",
    marketId: "fed-rate",
    outcome: "NO",
    likes: 86,
    comments: 17,
  },
];

const navItems = [
  { id: "explore" as const, label: "Discover", icon: Compass },
  { id: "portfolio" as const, label: "Portfolio", icon: PieChart },
  { id: "activity" as const, label: "Activity", icon: Activity },
  { id: "social" as const, label: "Social", icon: Users },
];

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand-lockup" aria-label="OmniMarketX Next">
      <span className="brand-mark" aria-hidden="true"><span>O</span></span>
      {!compact && (
        <span className="brand-name">
          OmniMarket<span>X</span>
        </span>
      )}
    </div>
  );
}

function MarketGlyph({ market, small = false }: { market: Market; small?: boolean }) {
  return (
    <span
      className={`market-glyph ${small ? "market-glyph--small" : ""}`}
      style={{ "--glyph-accent": market.accent } as React.CSSProperties}
      aria-hidden="true"
    >
      {market.symbol}
    </span>
  );
}

function MiniTrend({ market }: { market: Market }) {
  const points = market.trend
    .map((value, index) => `${(index / (market.trend.length - 1)) * 132},${44 - value * 0.36}`)
    .join(" ");
  return (
    <svg className="mini-trend" viewBox="0 0 132 48" role="img" aria-label={`${market.shortLabel} trend`}>
      <polyline points={points} fill="none" stroke={market.change >= 0 ? "#31d6a3" : "#ff6688"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PriceChart({ market }: { market: Market }) {
  const width = 720;
  const height = 250;
  const padding = 28;
  const yesPoints = market.trend.map((value, index) => ({
    x: padding + (index / (market.trend.length - 1)) * (width - padding * 2),
    y: height - padding - (value / 100) * (height - padding * 2),
  }));
  const noPoints = yesPoints.map((point, index) => ({ x: point.x, y: height - padding - ((100 - market.trend[index]) / 100) * (height - padding * 2) }));
  const pathFor = (points: { x: number; y: number }[]) => points.map((point, index) => `${index ? "L" : "M"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
  const areaPath = `${pathFor(yesPoints)} L${yesPoints.at(-1)?.x} ${height - padding} L${yesPoints[0].x} ${height - padding} Z`;

  return (
    <div className="chart-shell">
      <div className="chart-head">
        <div>
          <p className="eyebrow">Market probability</p>
          <div className="chart-value">{Math.round(market.yesPrice * 100)}% <span>YES</span></div>
        </div>
        <div className="time-range" aria-label="Chart time range">
          <button>1D</button><button className="active">1W</button><button>1M</button><button>ALL</button>
        </div>
      </div>
      <div className="chart-legend"><span className="yes-dot" /> YES {Math.round(market.yesPrice * 100)}¢ <span className="no-dot" /> NO {Math.round((1 - market.yesPrice) * 100)}¢</div>
      <svg className="price-chart" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img" aria-label={`One week probability chart for ${market.question}`}>
        <defs>
          <linearGradient id={`area-${market.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#31d6a3" stopOpacity="0.24" />
            <stop offset="1" stopColor="#31d6a3" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[25, 50, 75].map((line) => {
          const y = height - padding - (line / 100) * (height - padding * 2);
          return <line key={line} x1={padding} x2={width - padding} y1={y} y2={y} className="chart-grid" />;
        })}
        <path d={areaPath} fill={`url(#area-${market.id})`} />
        <path d={pathFor(noPoints)} fill="none" stroke="#ff5077" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.72" />
        <path d={pathFor(yesPoints)} fill="none" stroke="#31d6a3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={yesPoints.at(-1)?.x} cy={yesPoints.at(-1)?.y} r="5" fill="#31d6a3" stroke="#07130f" strokeWidth="3" />
      </svg>
      <div className="chart-dates"><span>Aug 28</span><span>Aug 30</span><span>Sep 1</span><span>Today</span></div>
    </div>
  );
}

function MarketCard({ market, watched, onOpen, onWatch }: { market: Market; watched: boolean; onOpen: (outcome?: Outcome) => void; onWatch: () => void }) {
  return (
    <article className="market-card">
      <div className="market-card-top">
        <MarketGlyph market={market} />
        <button className={`icon-button ${watched ? "is-watched" : ""}`} aria-label={watched ? `Remove ${market.shortLabel} from watchlist` : `Watch ${market.shortLabel}`} onClick={onWatch}>
          <Bookmark fill={watched ? "currentColor" : "none"} />
        </button>
      </div>
      <button className="market-question" onClick={() => onOpen()}>{market.question}</button>
      <div className="market-probability-row">
        <div><span className="market-probability">{Math.round(market.yesPrice * 100)}%</span><span className={`market-change ${market.change >= 0 ? "positive" : "negative"}`}>{market.change >= 0 ? "+" : ""}{market.change.toFixed(1)}%</span></div>
        <MiniTrend market={market} />
      </div>
      <div className="market-card-meta">
        <span>{formatCompact(market.volume)} vol.</span>
        <span>{formatCompact(market.traders)} traders</span>
        <span>{market.category}</span>
      </div>
      <div className="market-actions">
        <button className="outcome-button yes" onClick={() => onOpen("YES")}>YES <strong>{Math.round(market.yesPrice * 100)}¢</strong></button>
        <button className="outcome-button no" onClick={() => onOpen("NO")}>NO <strong>{Math.round((1 - market.yesPrice) * 100)}¢</strong></button>
      </div>
    </article>
  );
}

function Sidebar({ view, onNavigate, collapsed, setCollapsed }: { view: View; onNavigate: (view: View) => void; collapsed: boolean; setCollapsed: (value: boolean) => void }) {
  return (
    <aside className={`sidebar ${collapsed ? "is-collapsed" : ""}`}>
      <div className="sidebar-brand"><Logo compact={collapsed} /></div>
      <nav aria-label="Primary navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.id} className={view === item.id || (view === "market" && item.id === "explore") ? "active" : ""} onClick={() => onNavigate(item.id)} title={collapsed ? item.label : undefined}>
              <Icon /><span>{item.label}</span>{item.id === "social" && !collapsed && <em>4</em>}
            </button>
          );
        })}
      </nav>
      <div className="sidebar-panel">
        <span className="sidebar-panel-icon"><Sparkles /></span>
        {!collapsed && <><strong>Signal, not noise.</strong><p>Track only the markets that matter to you.</p></>}
      </div>
      <button className="collapse-button" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}>
        <PanelLeftClose /> {!collapsed && <span>Collapse</span>}
      </button>
      {!collapsed && <p className="prototype-note">Candidate prototype · Demo only</p>}
    </aside>
  );
}

function AppHeader({
  balance,
  dark,
  setDark,
  onSearch,
  mobileMenu,
}: {
  balance: number;
  dark: boolean;
  setDark: (dark: boolean) => void;
  onSearch: () => void;
  mobileMenu: () => void;
}) {
  return (
    <header className="app-header">
      <button className="mobile-menu" aria-label="Open navigation" onClick={mobileMenu}><Menu /></button>
      <div className="mobile-brand"><Logo compact /></div>
      <button className="search-trigger" onClick={onSearch}>
        <Search /><span>Search markets, people, topics</span><kbd><Command />K</kbd>
      </button>
      <div className="header-actions">
        <span className="mode-pill"><ShieldCheck /> DEMO</span>
        <span className="balance-pill"><small>Buying power</small><strong>{formatUsdc(balance)} <em>USDC</em></strong></span>
        <button className="icon-button theme-toggle" onClick={() => setDark(!dark)} aria-label={dark ? "Use light theme" : "Use dark theme"}>{dark ? <Sun /> : <Moon />}</button>
        <button className="icon-button notification-button" aria-label="Notifications"><Bell /><span /></button>
        <button className="avatar-button" aria-label="Open Numan Qureshi profile">NQ</button>
      </div>
    </header>
  );
}

function StatCard({ label, value, detail, icon: Icon, tone }: { label: string; value: string; detail: string; icon: typeof Gauge; tone: string }) {
  return (
    <article className="stat-card">
      <span className="stat-icon" style={{ "--stat-tone": tone } as React.CSSProperties}><Icon /></span>
      <div><p>{label}</p><strong>{value}</strong><span>{detail}</span></div>
    </article>
  );
}

function ExploreView({
  onOpenMarket,
  watched,
  toggleWatch,
}: {
  onOpenMarket: (market: Market) => void;
  watched: string[];
  toggleWatch: (id: string) => void;
}) {
  const [category, setCategory] = useState<Category>("All");
  const [sort, setSort] = useState<"Trending" | "Volume" | "Closing soon">("Trending");
  const visibleMarkets = useMemo(() => {
    const list = category === "All" ? [...markets] : markets.filter((market) => market.category === category);
    if (sort === "Volume") return list.sort((a, b) => b.volume - a.volume);
    if (sort === "Closing soon") return list.sort((a, b) => a.closes.localeCompare(b.closes));
    return list.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
  }, [category, sort]);

  return (
    <div className="view-stack">
      <section className="page-heading explore-heading">
        <div>
          <p className="eyebrow">Good evening, Numan</p>
          <h1>Find the signal before the crowd.</h1>
          <p>Explore live questions, understand the evidence, and test your conviction with virtual funds.</p>
        </div>
        <div className="market-pulse"><span className="pulse-dot" /><div><strong>Market pulse</strong><p>6 markets moving · 12,840 active traders</p></div></div>
      </section>

      <section className="stats-grid" aria-label="Demo account summary">
        <StatCard label="Portfolio value" value="30.65 USDC" detail="+4.8% simulated P&L" icon={WalletCards} tone="#31d6a3" />
        <StatCard label="Open positions" value="2 markets" detail="Across 2 categories" icon={PieChart} tone="#9b7cff" />
        <StatCard label="Watchlist" value={`${watched.length} signals`} detail="1 market closing soon" icon={Eye} tone="#ffb13b" />
      </section>

      <section className="markets-section">
        <div className="section-heading-row">
          <div><p className="eyebrow">Explore</p><h2>Markets in motion</h2></div>
          <label className="sort-control"><SlidersHorizontal /><span className="sr-only">Sort markets</span><select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)}><option>Trending</option><option>Volume</option><option>Closing soon</option></select></label>
        </div>
        <div className="category-tabs" role="tablist" aria-label="Market categories">
          {categoryOptions.map((item) => <button role="tab" aria-selected={category === item} className={category === item ? "active" : ""} key={item} onClick={() => setCategory(item)}>{item}</button>)}
        </div>
        <div className="market-grid">
          {visibleMarkets.map((market) => <MarketCard key={market.id} market={market} watched={watched.includes(market.id)} onWatch={() => toggleWatch(market.id)} onOpen={(outcome) => onOpenMarket(market, "BUY", outcome ?? "YES")} />)}
        </div>
      </section>
    </div>
  );
}

function InsightRail({ watched, onOpenMarket }: { watched: string[]; onOpenMarket: (market: Market) => void }) {
  const watchedMarkets = watched.map(marketById);
  return (
    <aside className="insight-rail">
      <div className="rail-card watchlist-card">
        <div className="rail-title"><div><p className="eyebrow">Watchlist</p><h3>Your signals</h3></div><button aria-label="Add a market"><Plus /></button></div>
        {watchedMarkets.length ? watchedMarkets.slice(0, 3).map((market) => (
          <button key={market.id} className="watch-row" onClick={() => onOpenMarket(market)}>
            <MarketGlyph market={market} small /><span><strong>{market.shortLabel}</strong><small>{Math.round(market.yesPrice * 100)}% chance</small></span><em className={market.change >= 0 ? "positive" : "negative"}>{market.change >= 0 ? "+" : ""}{market.change}%</em>
          </button>
        )) : <p className="empty-small">Bookmark a market to track it here.</p>}
      </div>
      <div className="rail-card insight-card">
        <div className="insight-icon"><Sparkles /></div>
        <p className="eyebrow">Signal brief</p>
        <h3>Entertainment is leading today</h3>
        <p>Ramayana gained 6.2 points as trader activity accelerated. Volume is 1.7× its seven-day average.</p>
        <button onClick={() => onOpenMarket(markets[0])}>Review market <ArrowUpRight /></button>
      </div>
      <div className="rail-card learn-card">
        <p className="eyebrow">Learn as you trade</p>
        <h3>What does 73¢ mean?</h3>
        <p>A YES share priced at 73¢ reflects the market&apos;s approximate 73% probability.</p>
        <button onClick={() => toast.info("Learning guide opened in demo mode.")}>2 min guide <ChevronRight /></button>
      </div>
    </aside>
  );
}

function MarketDetail({
  market,
  balance,
  positions,
  initialMode,
  initialOutcome,
  onBack,
  onTrade,
  watched,
  onWatch,
}: {
  market: Market;
  balance: number;
  positions: Position[];
  initialMode: TradeMode;
  initialOutcome: Outcome;
  onBack: () => void;
  onTrade: (transaction: Transaction) => void;
  watched: boolean;
  onWatch: () => void;
}) {
  return (
    <div className="market-detail">
      <div className="market-detail-main">
        <button className="back-link" onClick={onBack}><ArrowLeft /> Back to markets</button>
        <section className="market-title-card">
          <div className="market-title-copy">
            <MarketGlyph market={market} />
            <div><div className="category-line"><span>{market.category}</span><span className="live-label"><i /> Live</span></div><h1>{market.question}</h1></div>
          </div>
          <button className={`watch-large ${watched ? "active" : ""}`} onClick={onWatch}><Bookmark fill={watched ? "currentColor" : "none"} /> {watched ? "Watching" : "Watch"}</button>
          <div className="market-facts">
            <span><strong>{formatCompact(market.volume)} USDC</strong><small>Volume</small></span>
            <span><strong>{formatCompact(market.traders)}</strong><small>Traders</small></span>
            <span><strong>{market.closes}</strong><small>Closes</small></span>
          </div>
        </section>
        <PriceChart market={market} />
        <section className="resolution-card">
          <div className="resolution-head"><div><p className="eyebrow">Transparent by design</p><h2>Resolution details</h2></div><span><ShieldCheck /> Verified rules</span></div>
          <div className="resolution-grid">
            <div><h3>How this market resolves</h3><p>{market.resolution}</p></div>
            <div><h3>Primary source</h3><p>{market.source}</p><button onClick={() => toast.info("External sources are disabled in this prototype.")}>View source <ExternalLink /></button></div>
          </div>
        </section>
      </div>
      <TradeTicket market={market} balance={balance} positions={positions} initialMode={initialMode} initialOutcome={initialOutcome} onTrade={onTrade} />
    </div>
  );
}

function TradeTicket({
  market,
  balance,
  positions,
  initialMode,
  initialOutcome,
  onTrade,
}: {
  market: Market;
  balance: number;
  positions: Position[];
  initialMode: TradeMode;
  initialOutcome: Outcome;
  onTrade: (transaction: Transaction) => void;
}) {
  const [mode, setMode] = useState<TradeMode>(initialMode);
  const [outcome, setOutcome] = useState<Outcome>(initialOutcome);
  const [value, setValue] = useState(() => {
    const initialPosition = positions.find((item) => item.marketId === market.id && item.outcome === initialOutcome);
    return initialMode === "SELL" ? Math.min(initialPosition?.shares ?? 0, 10).toFixed(2) : "10";
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [receipt, setReceipt] = useState<Transaction | null>(null);
  const position = positions.find((item) => item.marketId === market.id && item.outcome === outcome);
  const price = priceForOutcome(market, outcome);
  const numericValue = Number(value);

  const quote = useMemo(() => {
    try {
      return mode === "BUY" ? quoteBuy(numericValue, price) : quoteSell(numericValue, price);
    } catch {
      return null;
    }
  }, [mode, numericValue, price]);

  const validation = useMemo(() => {
    try {
      if (mode === "BUY") {
        const result = quoteBuy(numericValue, price);
        if (result.total > balance) return "Insufficient demo balance.";
      } else {
        quoteSell(numericValue, price);
        if (!position) return `You do not own ${outcome} shares in this market.`;
        if (numericValue > position.shares) return `You can sell up to ${position.shares.toFixed(2)} shares.`;
      }
      return "";
    } catch (error) {
      return error instanceof Error ? error.message : "Enter a valid amount.";
    }
  }, [balance, mode, numericValue, outcome, position, price]);

  const completeTrade = () => {
    if (!quote || validation) return;
    const transaction: Transaction = {
      id: `OMX-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      type: mode,
      marketId: market.id,
      outcome,
      shares: quote.shares,
      price,
      fee: quote.fee,
      total: quote.total,
      timestamp: "Just now",
    };
    onTrade(transaction);
    setConfirmOpen(false);
    setReceipt(transaction);
  };

  return (
    <aside className="trade-ticket" aria-label="Demo trade ticket">
      <div className="ticket-top"><div><p className="eyebrow">Order ticket</p><h2>Practice trade</h2></div><span className="demo-stamp"><ShieldCheck /> Demo</span></div>
      <div className="mode-tabs" role="tablist"><button role="tab" aria-selected={mode === "BUY"} className={mode === "BUY" ? "active" : ""} onClick={() => { setMode("BUY"); setValue("10"); }}>Buy</button><button role="tab" aria-selected={mode === "SELL"} className={mode === "SELL" ? "active" : ""} onClick={() => { setMode("SELL"); setValue(position ? Math.min(position.shares, 10).toFixed(2) : "0"); }}>Sell</button></div>
      <div className="outcome-pair">
        <button className={`yes ${outcome === "YES" ? "active" : ""}`} onClick={() => setOutcome("YES")}><small>YES</small><strong>{Math.round(market.yesPrice * 100)}¢</strong></button>
        <button className={`no ${outcome === "NO" ? "active" : ""}`} onClick={() => setOutcome("NO")}><small>NO</small><strong>{Math.round((1 - market.yesPrice) * 100)}¢</strong></button>
      </div>
      <div className="ticket-balance"><span>{mode === "BUY" ? "Buying power" : "Available to sell"}</span><strong>{mode === "BUY" ? `${formatUsdc(balance)} USDC` : `${position?.shares.toFixed(2) ?? "0.00"} shares`}</strong></div>
      <label className="amount-label"><span>{mode === "BUY" ? "Amount (USDC)" : "Shares to sell"}</span><div className="amount-input"><input inputMode="decimal" value={value} onChange={(event) => setValue(event.target.value)} aria-describedby="trade-limit" /><em>{mode === "BUY" ? "USDC" : "SHARES"}</em></div></label>
      {mode === "BUY" ? <div className="quick-amounts">{[10, 25, 50, 100].map((amount) => <button key={amount} className={numericValue === amount ? "active" : ""} onClick={() => setValue(String(amount))}>{amount}</button>)}</div> : position && <button className="sell-all" onClick={() => setValue(position.shares.toFixed(4))}>Use max · {position.shares.toFixed(2)} shares</button>}
      <p id="trade-limit" className="limit-note">{mode === "BUY" ? `Min ${MIN_TRADE} · Max ${MAX_TRADE.toLocaleString()} USDC` : "Estimated proceeds use the current market price."}</p>
      <div className="quote-breakdown">
        <span><small>{mode === "BUY" ? "Shares (approx.)" : "Gross proceeds"}</small><strong>{quote ? mode === "BUY" ? quote.shares.toFixed(2) : `${formatUsdc(numericValue * price)} USDC` : "—"}</strong></span>
        <span><small>Fee</small><strong>{quote ? `${formatUsdc(quote.fee)} USDC` : "—"}</strong></span>
        <span className="quote-total"><small>{mode === "BUY" ? "Total deducted" : "You receive"}</small><strong>{quote ? `${formatUsdc(quote.total)} USDC` : "—"}</strong></span>
      </div>
      {validation && <p className="validation-message"><Info /> {validation}</p>}
      <Button className="trade-submit" disabled={Boolean(validation)} onClick={() => setConfirmOpen(true)}>{mode === "BUY" ? `Review ${outcome} order` : `Review sale of ${outcome}`}</Button>
      <p className="demo-disclaimer"><ShieldCheck /> Virtual funds only. No real-money transaction will occur.</p>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="confirm-dialog">
          <DialogHeader><DialogTitle>Review your demo order</DialogTitle><DialogDescription>Confirm the market, direction, and complete cost before placing this practice trade.</DialogDescription></DialogHeader>
          <div className="confirm-market"><MarketGlyph market={market} small /><div><p>{market.question}</p><span className={outcome === "YES" ? "yes-text" : "no-text"}>{mode} {outcome} · {Math.round(price * 100)}¢</span></div></div>
          <div className="confirm-grid"><span><small>{mode === "BUY" ? "Estimated shares" : "Shares sold"}</small><strong>{quote?.shares.toFixed(2)}</strong></span><span><small>Fee</small><strong>{formatUsdc(quote?.fee ?? 0)} USDC</strong></span><span className="full"><small>{mode === "BUY" ? "Total deducted" : "Estimated proceeds"}</small><strong>{formatUsdc(quote?.total ?? 0)} USDC</strong></span></div>
          <DialogFooter><Button variant="outline" onClick={() => setConfirmOpen(false)}>Go back</Button><Button className="confirm-action" onClick={completeTrade}><Check /> Place demo order</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(receipt)} onOpenChange={(open) => !open && setReceipt(null)}>
        <DialogContent className="receipt-dialog">
          <div className="receipt-success"><span><Check /></span><p className="eyebrow">Trade complete</p><h2>Your demo order is confirmed</h2><p>Everything you need to understand this transaction is retained here.</p></div>
          <div className="receipt-card"><div className="receipt-market"><MarketGlyph market={market} small /><span>{market.shortLabel}<small>{receipt?.type} {receipt?.outcome}</small></span></div><dl><div><dt>Execution price</dt><dd>{Math.round((receipt?.price ?? 0) * 1000) / 10}¢</dd></div><div><dt>Exact shares</dt><dd>{receipt?.shares.toFixed(4)}</dd></div><div><dt>Fee</dt><dd>{formatUsdc(receipt?.fee ?? 0)} USDC</dd></div><div><dt>{receipt?.type === "BUY" ? "Total deducted" : "Net proceeds"}</dt><dd>{formatUsdc(receipt?.total ?? 0)} USDC</dd></div><div><dt>Transaction ID</dt><dd className="tx-id">{receipt?.id}<Copy onClick={() => { navigator.clipboard?.writeText(receipt?.id ?? ""); toast.success("Transaction ID copied"); }} /></dd></div></dl></div>
          <Button className="receipt-done" onClick={() => setReceipt(null)}>Done</Button>
        </DialogContent>
      </Dialog>
    </aside>
  );
}

function PortfolioView({ positions, onSell }: { positions: Position[]; onSell: (position: Position) => void }) {
  const totalValue = positions.reduce((sum, position) => sum + position.shares * priceForOutcome(marketById(position.marketId), position.outcome), 0);
  const invested = positions.reduce((sum, position) => sum + position.invested, 0);
  const profit = totalValue - invested;
  return (
    <div className="view-stack">
      <section className="page-heading"><div><p className="eyebrow">Portfolio</p><h1>Your positions, ready to act on.</h1><p>Review exposure and manage every open position without hunting for its market.</p></div></section>
      <section className="portfolio-summary">
        <div className="portfolio-total"><span className="stat-icon"><PieChart /></span><div><p>Current value</p><strong>{formatUsdc(totalValue)} USDC</strong><small className={profit >= 0 ? "positive" : "negative"}>{profit >= 0 ? "+" : ""}{formatUsdc(profit)} USDC total return</small></div></div>
        <div><span>Invested</span><strong>{formatUsdc(invested)} USDC</strong></div><div><span>Open positions</span><strong>{positions.length}</strong></div><div><span>Diversification</span><strong>{new Set(positions.map((p) => marketById(p.marketId).category)).size} categories</strong></div>
      </section>
      <section className="positions-card">
        <div className="section-heading-row"><div><p className="eyebrow">Holdings</p><h2>Open positions</h2></div><span className="live-label"><i /> Live prices</span></div>
        {positions.length ? <div className="positions-list">{positions.map((position) => {
          const market = marketById(position.marketId);
          const currentPrice = priceForOutcome(market, position.outcome);
          const currentValue = position.shares * currentPrice;
          const pnl = currentValue - position.invested;
          return <article className="position-row" key={`${position.marketId}-${position.outcome}`}><div className="position-market"><MarketGlyph market={market} small /><div><strong>{market.question}</strong><span className={position.outcome === "YES" ? "yes-text" : "no-text"}>{position.outcome} position · {Math.round(currentPrice * 100)}¢ now</span></div></div><div className="position-metric"><small>Shares</small><strong>{position.shares.toFixed(2)}</strong></div><div className="position-metric"><small>Avg. price</small><strong>{Math.round(position.averagePrice * 1000) / 10}¢</strong></div><div className="position-metric"><small>Current value</small><strong>{formatUsdc(currentValue)} USDC</strong></div><div className={`position-metric ${pnl >= 0 ? "positive" : "negative"}`}><small>Return</small><strong>{pnl >= 0 ? "+" : ""}{formatUsdc(pnl)}</strong></div><Button className="sell-position" variant="outline" onClick={() => onSell(position)}>Sell position <ArrowUpRight /></Button></article>;
        })}</div> : <div className="empty-state"><PieChart /><h3>No open positions</h3><p>Your active demo trades will appear here.</p></div>}
      </section>
      <section className="product-note"><span><Sparkles /></span><div><p className="eyebrow">Improvement spotlight</p><h3>Position-to-action continuity</h3><p>The portfolio now provides a direct Sell action with the market and outcome preselected—reducing navigation, ambiguity, and avoidable errors.</p></div></section>
    </div>
  );
}

function ActivityView({ transactions, onOpenReceipt }: { transactions: Transaction[]; onOpenReceipt: (transaction: Transaction) => void }) {
  return (
    <div className="view-stack">
      <section className="page-heading"><div><p className="eyebrow">Activity</p><h1>Every transaction, in context.</h1><p>Market, outcome, execution, fees, and receipts remain connected long after the trade.</p></div></section>
      <section className="activity-summary"><div><CircleDollarSign /><span><small>Demo volume</small><strong>{formatUsdc(transactions.reduce((sum, tx) => sum + tx.total, 0))} USDC</strong></span></div><div><TrendingUp /><span><small>Orders</small><strong>{transactions.length} completed</strong></span></div><div><ShieldCheck /><span><small>Environment</small><strong>100% virtual</strong></span></div></section>
      <section className="history-card">
        <div className="section-heading-row"><div><p className="eyebrow">Transaction history</p><h2>Recent demo orders</h2></div><button className="export-button" onClick={() => toast.success("Demo CSV prepared")}>Export CSV <ArrowDownRight /></button></div>
        <div className="history-table-wrap"><table className="history-table"><thead><tr><th>Market</th><th>Action</th><th>Shares</th><th>Price</th><th>Fee</th><th>Total</th><th>Date</th><th><span className="sr-only">Receipt</span></th></tr></thead><tbody>{transactions.map((transaction) => {
          const market = marketById(transaction.marketId);
          return <tr key={transaction.id}><td><span className="table-market"><MarketGlyph market={market} small /><span><strong>{market.shortLabel}</strong><small>{market.category}</small></span></span></td><td><span className={`action-badge ${transaction.outcome.toLowerCase()}`}>{transaction.type} {transaction.outcome}</span></td><td>{transaction.shares.toFixed(4)}</td><td>{Math.round(transaction.price * 1000) / 10}¢</td><td>{formatUsdc(transaction.fee)}</td><td><strong>{formatUsdc(transaction.total)} USDC</strong></td><td>{transaction.timestamp}</td><td><button className="receipt-link" onClick={() => onOpenReceipt(transaction)}>View receipt <ChevronRight /></button></td></tr>;
        })}</tbody></table></div>
      </section>
      <section className="product-note"><span><Newspaper /></span><div><p className="eyebrow">Improvement spotlight</p><h3>A history you can actually verify</h3><p>Each row now names the market and outcome, includes the fee, formats precision intentionally, and reopens the complete receipt in one click.</p></div></section>
    </div>
  );
}

function ReceiptViewer({ transaction, onClose }: { transaction: Transaction | null; onClose: () => void }) {
  if (!transaction) return null;
  const market = marketById(transaction.marketId);
  return <Dialog open onOpenChange={(open) => !open && onClose()}><DialogContent className="receipt-dialog"><DialogHeader><DialogTitle>Transaction receipt</DialogTitle><DialogDescription>Complete context for {transaction.id}</DialogDescription></DialogHeader><div className="receipt-card"><div className="receipt-market"><MarketGlyph market={market} small /><span>{market.question}<small>{transaction.type} {transaction.outcome}</small></span></div><dl><div><dt>Execution price</dt><dd>{Math.round(transaction.price * 1000) / 10}¢</dd></div><div><dt>Exact shares</dt><dd>{transaction.shares.toFixed(4)}</dd></div><div><dt>Fee</dt><dd>{formatUsdc(transaction.fee)} USDC</dd></div><div><dt>{transaction.type === "BUY" ? "Total deducted" : "Net proceeds"}</dt><dd>{formatUsdc(transaction.total)} USDC</dd></div><div><dt>Date</dt><dd>{transaction.timestamp}</dd></div><div><dt>Transaction ID</dt><dd className="tx-id">{transaction.id}</dd></div></dl></div><Button onClick={onClose}>Close receipt</Button></DialogContent></Dialog>;
}

function SocialView({ posts, onPost, onOpenMarket }: { posts: SocialPost[]; onPost: (body: string) => void; onOpenMarket: (market: Market) => void }) {
  const [body, setBody] = useState("");
  return (
    <div className="social-layout">
      <div className="social-main">
        <section className="page-heading"><div><p className="eyebrow">Social signal</p><h1>Trade the question. Discuss the evidence.</h1><p>Follow thoughtful analysis and turn market activity into informed conversation.</p></div></section>
        <section className="composer-card"><div className="composer-avatar">NQ</div><div><textarea value={body} onChange={(event) => setBody(event.target.value)} maxLength={280} placeholder="Share your view on a market…" aria-label="Create a social post"/><div className="composer-actions"><span>{body.length}/280</span><Button disabled={!body.trim()} onClick={() => { onPost(body.trim()); setBody(""); }}><Send /> Post insight</Button></div></div></section>
        <div className="feed-tabs"><button className="active">For you</button><button>Following</button><button>Top analysis</button></div>
        <section className="social-feed">{posts.map((post) => {
          const market = post.marketId ? marketById(post.marketId) : null;
          return <article className="post-card" key={post.id}><div className="post-avatar">{post.initials}</div><div className="post-body"><div className="post-author"><span><strong>{post.name}</strong><small>{post.handle} · {post.timestamp}</small></span><button aria-label="Post options"><MoreHorizontal /></button></div><p>{post.body}</p>{market && <button className="linked-market" onClick={() => onOpenMarket(market)}><MarketGlyph market={market} small /><span><small>Linked market</small><strong>{market.shortLabel}</strong></span><em className={post.outcome === "YES" ? "yes-text" : "no-text"}>{post.outcome} · {Math.round(priceForOutcome(market, post.outcome ?? "YES") * 100)}¢</em><ChevronRight /></button>}<div className="post-actions"><button><MessageCircle /> {post.comments}</button><button><TrendingUp /> {post.likes}</button><button><Send /> Share</button></div></div></article>;
        })}</section>
      </div>
      <aside className="social-side"><div className="rail-card"><p className="eyebrow">People to follow</p><h3>Clear thinkers</h3>{[{name:"Ishan Mehta",role:"Macro · 84% accuracy",initials:"IM"},{name:"Sara Chen",role:"Technology · 79% accuracy",initials:"SC"},{name:"Dev Patel",role:"Sports · 77% accuracy",initials:"DP"}].map((person) => <div className="person-row" key={person.name}><span>{person.initials}</span><div><strong>{person.name}</strong><small>{person.role}</small></div><button onClick={(event) => { event.currentTarget.textContent = "Following"; }}>Follow</button></div>)}</div><div className="rail-card community-card"><Users /><h3>Prediction gets better together.</h3><p>Follow people for their reasoning, not only their win rate.</p></div></aside>
    </div>
  );
}

function SearchDialog({ open, onClose, onSelect }: { open: boolean; onClose: () => void; onSelect: (market: Market) => void }) {
  const [query, setQuery] = useState("");
  const results = markets.filter((market) => `${market.question} ${market.category}`.toLowerCase().includes(query.toLowerCase()));
  return <Dialog open={open} onOpenChange={(next) => !next && onClose()}><DialogContent className="search-dialog" showCloseButton={false}><div className="dialog-search"><Search /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search markets or categories…"/><kbd>ESC</kbd></div><div className="search-results"><p className="eyebrow">{query ? `${results.length} results` : "Trending now"}</p>{results.slice(0, 5).map((market) => <button key={market.id} onClick={() => { onSelect(market); onClose(); }}><MarketGlyph market={market} small /><span><strong>{market.question}</strong><small>{market.category} · {formatCompact(market.volume)} volume</small></span><em>{Math.round(market.yesPrice * 100)}%</em></button>)}</div><p className="search-hint"><kbd>↑↓</kbd> Navigate <kbd>↵</kbd> Open market</p></DialogContent></Dialog>;
}

export default function OmniApp() {
  const [view, setView] = useState<View>("explore");
  const [selectedMarket, setSelectedMarket] = useState<Market>(markets[0]);
  const [tradeMode, setTradeMode] = useState<TradeMode>("BUY");
  const [tradeOutcome, setTradeOutcome] = useState<Outcome>("YES");
  const [balance, setBalance] = useState(DEMO_STARTING_BALANCE - 30.06);
  const [positions, setPositions] = useState<Position[]>(seedPositions);
  const [transactions, setTransactions] = useState<Transaction[]>(seedTransactions);
  const [posts, setPosts] = useState<SocialPost[]>(seedPosts);
  const [watched, setWatched] = useState<string[]>(["ramayana", "bitcoin-150k", "fed-rate"]);
  const [dark, setDark] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [receiptView, setReceiptView] = useState<Transaction | null>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);

  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);

  const openMarket = (market: Market, mode: TradeMode = "BUY", outcome: Outcome = "YES") => {
    setSelectedMarket(market);
    setTradeMode(mode);
    setTradeOutcome(outcome);
    setView("market");
    setMobileNavOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigate = (next: View) => {
    setView(next);
    setMobileNavOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleWatch = (id: string) => {
    setWatched((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const executeTrade = (transaction: Transaction) => {
    if (transaction.type === "BUY") {
      setBalance((current) => roundMoney(current - transaction.total));
      setPositions((current) => {
        const existing = current.find((item) => item.marketId === transaction.marketId && item.outcome === transaction.outcome);
        const next = mergeBuyPosition(existing, transaction.marketId, transaction.outcome, transaction.total - transaction.fee, transaction.price);
        return existing ? current.map((item) => item === existing ? next : item) : [...current, next];
      });
    } else {
      setBalance((current) => roundMoney(current + transaction.total));
      setPositions((current) => current.flatMap((item) => {
        if (item.marketId !== transaction.marketId || item.outcome !== transaction.outcome) return [item];
        const next = reduceSellPosition(item, transaction.shares);
        return next ? [next] : [];
      }));
    }
    setTransactions((current) => [transaction, ...current]);
    toast.success(`${transaction.type === "BUY" ? "Purchase" : "Sale"} completed in Demo mode`);
  };

  const addPost = (body: string) => {
    setPosts((current) => [{ id: crypto.randomUUID(), name: "Numan Qureshi", handle: "@numanq", initials: "NQ", timestamp: "now", body, likes: 0, comments: 0 }, ...current]);
    toast.success("Insight posted to the demo feed");
  };

  return (
    <div className={`omni-app ${dark ? "theme-dark" : "theme-light"} ${collapsed ? "nav-collapsed" : ""}`}>
      <Toaster theme={dark ? "dark" : "light"} position="bottom-right" richColors />
      <Sidebar view={view} onNavigate={navigate} collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className={`mobile-drawer-backdrop ${mobileNavOpen ? "open" : ""}`} onClick={() => setMobileNavOpen(false)} />
      <div className={`mobile-drawer ${mobileNavOpen ? "open" : ""}`}><div className="mobile-drawer-head"><Logo /><button onClick={() => setMobileNavOpen(false)} aria-label="Close menu"><X /></button></div>{navItems.map((item) => { const Icon = item.icon; return <button className={view === item.id ? "active" : ""} key={item.id} onClick={() => navigate(item.id)}><Icon /> {item.label}</button>; })}<p>Candidate prototype · Demo only</p></div>
      <AppHeader balance={balance} dark={dark} setDark={setDark} onSearch={() => setSearchOpen(true)} mobileMenu={() => setMobileNavOpen(true)} />
      <main className="app-main">
        <div className={`content-shell ${view === "explore" ? "with-rail" : ""}`}>
          {view === "explore" && <><ExploreView onOpenMarket={openMarket} watched={watched} toggleWatch={toggleWatch} /><InsightRail watched={watched} onOpenMarket={openMarket} /></>}
          {view === "market" && <MarketDetail key={`${selectedMarket.id}-${tradeMode}-${tradeOutcome}`} market={selectedMarket} balance={balance} positions={positions} initialMode={tradeMode} initialOutcome={tradeOutcome} onBack={() => navigate("explore")} onTrade={executeTrade} watched={watched.includes(selectedMarket.id)} onWatch={() => toggleWatch(selectedMarket.id)} />}
          {view === "portfolio" && <PortfolioView positions={positions} onSell={(position) => openMarket(marketById(position.marketId), "SELL", position.outcome)} />}
          {view === "activity" && <ActivityView transactions={transactions} onOpenReceipt={setReceiptView} />}
          {view === "social" && <SocialView posts={posts} onPost={addPost} onOpenMarket={openMarket} />}
        </div>
      </main>
      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">{navItems.map((item) => { const Icon = item.icon; const active = view === item.id || (view === "market" && item.id === "explore"); return <button key={item.id} className={active ? "active" : ""} onClick={() => navigate(item.id)}><Icon /><span>{item.label}</span></button>; })}</nav>
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} onSelect={openMarket} />
      <ReceiptViewer transaction={receiptView} onClose={() => setReceiptView(null)} />
    </div>
  );
}
