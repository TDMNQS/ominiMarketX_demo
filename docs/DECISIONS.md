# Product and design decisions

## 1. Treat the assignment as a product problem

The redesign starts with observed friction, not a style trend. Each major feature is traceable to a user need: understand risk, take action from context, and verify what happened later.

## 2. Keep the first viewport operational

The desktop opening view shows navigation, Demo state, buying power, account context, live signals, filters, and real market cards. A user can begin exploring immediately. This is more useful for a returning product user than a full-screen promotional hero.

## 3. Make Demo mode impossible to miss

OmniMarketX already framed practice trading clearly. The redesign carries that strength across the global header, order ticket, pre-trade review, and receipt. The language consistently says “demo,” “practice,” “virtual,” or “simulated.”

## 4. Connect objects to their next action

The Portfolio is the natural place to manage a holding. Its direct Sell action passes the market ID and outcome into the order ticket, reducing the number of decisions the user must repeat. The user still reviews quantity, price, fees, and proceeds before confirming.

## 5. Preserve transaction context

A financial record is only useful if it can answer: what market, what outcome, what direction, how many shares, at what price, with what fee, when, and under which ID? The Activity design answers all eight questions without forcing users to reconstruct the trade.

## 6. Use progressive disclosure

Discovery cards show decision-level information. Market detail adds evidence and rules. The ticket adds calculation. Review adds confirmation. Receipt adds durable verification. This keeps each surface focused while retaining depth.

## 7. Design responsiveness by priority, not shrinkage

On mobile, the trade ticket moves immediately below the market question, before the large chart and resolution details. The sidebar becomes a bottom navigation bar plus an optional drawer. Horizontal summaries become touch-scrollable cards. This changes information order to match mobile intent instead of merely compressing desktop.

## 8. Prefer deterministic, lightweight visuals

Market symbols, sparklines, and the probability chart are CSS/SVG rather than downloaded media. This reduces layout shift, external requests, and image payload while keeping the interface visually specific.
