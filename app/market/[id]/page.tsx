import { notFound } from 'next/navigation';
import { marketById, markets } from '@/lib/omnimarket/markets';
import { MarketDetail } from '@/components/omnimarket/market-detail';
export function generateStaticParams() { return markets.map(m=>({id:m.id})); }
export async function generateMetadata({ params }: { params: Promise<{id:string}> }) { const {id}=await params; return { title: marketById(id)?.title ?? 'Market not found' }; }
export default async function Page({ params, searchParams }: { params: Promise<{id:string}>; searchParams: Promise<{outcome?:string;action?:string}> }) {
 const {id}=await params; const query=await searchParams; const market=marketById(id); if(!market)notFound();
 return <MarketDetail market={market} outcome={query.outcome==='No'?'No':'Yes'} action={query.action==='Sell'?'Sell':'Buy'}/>;
}
