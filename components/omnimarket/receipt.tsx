'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowUpRight, Check, Copy, Download, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Field, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { money } from '@/lib/omnimarket/markets';
import { type Receipt } from '@/lib/omnimarket/engine';
import { addPost } from '@/lib/omnimarket/store';
export function downloadFile(content: string, name: string, type: string) {
 const url = URL.createObjectURL(new Blob([content], { type }));
 const anchor = document.createElement('a'); anchor.href = url; anchor.download = name; anchor.click();
 setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function ReceiptDialog({ receipt, onClose }: { receipt: Receipt | null; onClose: () => void }) {
 return <Dialog open={!!receipt} onOpenChange={open => { if (!open) onClose(); }}><DialogContent className="sm:max-w-lg">{receipt && <ReceiptBody key={receipt.id} receipt={receipt}/>}</DialogContent></Dialog>;
}
function ReceiptBody({ receipt: r }: { receipt: Receipt }) {
 const [sharing, setSharing] = useState(false); const [shared, setShared] = useState(false);
 const [text, setText] = useState(`I ${r.action === 'Buy' ? 'bought' : 'sold'} ${r.quantity} ${r.outcome} shares on “${r.title}” at ${r.price}¢ in the OmniMarketX demo.`);
 return <>
  <DialogHeader><span className="mb-2 flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary"><Check className="size-5"/></span><DialogTitle>Trade complete</DialogTitle><DialogDescription>Virtual trade receipt · Saved in this browser</DialogDescription></DialogHeader>
  <div className="rounded-lg border border-border bg-card p-4"><span className="text-sm text-primary">{r.action} {r.outcome}</span><h3 className="mt-2 text-base font-medium">{r.title}</h3></div>
  <dl className="flex flex-col gap-3 text-sm">{[['Shares',r.quantity.toLocaleString()],['Execution price',`${r.price}¢ per share`],[r.action==='Buy' ? 'Gross cost' : 'Gross proceeds', money(r.gross)],['Fee (1%, rounded up)',money(r.fee)],[r.action==='Buy' ? 'Total debited' : 'Net credited',money(r.net)],['Balance after this trade',money(r.balanceAfter)],['Executed (UTC)',new Date(r.timestamp).toLocaleString('en-US',{timeZone:'UTC'})]].map(([label,value])=><div key={label} className="flex items-start justify-between gap-4"><dt className="text-muted-foreground">{label}</dt><dd className="text-right font-mono">{value}</dd></div>)}</dl>
  <div className="flex items-center justify-between gap-2 border-t border-border pt-3"><span className="min-w-0"><span className="block text-sm text-muted-foreground">Transaction ID</span><span className="break-all font-mono text-sm">{r.id}</span></span><button className="icon-button" aria-label="Copy transaction ID" onClick={async()=>{try{await navigator.clipboard.writeText(r.id);toast.success('Transaction ID copied');}catch{toast.error('Clipboard is unavailable. Select and copy the ID manually.');}}}><Copy className="size-4"/></button></div>
  <div className="grid grid-cols-2 gap-2"><button className="action-secondary" onClick={()=>downloadFile(JSON.stringify(r,null,2),`omx-receipt-${r.id}.json`,'application/json')}><Download className="size-4"/>Receipt</button><Link href="/portfolio" className="action">Portfolio <ArrowUpRight className="size-4"/></Link></div>
  {!shared && <button onClick={()=>setSharing(!sharing)} className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground hover:text-primary"><Share2 className="size-4"/>{sharing ? 'Cancel sharing' : 'Share your perspective'}</button>}
  {sharing && !shared && <form className="flex flex-col gap-3" onSubmit={e=>{e.preventDefault();try{addPost(text,r.marketId);setShared(true);toast.success('Posted locally to your community feed');}catch(error){toast.error((error as Error).message);}}}><Field><FieldLabel htmlFor="receipt-post">Edit your local post</FieldLabel><Textarea id="receipt-post" maxLength={600} value={text} onChange={e=>setText(e.target.value)}/></Field><button className="action-secondary" type="submit" disabled={!text.trim()}>Post to demo feed</button><p className="text-sm text-muted-foreground">Visible only in this browser. Not published publicly.</p></form>}
  {shared && <p role="status" className="text-center text-sm text-primary">Added to your local community feed.</p>}
 </>;
}
