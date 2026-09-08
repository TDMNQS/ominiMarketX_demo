# Test and verification matrix

## Automated checks

| Area | Scenario | Expected behavior |
| --- | --- | --- |
| Buy quote | 10 USDC at 73.5¢ | 13.6054 shares, 0.02 USDC fee, 10.02 total |
| Trade limits | Below 10 or above 5,000 USDC | Order rejected with a specific limit message |
| Sell quote | 10 shares at 73¢ | Fee deducted and net proceeds disclosed |
| Repeat buy | Add a second order to an existing holding | Shares and invested amount merge; average price is weighted |
| Oversell | Sell more than the owned quantity | Order blocked before confirmation |
| Full exit | Sell the exact available quantity | Position closes cleanly |
| Production output | Request `/` from the built Worker | HTTP 200 HTML response with preview metadata |
| Accessible primitives | Progress and dialogs | Semantic values and deterministic output retained |
| Build contract | Production compilation | Client, server, RSC, SSR, and Worker outputs complete |

## Browser-verified flows

| Flow | Checks |
| --- | --- |
| Discover | Market cards render, probability context is visible, category tabs and sorting are usable |
| Search | `Ctrl/Cmd + K` opens search; selecting a result opens the correct market |
| Buy | Outcome and amount update calculations; invalid amounts disable review; review precedes execution |
| Portfolio → Sell | Correct market/outcome is preselected; available shares are visible; max quantity works |
| Receipt | Price, exact shares, fee, total, and transaction ID are visible after execution |
| Activity | New transaction appears first with market/outcome context; receipt can be reopened |
| Social | Composer enforces a 280-character limit and inserts the submitted post into the feed |
| Theme | Light/dark control updates the complete visual system |
| Responsive rules | Sidebar, insight rail, grids, trade ordering, and bottom navigation were verified against the 1,260 px, 1,020 px, 800 px, and 560 px breakpoint rules |

## Edge cases intentionally handled

- Empty or non-numeric order input
- Price outside the valid 0–1 probability range
- Buy below minimum or above maximum
- Buy total greater than the demo balance
- Sell without a matching position
- Sell quantity greater than available shares
- Exact full-position exit
- Empty watchlist and empty Portfolio states
- Long market labels in compact rows
- Reduced-motion preference

## Known prototype boundaries

- Market prices and social data are deterministic fixtures for evaluation.
- State lasts for the active browser session; no production account or settlement backend is connected.
- External resolution sources are labelled but intentionally not opened from the prototype.
- Authentication, KYC, deposits, real-money trading, and blockchain settlement are outside this frontend assignment’s scope.
