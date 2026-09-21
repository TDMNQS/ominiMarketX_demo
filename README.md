# OmniMarketX Next

A production-grade UI/UX rework built by **Numan Qureshi** for the OmniMarketX Future Foundry evaluation.

This is not a skin-deep copy. It's a targeted product-improvement prototype grounded in hands-on use of the original product. The build keeps OmniMarketX's best idea — low-risk practice prediction trading — while making it simpler to discover markets, review orders, manage positions, and confirm transactions.

> **Evaluation build:** every market, balance, order, user, and activity feed is simulated. No real money changes hands. This repo is an independent evaluation project, not an official OmniMarketX release, and nothing here should be read as financial advice.

## Design philosophy

Prediction markets force decisions under uncertainty, so the interface has to prioritize **clarity, context, and low-risk exploration** over visual flourish.

The rework is built around a compact "market intelligence workspace" concept:

- discovery is the landing experience, not a marketing banner;
- Demo mode and virtual buying power stay visible at all times; 
- probability, price movement, volume, and market terms are legible before any trade;
- the order ticket spells out fees and totals ahead of confirmation;
- Portfolio turns each holding into a one-click action via a pre-filled Sell flow;
- Activity logs keep the market, outcome, fee, decimal precision, and full receipt intact;
- Social posts stay tied to the market they reference.

## Problems addressed

| What I noticed | Why it's a problem | How I fixed it |
| --- | --- | --- |
| A held position showed up in Portfolio, but selling meant hunting down that market again manually. | The extra steps invite confusion and raise the odds of picking the wrong market or outcome. | Every sellable position now has a **Sell position** button that jumps straight into Sell mode with the right outcome and share count already filled in. |
| The confirmation receipt was detailed, but the history table left out the market name, outcome, and fee. | Without that context, users can't tell transactions apart later just by scanning history. | History rows now carry full context, plus a **View receipt** link that preserves execution price, exact share count, fee, total, date, and transaction ID. |
| Unrounded numbers and phrasing like "Bought BUY" hurt readability. | Money-related interfaces demand deliberate precision and plain language. | Clear labeling such as **BUY YES**, uniform currency formatting, and four-decimal precision only where it's actually useful. |
| The demo-safety messaging was solid but scattered across different screens. | New users shouldn't ever have to guess whether a real transaction just happened. | An always-visible Demo badge, virtual buying power, a trade disclaimer, a dedicated review step, and a final confirmation receipt. |
| Market rules mattered but crowded out the trading controls. | People need the rules on hand without losing sight of the action they're taking. | A dedicated resolution card covering the threshold, exclusions, source, and a verified-rules indicator. |

## What's working

- Responsive market discovery with category filters and three sort options
- Watchlist plus a contextual signal sidebar
- Keyboard shortcut search (`Ctrl/Cmd + K`)
- Full probability chart, market metadata, and resolution criteria
- YES/NO demo order ticket with real-time fee and share math
- Min/max order limits and insufficient-balance safeguards
- Order review modal and a complete transaction receipt
- One-click Portfolio → Sell path with oversell protection and a max-shares shortcut
- Transaction history with reopenable, context-rich receipts
- Social feed tied to specific markets, with a working post composer
- Light and dark themes
- Layouts tuned for desktop, tablet, and mobile
- Reduced-motion support, semantic markup, visible focus states, and full keyboard navigation

## Under the hood

- **React 19 + TypeScript** for a typed, stateful UI
- **Vinext / Vite** for a build that deploys cleanly to Cloudflare Workers
- **Shadcn primitives** for accessible dialogs and buttons
- **Pure SVG charts** and CSS-based visuals instead of heavy images
- A standalone market engine handling quotes, fees, weighted positions, and sell validation
- Clear component boundaries between discovery, market detail, trade ticket, Portfolio, Activity, and Social
- No external API keys, trackers, or third-party data dependencies

## Running the checks

```bash
npm ci
npm run lint
npm test
npm run build
```

Tests cover quote precision, fee math, order limits, weighted-average position tracking, oversell handling, rendered production HTML, component semantics, and the final build contract. Full breakdown in [docs/TESTING.md](docs/TESTING.md).

## Suggested review flow

For the quickest walkthrough:

1. Go to **Portfolio** and hit **Sell position** on the Ramayana holding.
2. Check the pre-filled market, YES outcome, share count, estimated proceeds, and fee.
3. Submit the demo order and review the resulting receipt.
4. Open **Activity** to confirm the new entry shows full market context.
5. Click **View receipt** to double-check the complete record.
6. Shrink the window to phone width to see the trade-first mobile layout.

## Scope and rights

This prototype was built independently for candidate evaluation, based only on publicly observable product behavior and the assignment brief. No proprietary OmniMarketX source code or production data was involved. See [LICENSE.md](LICENSE.md) for the evaluation-use terms.

## Author

**Numan Qureshi**
Frontend / Full-stack / AI Engineering candidate
