import { useState } from 'react';
import { Plus, Minus, TrendingUp, History, Target } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useAppStore, DashboardWidget } from '@/store/use-app-store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export function GoalWidget({ widget }: { widget: DashboardWidget }) {
    const { updateDashboardWidget } = useAppStore();
    const [amount, setAmount] = useState('');
    const [isDepositing, setIsDepositing] = useState(true);

    const target = widget.config?.targetAmount || 0;
    const current = widget.config?.currentAmount || 0;
    const progress = target > 0 ? Math.min((current / target) * 100, 100) : 0;
    const transactions = widget.config?.transactions || [];

    const handleTransaction = () => {
        if (!amount) return;
        const val = parseFloat(amount);
        if (isNaN(val) || val <= 0) return;

        const newCurrent = isDepositing ? current + val : current - val;
        const newTransaction = {
            id: Math.random().toString(36).substr(2, 9),
            date: new Date().toISOString(),
            amount: val,
            description: isDepositing ? 'Para Yatırma' : 'Para Çekme',
            type: isDepositing ? 'deposit' : 'withdrawal'
        };

        updateDashboardWidget(widget.id, {
            config: {
                ...widget.config,
                currentAmount: newCurrent,
                transactions: [newTransaction, ...transactions].slice(0, 5) // Keep last 5
            }
        });

        setAmount('');
        toast.success(isDepositing ? 'Tasarruf eklendi' : 'Para çekildi');
    };

    return (
        <div className="space-y-4">
            {/* Header Stats */}
            <div className="flex justify-between items-end pb-2 border-b border-slate-50">
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mevcut Birikim</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">₺{current.toLocaleString('tr-TR')}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hedef</p>
                    <p className="text-sm font-semibold text-slate-600">₺{target.toLocaleString('tr-TR')}</p>
                </div>
            </div>



            {/* Action Area */}
            <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                {/* Progress Bar */}
                <div className="mb-4 px-1">
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-medium">
                        <span>%{progress.toFixed(1)} Tamamlandı</span>
                        <span>{Math.max(0, target - current).toLocaleString('tr-TR')}₺ kaldı</span>
                    </div>
                    <Progress value={progress} className="h-2.5" indicatorClassName={progress >= 100 ? "bg-emerald-500" : "bg-blue-500"} />
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex bg-white rounded-lg border border-slate-200 p-0.5 shrink-0">
                        <button
                            onClick={() => setIsDepositing(true)}
                            className={cn(
                                "p-1.5 rounded-md transition-all",
                                isDepositing ? "bg-emerald-100 text-emerald-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setIsDepositing(false)}
                            className={cn(
                                "p-1.5 rounded-md transition-all",
                                !isDepositing ? "bg-rose-100 text-rose-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            <Minus className="h-4 w-4" />
                        </button>
                    </div>
                    <Input
                        type="number"
                        placeholder="Tutar girin..."
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="h-9 text-xs border-slate-200 bg-white focus-visible:ring-emerald-500"
                    />
                    <Button
                        size="sm"
                        className={cn(
                            "h-9 px-3 shrink-0 text-white transition-colors",
                            isDepositing ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"
                        )}
                        onClick={handleTransaction}
                    >
                        {isDepositing ? 'Ekle' : 'Çek'}
                    </Button>
                </div>
            </div>

            {/* History Chart */}
            {transactions.length > 1 && (
                <div className="h-[100px] w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[...transactions].reverse().map((t, i) => ({
                            name: i,
                            amount: t.amount,
                            // This is a rough estimation of balance history for visual purposes
                            // In a real app we'd calculate running balance properly
                            balance: current
                        }))}>
                            <defs>
                                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <RechartsTooltip
                                cursor={{ stroke: '#cbd5e1' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                formatter={(value: number) => `₺${value.toLocaleString('tr-TR')}`}
                            />
                            <Area type="monotone" dataKey="amount" stroke="#10b981" fillOpacity={1} fill="url(#colorBalance)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Recent History */}
            {transactions.length > 0 && (
                <div className="space-y-2 pt-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <History className="h-3 w-3" />
                        Son İşlemler
                    </p>
                    <div className="space-y-1">
                        {transactions.map((t: any) => (
                            <div key={t.id} className="flex justify-between items-center text-xs p-1.5 hover:bg-slate-50 rounded transition-colors border border-transparent hover:border-slate-100">
                                <span className="text-slate-500">{format(new Date(t.date), 'd MMM', { locale: tr })}</span>
                                <span className={cn(
                                    "font-bold",
                                    t.type === 'deposit' ? "text-emerald-600" : "text-rose-600"
                                )}>
                                    {t.type === 'deposit' ? '+' : '-'}₺{t.amount.toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
