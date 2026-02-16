import { useState, useMemo } from 'react';
import { Plus, TrendingDown, ShoppingBag, PieChart as PieChartIcon, BarChart as BarChartIcon, Palette, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAppStore, DashboardWidget } from '@/store/use-app-store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

const DEFAULT_CATEGORIES = [
    { value: 'food', label: 'Gıda', color: 'bg-orange-500', fill: '#f97316' },
    { value: 'transport', label: 'Ulaşım', color: 'bg-blue-500', fill: '#3b82f6' },
    { value: 'shopping', label: 'Alışveriş', color: 'bg-purple-500', fill: '#a855f7' },
    { value: 'bills', label: 'Faturalar', color: 'bg-rose-500', fill: '#f43f5e' },
    { value: 'entertainment', label: 'Eğlence', color: 'bg-pink-500', fill: '#ec4899' },
    { value: 'other', label: 'Diğer', color: 'bg-slate-500', fill: '#64748b' },
];

const COLORS = [
    { bg: 'bg-red-500', fill: '#ef4444' },
    { bg: 'bg-orange-500', fill: '#f97316' },
    { bg: 'bg-amber-500', fill: '#f59e0b' },
    { bg: 'bg-yellow-500', fill: '#eab308' },
    { bg: 'bg-lime-500', fill: '#84cc16' },
    { bg: 'bg-green-500', fill: '#22c55e' },
    { bg: 'bg-emerald-500', fill: '#10b981' },
    { bg: 'bg-teal-500', fill: '#14b8a6' },
    { bg: 'bg-cyan-500', fill: '#06b6d4' },
    { bg: 'bg-sky-500', fill: '#0ea5e9' },
    { bg: 'bg-blue-500', fill: '#3b82f6' },
    { bg: 'bg-indigo-500', fill: '#6366f1' },
    { bg: 'bg-violet-500', fill: '#8b5cf6' },
    { bg: 'bg-purple-500', fill: '#a855f7' },
    { bg: 'bg-fuchsia-500', fill: '#d946ef' },
    { bg: 'bg-pink-500', fill: '#ec4899' },
    { bg: 'bg-rose-500', fill: '#f43f5e' },
    { bg: 'bg-slate-500', fill: '#64748b' },
];

