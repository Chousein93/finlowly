import { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, Trash2, Wallet, Save, X, BarChart as BarChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppStore, DashboardWidget, BudgetItem } from '@/store/use-app-store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function BudgetWidget({ widget }: { widget: DashboardWidget }) {
    const { updateDashboardWidget, saveTempBudgetItems, cancelTempBudgetItems } = useAppStore();
    const [newItemName, setNewItemName] = useState('');
    const [newItemAmount, setNewItemAmount] = useState('');
    const [newItemType, setNewItemType] = useState<'income' | 'expense'>('expense');

    // Geçici verileri kontrol et
    const tempItems = useAppStore.getState().tempBudgetItems[widget.id] || [];
    const currentItems = tempItems.length > 0 ? tempItems : (widget.config?.budgetItems || []);

    const income = currentItems.filter(i => i.type === 'income').reduce((sum, i) => sum + i.amount, 0);
    const expense = currentItems.filter(i => i.type === 'expense').reduce((sum, i) => sum + i.amount, 0);
    const balance = income - expense;
    const expenseRate = income > 0 ? (expense / income) * 100 : 0;

    const handleAddItem = () => {
        if (!newItemName || !newItemAmount) {
            toast.error('Lütfen açıklama ve tutar girin');
            return;
        }

        const amount = parseFloat(newItemAmount);
        if (isNaN(amount) || amount <= 0) {
            toast.error('Lütfen geçerli bir tutar girin');
            return;
        }

        const newItem = {
            id: Math.random().toString(36).substr(2, 9),
            name: newItemName,
            amount,
            type: newItemType
        };

        const newItems = [...currentItems, newItem];

        // Geçici verileri güncelle
        updateDashboardWidget(widget.id, {
            config: {
                ...widget.config,
                budgetItems: newItems,
            }
        });

        setNewItemName('');
        setNewItemAmount('');
        toast.success('Kalem eklendi');
    };

    const handleRemoveItem = (id: string) => {
        const newItems = currentItems.filter(i => i.id !== id);

        // Geçici verileri güncelle
        updateDashboardWidget(widget.id, {
            config: { ...widget.config, budgetItems: newItems }
        });
    };

    const handleSave = () => {
        saveTempBudgetItems(widget.id, currentItems);
        toast.success('Değişiklikler kaydedildi');
    };

    const handleCancel = () => {
        cancelTempBudgetItems(widget.id);
        toast.info('Değişiklikler iptal edildi');
    };

    return (
        <div className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100 flex flex-col items-center justify-center text-center">
                    <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wide">Gelir</span>
                    <span className="text-xs font-bold text-slate-800 mt-0.5">₺{income.toLocaleString('tr-TR')}</span>
                </div>
                <div className="p-2 rounded-xl bg-rose-50 border border-rose-100 flex flex-col items-center justify-center text-center">
                    <span className="text-[9px] font-bold text-rose-600 uppercase tracking-wide">Gider</span>
                    <span className="text-xs font-bold text-slate-800 mt-0.5">₺{expense.toLocaleString('tr-TR')}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-center">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Kalan</span>
                    <span className={cn("text-xs font-bold mt-0.5", balance >= 0 ? "text-slate-800" : "text-rose-600")}>
                        ₺{balance.toLocaleString('tr-TR')}
                    </span>
                </div>
            </div>

            {/* Chart Area */}
            <div className="h-[160px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                        { name: 'Gelir', value: income, fill: '#10b981' },
                        { name: 'Gider', value: expense, fill: '#f43f5e' }
                    ]}>
                        <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis hide />
                        <RechartsTooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            formatter={(value: number) => `₺${value.toLocaleString('tr-TR')}`}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            <Cell key="income" fill="#10b981" />
                            <Cell key="expense" fill="#f43f5e" />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>



            {/* Items List */}
            <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
                {currentItems.length === 0 && (
                    <div className="text-center py-4 text-xs text-slate-400 italic">Henüz kalem eklenmedi</div>
                )}
                {currentItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between text-xs p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 group transition-all">
                        <div className="flex items-center gap-2">
                            <div className={cn(
                                "w-1.5 h-1.5 rounded-full shrink-0",
                                item.type === 'income' ? "bg-emerald-500" : "bg-rose-500"
                            )} />
                            <span className="text-slate-700 font-medium truncate max-w-[80px]">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={cn(
                                "font-bold",
                                item.type === 'income' ? "text-emerald-600" : "text-rose-600"
                            )}>
                                {item.type === 'income' ? '+' : '-'}₺{item.amount.toLocaleString()}
                            </span>
                            <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-opacity"
                            >
                                <Trash2 className="h-3 w-3" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>


            {/* Add Item Form */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-50">
                <div className="flex-1 min-w-0 flex gap-2">
                    <Select value={newItemType} onValueChange={(v: any) => setNewItemType(v)}>
                        <SelectTrigger className="w-[70px] h-8 text-[10px] px-2 bg-slate-50 border-slate-200">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="income">Gelir</SelectItem>
                            <SelectItem value="expense">Gider</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input
                        placeholder="Açıklama"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        className="h-8 text-xs bg-slate-50 border-slate-200 focus-visible:ring-1"
                    />
                    <Input
                        placeholder="Tutar"
                        type="number"
                        value={newItemAmount}
                        onChange={(e) => setNewItemAmount(e.target.value)}
                        className="w-[70px] h-8 text-xs bg-slate-50 border-slate-200 focus-visible:ring-1"
                    />
                </div>
                <Button
                    size="icon"
                    className="h-8 w-8 shrink-0 bg-slate-900 hover:bg-slate-800"
                    onClick={handleAddItem}
                >
                    <Plus className="h-3.5 w-3.5" />
                </Button>
            </div>
        </div>
    );
}
