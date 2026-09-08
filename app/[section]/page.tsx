import { notFound } from 'next/navigation';
import { Discovery } from '@/components/omnimarket/discovery';
import { Portfolio } from '@/components/omnimarket/portfolio';
import { WalletView } from '@/components/omnimarket/wallet';
import { CommunityFeed } from '@/components/omnimarket/community';
import { Improvements } from '@/components/omnimarket/improvements';
const sections = ['home','portfolio','wallet','watchlist','community','improvements'];
export function generateStaticParams() { return sections.map(section=>({section})); }
export async function generateMetadata({params}:{params:Promise<{section:string}>}) { const {section}=await params; return {title:section.charAt(0).toUpperCase()+section.slice(1)}; }
export default async function Page({params}:{params:Promise<{section:string}>}) {
 const {section}=await params;
 if(section==='home')return <Discovery/>;
 if(section==='portfolio')return <Portfolio/>;
 if(section==='wallet')return <WalletView/>;
 if(section==='watchlist')return <Discovery watchlist/>;
 if(section==='community')return <CommunityFeed/>;
 if(section==='improvements')return <Improvements/>;
 notFound();
}
