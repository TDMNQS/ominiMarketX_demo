# OmniMarketX Next

A production-minded frontend redesign created by **Numan Qureshi** for the OmniMarketX Future Foundry evaluation.

**Live prototype:** [omnimarketx-next-numan.tdmnqs.chatgpt.site](https://omnimarketx-next-numan.tdmnqs.chatgpt.site)

This is not a visual clone. It is a focused product-improvement prototype built from first-hand product testing. The work preserves OmniMarketX’s strongest idea—safe practice prediction trading—while making discovery, order review, position management, and transaction verification easier to understand.

> **Evaluation prototype:** all markets, balances, orders, people, and activity are simulated. No real funds are used. This repository is not an official OmniMarketX product or financial advice.

## Product thesis

Prediction markets ask users to make decisions under uncertainty. The interface should therefore optimize for **clarity, context, and reversible exploration**, not visual noise.

The redesign uses a compact “market intelligence workspace” model:

- the first screen is a working discovery surface, not a marketing hero;
- Demo mode and virtual buying power remain continuously visible;
- probability, movement, volume, and market rules are readable before a trade;
- the order ticket explains fees and totals before confirmation;
- Portfolio turns holdings into actions with a direct, prefilled Sell flow;
- Activity preserves the market, outcome, fee, precision, and full receipt;
- Social posts stay linked to the market being discussed.

## The problems I chose to solve

| Product observation | Why it matters | Implemented response |
| --- | --- | --- |
| A purchased position was visible in Portfolio, but selling required manually finding the market again. | Extra navigation creates uncertainty and increases the chance of choosing the wrong market or outcome. | Every eligible position has a **Sell position** action. It opens the correct market in Sell mode with the owned outcome and available shares preselected. |
| The completion receipt was informative, while the visible history table omitted the market name, outcome, and fee. | Returning users could not identify similar transactions from history alone. | Contextual history rows plus a **View receipt** action that retains execution price, exact shares, fee, total, date, and transaction ID. |
| Raw precision and labels such as “Bought BUY” reduce comprehension. | Financial interfaces need intentional precision and unambiguous language. | Human-readable labels such as **BUY YES**, consistent money formatting, and four-decimal share precision only where useful. |
| Demo safety framing was strong but fragmented across screens. | First-time users should never wonder whether a real-money action occurred. | Persistent Demo badge, virtual buying power, trade disclaimer, explicit review step, and confirmation receipt. |
| Market rules were valuable but competed with the trading controls. | Users need the rules without losing the action context. | Structured resolution card with the threshold, exclusions, source, and verified-rules treatment. |

## Working features

- Responsive market discovery with category filters and three sorting modes
- Market watchlist and contextual signal rail
- Keyboard-accessible search (`Ctrl/Cmd + K`)
- Detailed probability chart, market metadata, and resolution criteria
- YES/NO demo order ticket with live fee and share calculation
- Minimum/maximum order validation and insufficient-balance protection
- Order review dialog and complete transaction receipt
- Direct Portfolio → Sell workflow with oversell protection and max-share action
- Context-rich transaction history with reopenable receipts
- Social feed with market-linked analysis and working post composer
- Dark and light themes
- Desktop, tablet, and mobile navigation patterns
- Reduced-motion support, semantic labels, focus states, and keyboard interaction

## Technical approach

- **React 19 + TypeScript** for typed, stateful UI
- **Vinext / Vite** for a Cloudflare Workers-compatible production build
- **Shadcn primitives** for accessible dialogs and buttons
- **Pure SVG charts** and CSS-native visuals to avoid unnecessary image weight
- A framework-independent market engine for quotes, fees, weighted positions, and sell validation
- Intentional component boundaries around discovery, market detail, trade ticket, Portfolio, Activity, and Social
- No external API keys, trackers, or third-party data dependencies

## Quality checks

```bash
npm ci
npm run lint
npm test
npm run build
```

The test suite covers quote precision, fee calculations, trade limits, weighted-average positions, overselling, rendered production HTML, component semantics, and the final build contract. See [docs/TESTING.md](docs/TESTING.md) for the full matrix.

## Review path

For the fastest product review:

1. Open **Portfolio** and click **Sell position** on the Ramayana holding.
2. Review the preselected market, YES outcome, owned shares, estimated proceeds, and fee.
3. Place the demo order and inspect the complete receipt.
4. Open **Activity** to see the new transaction with its market context.
5. Use **View receipt** to verify the full record.
6. Resize to a phone width to review the reordered trade-first mobile experience.

## Repository scope and rights

This prototype was independently authored for candidate evaluation using publicly visible product behavior and the assignment brief. No private OmniMarketX source code or production data was used. See [LICENSE.md](LICENSE.md) for the evaluation-use notice.

## Author

**Numan Qureshi**  
Frontend / Full-stack / AI Engineering candidate
