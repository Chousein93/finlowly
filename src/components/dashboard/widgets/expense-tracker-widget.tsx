import { useState } from 'react';
import { Plus, TrendingDown, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppStore, DashboardWidget } from '@/store/use-app-store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const CATEGORIES = [
    { value: 'food', label: 'Gıda', color: 'bg-orange-500' },
    { value: 'transport', label: 'Ulaşım', color: 'bg-blue-500' },
    { value: 'shopping', label: 'Alışveriş', color: 'bg-purple-500' },
    { value: 'bills', label: 'Faturalar', color: 'bg-rose-500' },
    { value: 'entertainment', label: 'Eğlence', color: 'bg-pink-500' },
    { value: 'other', label: 'Diğer', color: 'bg-slate-500' },
];

export function ExpenseTrackerWidget({ widget }: { widget: DashboardWidget }) {
    const { updateDashboardWidget } = useAppStore();
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('food');
    const [desc, setDesc] = useState('');

    const transactions = widget.config?.budgetItems?.filter(i => i.type === 'expense') || [];
    const total = transactions.reduce((sum, t) => sum + t.amount, 0);

    const handleAddExpense = () => {
        if (!amount) return;
        const val = parseFloat(amount);
        if (isNaN(val) || val <= 0) return;

        const newItem = {
            id: Math.random().toString(36).substr(2, 9),
            name: desc || CATEGORIES.find(c => c.value === category)?.label || 'Harcama',
            amount: val,
            type: 'expense' as const,
            category // We save category in the item for this widget
        };

        updateDashboardWidget(widget.id, {
            config: {
                ...widget.config,
                budgetItems: [newItem, ...transactions] // Prepend for recency
            }
        });

        setAmount('');
        setDesc('');
        toast.success('Harcama eklendi');
    };

    // Calculate category distribution
    const distribution = CATEGORIES.map(cat => {
        const sum = transactions.filter(t => (t as any).category === cat.value).reduce((s, t) => s + t.amount, 0);
        return { ...cat, total: sum };
    }).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

    return (
        <div className="space-y-4">
            {/* Total Display */}
            <div className="flex justify-between items-center bg-rose-50 p-3 rounded-xl border border-rose-100">
                <div>
                    <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wide">Toplam Harcama</span>
                    <p className="text-xl font-bold text-rose-600 mt-0.5">₺{total.toLocaleString('tr-TR')}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-rose-100 flex items-center justify-center">
                    <TrendingDown className="h-4 w-4 text-rose-600" />
                </div>
            </div>

            {/* Distribution Bar */}
            {total > 0 && (
                <div className="space-y-2">
                    <div className="flex h-2 w-full rounded-full overflow-hidden bg-slate-100">
                        {distribution.map((d) => (
                            <div
                                key={d.value}
                                className={cn("h-full", d.color)}
                                style={{ width: `${(d.total / total) * 100}%` }}
                                title={`${d.label}: ₺${d.total}`}
                            />
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {distribution.slice(0, 3).map(d => (
                            <div key={d.value} className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
                                <div className={cn("w-1.5 h-1.5 rounded-full", d.color)} />
                                {d.label} (%{Math.round(d.total / total * 100)})
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent List */}
            <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
                {transactions.length === 0 && (
                    <div className="text-center py-4 text-xs text-slate-400 italic">Harcama kaydı yok</div>
                )}
                {transactions.map(t => {
                    const cat = CATEGORIES.find(c => c.value === (t as any).category);
                    return (
                        <div key={t.id} className="flex justify-between items-center text-xs p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 group transition-all">
                            <div className="flex items-center gap-2">
                                <div className={cn("p-1.5 rounded-md text-white", cat?.color || 'bg-slate-400')}>
                                    <ShoppingBag className="h-3 w-3" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium text-slate-700">{t.name}</span>
                                    <span className="text-[9px] text-slate-400">{cat?.label}</span>
                                </div>
                            </div>
                            <span className="font-bold text-rose-600">-₺{t.amount.toLocaleString()}</span>
                        </div>
                    );
                })}
            </div>

            {/* Add Form */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-50">
                <div className="flex-1 min-w-0 flex gap-2">
                    <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="w-[85px] h-8 text-[10px] px-2 bg-slate-50 border-slate-200">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {CATEGORIES.map(c => (
                                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Input
                        placeholder="Ne aldın?"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        className="h-8 text-xs bg-slate-50 border-slate-200 focus-visible:ring-1"
                    />
                    <Input
                        placeholder="Tutar"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-[60px] h-8 text-xs bg-slate-50 border-slate-200 focus-visible:ring-1"
                    />
                </div>
                <Button
                    size="icon"
                    className="h-8 w-8 shrink-0 bg-slate-900 hover:bg-slate-800"
                    onClick={handleAddExpense}
                >
                    <Plus className="h-3.5 w-3.5" />
                </Button>
            </div>
        </div>
    );
}
