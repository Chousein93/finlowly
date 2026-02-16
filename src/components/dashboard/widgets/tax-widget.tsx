import { useState, useEffect } from 'react';
import { Calculator, TrendingDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppStore, DashboardWidget } from '@/store/use-app-store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Mock 2024 Turkey Tax Brackets (Simplified)
const BRACKETS = [
    { limit: 110000, rate: 0.15 },
    { limit: 230000, rate: 0.20 },
    { limit: 580000, rate: 0.27 },
    { limit: 3000000, rate: 0.35 },
    { limit: Infinity, rate: 0.40 }
];

export function TaxWidget({ widget }: { widget: DashboardWidget }) {
    const { updateDashboardWidget } = useAppStore();
    const [income, setIncome] = useState(widget.config?.monthlyIncome ? widget.config.monthlyIncome * 12 : 0);
    const [tax, setTax] = useState(0);

    useEffect(() => {
        calculateTax();
    }, [income]);

    const calculateTax = () => {
        let remainingIncome = income;
        let totalTax = 0;
        let previousLimit = 0;

        for (const bracket of BRACKETS) {
            if (remainingIncome <= 0) break;

            const taxableAmount = Math.min(remainingIncome, bracket.limit - previousLimit);
            totalTax += taxableAmount * bracket.rate;

            remainingIncome -= taxableAmount;
            previousLimit = bracket.limit;
        }

        setTax(totalTax);
    };

    const saveConfig = () => {
        updateDashboardWidget(widget.id, {
            config: { ...widget.config, monthlyIncome: income / 12 }
        });
        toast.success('Gelir bilgisi güncellendi');
    };

    const effectiveRate = income > 0 ? (tax / income) * 100 : 0;
    const netIncome = income - tax;

    return (
        <div className="space-y-4">
            {/* Summary */}
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tahmini Vergi</p>
                    <p className="text-xl font-bold text-rose-600 mt-1">₺{tax.toLocaleString('tr-TR')}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Net Gelir</p>
                    <p className="text-sm font-bold text-emerald-600">₺{netIncome.toLocaleString('tr-TR')}</p>
                </div>
            </div>

            {/* Distribution Chart */}
            <div className="h-[140px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={[
                                { name: 'Net Gelir', value: netIncome, fill: '#10b981' },
                                { name: 'Vergi', value: tax, fill: '#f43f5e' }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={60}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            <Cell key="net" fill="#10b981" />
                            <Cell key="tax" fill="#f43f5e" />
                        </Pie>
                        <RechartsTooltip
                            formatter={(value: number) => `₺${value.toLocaleString('tr-TR')}`}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>



            {/* Input */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Yıllık Brüt Gelir</label>
                    <div className="flex gap-2">
                        <Input
                            type="number"
                            className="h-8 text-xs bg-white"
                            value={income || ''}
                            onChange={e => setIncome(Number(e.target.value))}
                            placeholder="0.00"
                        />
                        <Button size="sm" onClick={saveConfig} className="h-8 bg-slate-900 text-white">
                            Kaydet
                        </Button>
                    </div>
                </div>
                <p className="text-[10px] text-slate-400 italic leading-tight">
                    *Tahmini 2024 gelir vergisi oranlarına göre hesaplanmıştır. Yasal tavsiye değildir.
                </p>
            </div>
        </div>
    );
}
