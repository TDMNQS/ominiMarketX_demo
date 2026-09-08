import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Shell } from '@/components/omnimarket/shell';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';
const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });
export const metadata: Metadata = { title: { default: 'OmniMarketX — A world of possibilities', template: '%s | OmniMarketX' }, description: 'Explore a thoughtfully redesigned prediction market. An independent frontend demo by Numan Qureshi with virtual trading, transparent receipts and an interactive 3D experience.', robots: { index: false, follow: false } };
export const viewport: Viewport = { colorScheme: 'dark', themeColor: '#0c0f10', width: 'device-width', initialScale: 1 };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`dark bg-background ${geist.variable} ${mono.variable}`}><body className="font-sans antialiased"><Shell>{children}</Shell><Toaster theme="dark" position="bottom-right" closeButton /></body></html>;
}