export function ExpenseTrackerWidget({ widget }: { widget: DashboardWidget }) {
    const { updateDashboardWidget } = useAppStore();
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('food');
    const [desc, setDesc] = useState('');
    const [chartType, setChartType] = useState<'pie' | 'bar' | 'none'>('pie');

    // New Category State
    const [newCatName, setNewCatName] = useState('');
    const [newCatColor, setNewCatColor] = useState(COLORS[0]);
    const [isAddingCat, setIsAddingCat] = useState(false);

    // Merge default categories with custom ones from config
    const customCategories = widget.config?.customCategories || [];
    const allCategories = useMemo(() => [...DEFAULT_CATEGORIES, ...customCategories], [customCategories]);

    const transactions = widget.config?.budgetItems?.filter(i => i.type === 'expense') || [];
    const total = transactions.reduce((sum, t) => sum + t.amount, 0);

    const handleAddExpense = () => {
        if (!amount) return;
        const val = parseFloat(amount);
        if (isNaN(val) || val <= 0) return;

        const newItem = {
            id: Math.random().toString(36).substr(2, 9),
            name: desc || allCategories.find(c => c.value === category)?.label || 'Harcama',
            amount: val,
            type: 'expense' as const,
            category
        };

        updateDashboardWidget(widget.id, {
            config: {
                ...widget.config,
                budgetItems: [newItem, ...transactions]
            }
        });

        setAmount('');
        setDesc('');
        toast.success('Harcama eklendi');
    };

    const handleAddCategory = () => {
        if (!newCatName.trim()) return;

        const newCat = {
            value: newCatName.toLowerCase().replace(/\s+/g, '-'),
            label: newCatName,
            color: newCatColor.bg,
            fill: newCatColor.fill
        };

        updateDashboardWidget(widget.id, {
            config: {
                ...widget.config,
                customCategories: [...customCategories, newCat]
            }
        });

        setNewCatName('');
        setIsAddingCat(false);
        setCategory(newCat.value);
        toast.success('Kategori eklendi');
    };

    // Calculate category distribution for charts
    const chartData = useMemo(() => {
        const data = allCategories.map(cat => {
            const sum = transactions.filter(t => (t as any).category === cat.value).reduce((s, t) => s + t.amount, 0);
            return { name: cat.label, value: sum, fill: cat.fill };
        }).filter(c => c.value > 0).sort((a, b) => b.value - a.value);
        return data;
    }, [transactions, allCategories]);

    const selectedCategory = allCategories.find(c => c.value === category) || allCategories[0];

    return (
        <div className="space-y-6">
            {/* Total Display */}
            <div className="flex justify-between items-center bg-rose-50 p-4 rounded-xl border border-rose-100">
                <div>
                    <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wide">Toplam Harcama</span>
                    <p className="text-2xl font-bold text-rose-600 mt-0.5">₺{total.toLocaleString('tr-TR')}</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn("h-8 w-8 rounded-full", chartType === 'pie' ? "bg-rose-200 text-rose-700" : "text-rose-400 hover:bg-rose-100")}
                        onClick={() => setChartType('pie')}
                    >
                        <PieChartIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn("h-8 w-8 rounded-full", chartType === 'bar' ? "bg-rose-200 text-rose-700" : "text-rose-400 hover:bg-rose-100")}
                        onClick={() => setChartType('bar')}
                    >
                        <BarChartIcon className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Charts Area */}
            {chartType !== 'none' && chartData.length > 0 && (
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        {chartType === 'pie' ? (
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    formatter={(value: number) => `₺${value.toLocaleString('tr-TR')}`}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                            </PieChart>
                        ) : (
                            <BarChart data={chartData}>
                                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis hide />
                                <RechartsTooltip
                                    formatter={(value: number) => `₺${value.toLocaleString('tr-TR')}`}
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                </div>
            )}

            {/* Recent List */}
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                {transactions.length === 0 && (
                    <div className="text-center py-8 text-sm text-slate-400 italic">Harcama kaydı yok</div>
                )}
                {transactions.map(t => {
                    const cat = allCategories.find(c => c.value === (t as any).category);
                    return (
                        <div key={t.id} className="flex justify-between items-center text-sm p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 group transition-all">
                            <div className="flex items-center gap-3">
                                <div className={cn("p-2 rounded-lg text-white shadow-sm", cat?.color || 'bg-slate-400')}>
                                    <ShoppingBag className="h-4 w-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-slate-700">{t.name}</span>
                                    <span className="text-[10px] text-slate-400">{cat?.label}</span>
                                </div>
                            </div>
                            <span className="font-bold text-rose-600">-₺{t.amount.toLocaleString()}</span>
                        </div>
                    );
                })}
            </div>

            {/* Add Form */}
            <div className="flex items-end gap-2 pt-4 border-t border-slate-100">
                <div className="flex-1 space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Yeni Harcama</label>
                    <div className="flex gap-2">
                        {/* Category Select with Custom Color Display & Add Button */}
                        <div className="flex gap-1">
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="w-[110px] bg-slate-50 border-slate-200">
                                    <div className="flex items-center gap-2 truncate">
                                        <div className={cn("w-2 h-2 rounded-full shrink-0", selectedCategory.color)} />
                                        <span className="truncate">{selectedCategory.label}</span>
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    {allCategories.map(c => (
                                        <div key={c.value} className="relative flex items-center group">
                                            <SelectItem value={c.value} className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <div className={cn("w-2 h-2 rounded-full", c.color)} />
                                                    {c.label}
                                                </div>
                                            </SelectItem>
                                            {/* Only show delete for custom categories */}
                                            {customCategories.some(cc => cc.value === c.value) && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-5 w-5 absolute right-8 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 z-50 pointer-events-auto"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        const newCustomCats = customCategories.filter(cc => cc.value !== c.value);
                                                        updateDashboardWidget(widget.id, {
                                                            config: {
                                                                ...widget.config,
                                                                customCategories: newCustomCats
                                                            }
                                                        });
                                                        if (category === c.value) setCategory('food');
                                                    }}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Popover open={isAddingCat} onOpenChange={setIsAddingCat}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" size="icon" className="w-10 px-0 border-slate-200 bg-slate-50 hover:bg-slate-100" title="Kategori Ekle">
                                        <Plus className="h-4 w-4 text-slate-500" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-64 p-3" align="start">
                                    <div className="space-y-3">
                                        <h4 className="font-medium text-sm text-slate-900">Yeni Kategori</h4>
                                        <Input
                                            placeholder="Kategori Adı"
                                            value={newCatName}
                                            onChange={e => setNewCatName(e.target.value)}
                                            className="h-8 text-xs"
                                        />
                                        <div className="grid grid-cols-6 gap-1">
                                            {COLORS.map((c, i) => (
                                                <button
                                                    key={i}
                                                    className={cn(
                                                        "w-6 h-6 rounded-full hover:scale-110 transition-transform ring-offset-1",
                                                        c.bg,
                                                        newCatColor.bg === c.bg && "ring-2 ring-slate-400"
                                                    )}
                                                    onClick={() => setNewCatColor(c)}
                                                />
                                            ))}
                                        </div>
                                        <Button size="sm" className="w-full h-8 text-xs" onClick={handleAddCategory}>
                                            Ekle
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>

                        <Input
                            placeholder="Açıklama (Opsiyonel)"
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            className="flex-1 bg-slate-50 border-slate-200"
                        />
                        <Input
                            placeholder="Tutar"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-[80px] bg-slate-50 border-slate-200"
                        />
                    </div>
                </div>
                <Button
                    size="icon"
                    className="h-10 w-10 shrink-0 bg-slate-900 hover:bg-slate-800 rounded-xl"
                    onClick={handleAddExpense}
                >
                    <Plus className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}
