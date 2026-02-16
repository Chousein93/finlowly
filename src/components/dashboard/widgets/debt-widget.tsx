import { useState } from 'react';
import { Plus, Trash2, TrendingDown, ShieldAlert, CreditCard } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip, Cell } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useAppStore, DashboardWidget } from '@/store/use-app-store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function DebtWidget({ widget }: { widget: DashboardWidget }) {
    const { updateDashboardWidget } = useAppStore();
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [rate, setRate] = useState('');

    const debts = widget.config?.debts || [];
    const totalDebt = debts.reduce((sum, d) => sum + d.amount, 0);
    const avgRate = debts.length > 0 ? debts.reduce((sum, d) => sum + d.interestRate, 0) / debts.length : 0;

    const handleAddDebt = () => {
        if (!name || !amount) return;
        const val = parseFloat(amount);
        const r = parseFloat(rate) || 0;
        if (isNaN(val) || val <= 0) return;

        const newDebt = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            amount: val,
            interestRate: r,
            minPayment: val * 0.05 // Assumption
        };

        updateDashboardWidget(widget.id, {
            config: { ...widget.config, debts: [...debts, newDebt] }
        });

        setName('');
        setAmount('');
        setRate('');
        toast.success('Borç eklendi');
    };

    const handleRemoveDebt = (id: string) => {
        const newDebts = debts.filter(d => d.id !== id);
        updateDashboardWidget(widget.id, {
            config: { ...widget.config, debts: newDebts }
        });
    };

    return (
        <div className="space-y-4">
            {/* Header Stats */}
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Toplam Borç</p>
                    <p className="text-xl font-bold text-slate-900 mt-1">₺{totalDebt.toLocaleString('tr-TR')}</p>
                </div>
                <div className="flex flex-col items-end">
                    <div className="bg-rose-50 px-2 py-1 rounded text-[10px] font-bold text-rose-600 border border-rose-100 flex items-center gap-1">
                        <TrendingDown className="h-3 w-3" />
                        Ort. %{avgRate.toFixed(1)} Faiz
                    </div>
                </div>
            </div>

            {/* Strategy Cards */}
            <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-center">
                    <span className="text-[8px] font-bold text-slate-400 uppercase">Önerilen Strateji</span>
                    <span className="text-[10px] font-bold text-slate-700 mt-0.5">Snowball (Çığ)</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-center">
                    <span className="text-[8px] font-bold text-slate-400 uppercase">Tahmini Bitiş</span>
                    <span className="text-[10px] font-bold text-slate-700 mt-0.5">18 Ay</span>
                </div>
            </div>

            {/* Debt Visualization */}
            {debts.length > 0 && (
                <div className="h-[100px] w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={debts} layout="vertical" margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" hide />
                            <RechartsTooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                formatter={(value: number) => `₺${value.toLocaleString('tr-TR')}`}
                            />
                            <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={20}>
                                {debts.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill="#f43f5e" />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Debt List */}
            <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
                {debts.length === 0 && (
                    <div className="text-center py-4 text-xs text-slate-400 italic">Henüz borç eklenmedi</div>
                )}
                {debts.sort((a, b) => b.interestRate - a.interestRate).map(debt => (
                    <div key={debt.id} className="p-2 rounded-lg border border-slate-100 bg-white hover:bg-slate-50 transition-all group">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                                <CreditCard className="h-3 w-3 text-slate-400" />
                                {debt.name}
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-1.5 rounded">%{debt.interestRate}</span>
                                <button
                                    onClick={() => handleRemoveDebt(debt.id)}
                                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-opacity"
                                >
                                    <Trash2 className="h-3 w-3" />
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-900">₺{debt.amount.toLocaleString()}</span>
                            <span className="text-[10px] text-slate-400">Min: ₺{debt.minPayment.toLocaleString()}</span>
                        </div>

                    </div>
                ))}
            </div>

            {/* Add Debt Form */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-50">
                <div className="flex-1 min-w-0 flex gap-2">
                    <Input
                        placeholder="Borç adı"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-8 text-xs bg-slate-50 border-slate-200 focus-visible:ring-1"
                    />
                    <Input
                        placeholder="Tutar"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-[60px] h-8 text-xs bg-slate-50 border-slate-200 focus-visible:ring-1"
                    />
                    <Input
                        placeholder="%"
                        type="number"
                        value={rate}
                        onChange={(e) => setRate(e.target.value)}
                        className="w-[40px] h-8 text-xs bg-slate-50 border-slate-200 focus-visible:ring-1"
                    />
                </div>
                <Button
                    size="icon"
                    className="h-8 w-8 shrink-0 bg-slate-900 hover:bg-slate-800"
                    onClick={handleAddDebt}
                >
                    <Plus className="h-3.5 w-3.5" />
                </Button>
            </div>
        </div>
    );
}
