'use client';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { history, type Market } from '@/lib/omnimarket/markets';
export function ProbabilityChart({ market, range = '1W', compact = false }: { market: Market; range?: string; compact?: boolean }) {
 return <ChartContainer className={compact ? 'h-20 w-full aspect-auto' : 'h-64 w-full aspect-auto'} config={{ chance: { label: 'Yes probability (%)', color: market.change >= 0 ? 'var(--chart-1)' : 'var(--chart-2)' } }} aria-label={`Illustrative probability history ending at ${market.price} percent`}><AreaChart accessibilityLayer data={history(market,range)} margin={{ top: 8, right: compact ? 0 : 8, bottom: 0, left: compact ? 0 : -20 }}>
  {!compact && <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 5"/>}
  {!compact && <XAxis dataKey="time" tickLine={false} axisLine={false} minTickGap={40} tick={{ fontSize: 14 }} tickMargin={10}/>}
  <YAxis hide={compact} domain={compact ? ['dataMin - 4', 'dataMax + 4'] : [0,100]} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} tick={{ fontSize: 14 }}/>
  {!compact && <ChartTooltip content={<ChartTooltipContent/>}/>}
  <Area dataKey="chance" type="linear" stroke="var(--color-chance)" fill="var(--color-chance)" fillOpacity={.04} strokeWidth={1.8} isAnimationActive={false}/>
 </AreaChart></ChartContainer>;
}
