'use client';
import { useRef, useState } from 'react';
import { ArrowRight, Info, ShieldCheck, Wallet } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { executeTrade, quote, type Action, type Order, type Outcome, type Receipt } from '@/lib/omnimarket/engine';
import { money, type Market } from '@/lib/omnimarket/markets';
import { trade, useDemo } from '@/lib/omnimarket/store';
import { ReceiptDialog } from './receipt';
export function TradeTicket({ market, initialOutcome = 'Yes', initialAction = 'Buy' }: { market: Market; initialOutcome?: Outcome; initialAction?: Action }) {
 const { state, ready } = useDemo(); const [outcome,setOutcome] = useState<Outcome>(initialOutcome); const [action,setAction] = useState<Action>(initialAction); const [quantity,setQuantity] = useState('100'); const [error,setError] = useState(''); const [review,setReview] = useState<Order|null>(null); const [receipt,setReceipt] = useState<Receipt|null>(null); const lock = useRef(false);
 const holding = state.positions.find(p=>p.marketId===market.id && p.outcome===outcome);
 let amounts: ReturnType<typeof quote> | null = null;
 try { amounts = quote(market,outcome,action,Number(quantity)); } catch {}
 const closed = Date.now() >= new Date(market.close).getTime();
 const preview = () => {
  setError('');
  const order: Order = { id: crypto.randomUUID(), marketId: market.id, outcome, action, quantity: Number(quantity) };
  try { executeTrade(state,order); setReview(order); } catch(e) { setError((e as Error).message); }
 };
 const confirm = () => {
  if (!review || lock.current) return;
  lock.current = true;
  try { const result=trade(review); setReview(null); setReceipt(result); setError(''); }
  catch(e) { setReview(null); setError((e as Error).message); }
  finally { lock.current=false; }
 };
 return <>
  <section className="panel flex flex-col gap-5 p-5"><div className="flex items-center justify-between"><h2 className="text-lg font-medium">Make your move</h2><span className="rounded-md border border-border px-2 py-1 text-sm text-muted-foreground">Virtual trade</span></div>
   <ToggleGroup aria-label="Trade action" value={[action]} onValueChange={values=>{if(values[0]){setAction(values[0] as Action);setError('');}}} className="w-full" variant="outline"><ToggleGroupItem className="flex-1" value="Buy">Buy</ToggleGroupItem><ToggleGroupItem className="flex-1" value="Sell">Sell</ToggleGroupItem></ToggleGroup>
   <form onSubmit={e=>{e.preventDefault();preview();}} className="flex flex-col gap-5">
    <FieldGroup><Field><FieldLabel>Outcome</FieldLabel><ToggleGroup aria-label="Trade outcome" value={[outcome]} onValueChange={values=>{if(values[0]){setOutcome(values[0] as Outcome);setError('');}}} variant="outline" className="w-full"><ToggleGroupItem className="flex-1" value="Yes">Yes · {market.price}¢</ToggleGroupItem><ToggleGroupItem className="flex-1" value="No">No · {100-market.price}¢</ToggleGroupItem></ToggleGroup></Field>
     <Field data-invalid={!!error}><div className="flex items-center justify-between"><FieldLabel htmlFor="share-quantity">Number of shares</FieldLabel><span className="font-mono text-sm text-muted-foreground">{outcome} @ {outcome==='Yes'?market.price:100-market.price}¢</span></div><Input id="share-quantity" className="h-12" type="number" inputMode="numeric" min={1} max={10000} step={1} required value={quantity} aria-invalid={!!error} aria-describedby={error ? 'trade-error' : 'quantity-hint'} onChange={e=>{setQuantity(e.target.value);setError('');}}/><p id="quantity-hint" className="text-sm text-muted-foreground">Whole shares only · 10,000 per trade maximum</p><div className="flex gap-2">{[10,50,100].map(n=><button key={n} type="button" className="chip flex-1 border border-border" onClick={()=>{setQuantity(String(n));setError('');}}>{n}</button>)}{action==='Sell' && <button className="chip border border-border" type="button" onClick={()=>setQuantity(String(Math.min(10000,holding?.quantity??0)))}>Max</button>}</div>{error && <FieldError id="trade-error">{error}</FieldError>}</Field>
    </FieldGroup>
    <div className="flex items-center justify-between text-sm"><span className="flex items-center gap-2 text-muted-foreground"><Wallet className="size-4"/>{action==='Buy'?'Available balance':'Available shares'}</span><span className="font-mono">{action==='Buy'?money(state.balance):`${holding?.quantity??0} ${outcome}`}</span></div>
    <dl className="flex flex-col gap-3 border-y border-border py-4 text-sm"><div className="flex justify-between"><dt className="text-muted-foreground">{action==='Buy'?'Cost':'Gross proceeds'}</dt><dd className="font-mono">{amounts?money(amounts.gross):'—'}</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Demo fee (1%, rounded up)</dt><dd className="font-mono">{amounts?money(amounts.fee):'—'}</dd></div><div className="flex justify-between font-medium"><dt>{action==='Buy'?'Total cost':'You receive'}</dt><dd className="font-mono">{amounts?money(amounts.net):'—'}</dd></div></dl>
    {action==='Buy' && amounts && <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Payout if correct*</span><span className="font-mono text-primary">{money(Number(quantity)*100)}</span></div>}
    <button className="action w-full" type="submit" disabled={!ready||closed||(action==='Sell'&&!holding)}>{closed?'Market closed':!ready?'Loading demo…':action==='Sell'&&!holding?`No ${outcome} shares to sell`:`Review ${action.toLowerCase()}`}{!closed&&<ArrowRight className="size-4"/>}</button>
   </form>
   <p className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"><ShieldCheck className="mt-0.5 size-4 shrink-0"/>No real money. Fixed sample prices. No slippage or order book.</p>{action==='Buy'&&<p className="text-sm leading-relaxed text-muted-foreground">*Each correct share represents $1 at resolution. This demo does not settle markets or pay out funds.</p>}
  </section>
  <Dialog open={!!review} onOpenChange={open=>{if(!open)setReview(null);}}><DialogContent className="sm:max-w-md"><DialogHeader><DialogTitle>Review your trade</DialogTitle><DialogDescription>Confirm the details before executing this virtual order.</DialogDescription></DialogHeader><p className="text-base font-medium">{market.title}</p><dl className="flex flex-col gap-3 rounded-lg border border-border p-4"><div className="flex justify-between"><dt className="text-muted-foreground">Action / outcome</dt><dd>{action} {outcome}</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Shares</dt><dd className="font-mono">{quantity}</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Execution price</dt><dd className="font-mono">{amounts?.price}¢</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Fee</dt><dd className="font-mono">{amounts&&money(amounts.fee)}</dd></div><div className="flex justify-between"><dt>{action==='Buy'?'Total debit':'Net credit'}</dt><dd className="font-mono text-primary">{amounts&&money(amounts.net)}</dd></div></dl><p className="flex items-start gap-2 text-sm text-muted-foreground"><Info className="mt-0.5 size-4 shrink-0"/>Your balance and holdings are checked again at execution.</p><button className="action" onClick={confirm}>Confirm {action.toLowerCase()}</button><button className="action-secondary" onClick={()=>setReview(null)}>Go back</button></DialogContent></Dialog>
  <ReceiptDialog receipt={receipt} onClose={()=>setReceipt(null)}/>
 </>;
}
