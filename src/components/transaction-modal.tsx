'use client';

import { useState, useEffect } from 'react';
import {
    X,
    TrendingUp,
    TrendingDown,
    Calendar as CalendarIcon,
    Wallet,
    Check,
    Bell,
    RefreshCw,
    CreditCard,
    Lock,
    ChevronDown,
    Info,
    CalendarDays,
    Hash,
    ArrowRight,
    Plus,
    Trash2
} from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useIsMobile } from '@/hooks/use-mobile';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useAppStore, Template, templatesList } from '@/store/use-app-store';
import { toast } from 'sonner';

const categories = [
    { id: 'salary', label: 'Maaş', type: 'income' },
    { id: 'freelance', label: 'Freelance', type: 'income' },
    { id: 'gift', label: 'Hediye', type: 'income' },
    { id: 'rent', label: 'Kira', type: 'expense' },
    { id: 'food', label: 'Mutfak', type: 'expense' },
    { id: 'transport', label: 'Ulaşım', type: 'expense' },
    { id: 'bills', label: 'Faturalar', type: 'expense' },
    { id: 'entertainment', label: 'Eğlence', type: 'expense' },
    { id: 'other', label: 'Diğer', type: 'both' },
];



const getColorHex = (colorName: string) => {
    const colors: { [key: string]: string } = {
        'emerald': '#10b981',
        'blue': '#3b82f6',
        'rose': '#f43f5e',
        'amber': '#f59e0b',
        'violet': '#8b5cf6',
        'orange': '#f97316'
    };
    return colors[colorName] || colorName || '#10b981';
};

const getContrastColor = (hexcolor: string) => {
    if (!hexcolor || !hexcolor.startsWith('#')) return 'white';
    const r = parseInt(hexcolor.slice(1, 3), 16);
    const g = parseInt(hexcolor.slice(3, 5), 16);
    const b = parseInt(hexcolor.slice(5, 7), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 145) ? '#0f172a' : 'white'; // slate-900 for light bgs
};

const daysOfWeek = [
    { id: 'mon', label: 'Pzt' },
    { id: 'tue', label: 'Sal' },
    { id: 'wed', label: 'Çar' },
    { id: 'thu', label: 'Per' },
    { id: 'fri', label: 'Cum' },
    { id: 'sat', label: 'Cmt' },
    { id: 'sun', label: 'Paz' },
];

function LivePreview({ type, config }: { type: string, config: any }) {
    // 1. Budget/Expense Tracker Logic
    if (type === 'budget' || type === 'expense_tracker') {
        const items = config.budgetItems || [];
        let income = items.filter((i: any) => i.type === 'income').reduce((sum: number, i: any) => sum + i.amount, 0);
        let expense = items.filter((i: any) => i.type === 'expense').reduce((sum: number, i: any) => sum + i.amount, 0);

        if (config.amount && config.transactionType) {
            if (config.transactionType === 'income') income += config.amount;
            else expense += config.amount;
        }

        const balance = income - expense;
        const textColor = getContrastColor(config.color || '#10b981');
        const secondaryTextColor = textColor === 'white' ? 'rgba(255,255,255,0.6)' : 'rgba(15,23,42,0.6)';

        return (
            <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 rounded-xl border text-center" style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}>
                        <div className="text-[8px] font-bold uppercase" style={{ color: secondaryTextColor }}>GELİR</div>
                        <div className="text-xs font-bold" style={{ color: textColor }}>₺{income.toLocaleString()}</div>
                    </div>
                    <div className="p-2 rounded-xl border text-center" style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}>
                        <div className="text-[8px] font-bold uppercase" style={{ color: secondaryTextColor }}>GİDER</div>
                        <div className="text-xs font-bold" style={{ color: textColor }}>₺{expense.toLocaleString()}</div>
                    </div>
                    <div className="p-2 rounded-xl border text-center" style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}>
                        <div className="text-[8px] font-bold uppercase" style={{ color: secondaryTextColor }}>BAKİYE</div>
                        <div className="text-xs font-bold" style={{ color: textColor }}>₺{balance.toLocaleString()}</div>
                    </div>
                </div>
            </div>
        );
    }

    // 2. Goal Logic (Emergency/Holiday)
    if (type === 'emergency' || type === 'holiday') {
        const perc = config.targetAmount > 0 ? Math.min((config.currentAmount / config.targetAmount) * 100, 100) : 0;
        const textColor = getContrastColor(config.color || '#10b981');
        const secondaryTextColor = textColor === 'white' ? 'rgba(255,255,255,0.6)' : 'rgba(15,23,42,0.6)';

        return (
            <div className="space-y-4">
                <div className="flex justify-between items-end">
                    <div>
                        <div className="text-[8px] font-bold uppercase tracking-widest mb-1" style={{ color: secondaryTextColor }}>İLERLEME</div>
                        <div className="text-lg font-bold" style={{ color: textColor }}>%{perc.toFixed(1)}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-[8px] font-bold uppercase tracking-widest mb-1" style={{ color: secondaryTextColor }}>KALAN</div>
                        <div className="text-xs font-bold" style={{ color: textColor }}>₺{(config.targetAmount - config.currentAmount).toLocaleString()}</div>
                    </div>
                </div>
            </div>
        );
    }

    // 3. Portfolio
    if (type === 'portfolio') {
        const total = config.assets?.reduce((sum: number, a: any) => sum + a.value, 0) || 0;
        const textColor = getContrastColor(config.color || '#10b981');
        const secondaryTextColor = textColor === 'white' ? 'rgba(255,255,255,0.6)' : 'rgba(15,23,42,0.6)';

        return (
            <div className="space-y-4">
                <div className="text-center">
                    <div className="text-[8px] font-bold uppercase tracking-widest" style={{ color: secondaryTextColor }}>TOPLAM VARLIK</div>
                    <div className="text-2xl font-bold" style={{ color: textColor }}>₺{total.toLocaleString()}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-10 text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest">
            Detaylı Önizleme Hazırlanıyor...
        </div>
    );
}

export function TransactionModal() {
    const {
        addToLibrary,
        addTemplate,
        setTransactionModalOpen,
        transactionModalOpen,
        customFieldPool,
        activeModalTemplate,
        activeModalStep,
        activeModalType,
        customCategories,
        addCustomCategory,
        removeCustomCategory
    } = useAppStore();
    const isMobile = useIsMobile();
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [date, setDate] = useState<Date>(new Date());
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [errors, setErrors] = useState<{ title?: boolean, amount?: boolean }>({});
    const [selectedColor, setSelectedColor] = useState('#10b981');

    const [step, setStep] = useState(1); // 1: Select Type, 2: Select Template/Form, 3: Details
    const [creationType, setCreationType] = useState<'transaction' | 'template' | 'custom'>('transaction');
    const [selectedTemplate, setSelectedTemplateRef] = useState<any>(null);
    const [customFields, setCustomFields] = useState<{ id: string; label: string; value: string }[]>([]);

    // Sync with store when opening
    useEffect(() => {
        if (transactionModalOpen) {
            setStep(activeModalStep);
            setCreationType(activeModalType);
            if (activeModalTemplate) {
                setSelectedTemplateRef(activeModalTemplate);
                setTitle(activeModalTemplate.title);
                const config = activeModalTemplate.config || {};
                setAmount(config.amount?.toString() || '');
                setType(config.transactionType || 'expense');
                setTargetAmount(config.targetAmount?.toString() || '');
                setCurrentAmount(config.currentAmount?.toString() || '');
                setInterestRate(config.interestRate?.toString() || '');
                setAge(config.age?.toString() || '');
                setTargetAge(config.targetAge?.toString() || '');
                setSelectedFeatures(config.features || []);
                setBudgetItems(config.budgetItems || []);
                setAssets(config.assets || []);
                setDebts(config.debts || []);
                setSteps(config.steps || []);
                setCategoryId(config.categoryId || '');
                setNotes(config.notes || '');
                setSelectedColor(getColorHex(config.color || 'emerald'));

                // Load recurring settings
                if (config.recurring) {
                    setIsRecurring(config.recurring.enabled);
                    setFrequency(config.recurring.frequency);
                    setCustomInterval(config.recurring.interval?.toString() || '1');
                    setCustomPeriod(config.recurring.period || 'ay');
                    setTerminationType(config.recurring.termination?.type || 'never');
                    if (config.recurring.termination?.date) {
                        setTerminationDate(new Date(config.recurring.termination.date));
                    }
                }

                // Load installment settings
                if (config.installment) {
                    setIsInstallment(config.installment.enabled);
                    setInstallmentCount(config.installment.count?.toString() || '12');
                    setInstallmentPeriod(config.installment.period || 'monthly');
                }

                setCustomFields(activeModalTemplate.customFields || []);
            } else {
                setSelectedTemplateRef(null);
                setTitle('Aylık Bütçe');
                resetForm();
            }
        }
    }, [transactionModalOpen, activeModalStep, activeModalType, activeModalTemplate]);

    // Recurring States
    const [isRecurring, setIsRecurring] = useState(false);
    const [frequency, setFrequency] = useState('monthly');
    const [customInterval, setCustomInterval] = useState('1');
    const [customPeriod, setCustomPeriod] = useState('ay');
    const [terminationType, setTerminationType] = useState('never');
    const [terminationDate, setTerminationDate] = useState<Date | undefined>(undefined);

    // Installment States
    const [isInstallment, setIsInstallment] = useState(false);
    const [installmentCount, setInstallmentCount] = useState('12');
    const [installmentPeriod, setInstallmentPeriod] = useState('monthly');

    // Template Config States
    const [targetAmount, setTargetAmount] = useState('');
    const [currentAmount, setCurrentAmount] = useState('');
    const [targetDate, setTargetDateConfig] = useState<Date>(new Date());
    const [interestRate, setInterestRate] = useState('');
    const [age, setAge] = useState('');
    const [targetAge, setTargetAge] = useState('');
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

    // Rich Data States
    const [budgetItems, setBudgetItems] = useState<any[]>([]);
    const [assets, setAssets] = useState<any[]>([]);
    const [debts, setDebts] = useState<any[]>([]);
    const [steps, setSteps] = useState<any[]>([]);

    // New Budget Item State (lifted from TemplateFields)
    const [newItemName, setNewItemName] = useState('');
    const [newItemAmount, setNewItemAmount] = useState('');
    const [newItemType, setNewItemType] = useState<'income' | 'expense'>('expense');

    // Custom Category Creation State
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryType, setNewCategoryType] = useState<'income' | 'expense' | 'both'>('expense');
    const [newCategoryColor, setNewCategoryColor] = useState('#000000');

    // Missing State Bindings
    const [categoryId, setCategoryId] = useState('');
    const [notes, setNotes] = useState('');

    const handleSave = () => {
        const newErrors: { title?: boolean, amount?: boolean } = {};
        if (!title.trim()) newErrors.title = true;

        // If amount is empty but we have items, calculate total
        let finalAmount = amount;
        if (creationType === 'transaction' && (!amount || parseFloat(amount) <= 0) && budgetItems.length > 0) {
            const total = budgetItems.reduce((sum, item) => sum + (item.type === type ? item.amount : -item.amount), 0);
            finalAmount = Math.max(0, total).toString();
            setAmount(finalAmount);
        }

        if (creationType === 'transaction' && (!finalAmount || parseFloat(finalAmount) <= 0)) newErrors.amount = true;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error('Lütfen zorunlu alanları doldurun (Başlık ve Tutar)');
            return;
        }

        const templateType = creationType === 'transaction' ? 'budget' : (creationType === 'custom' ? 'budget' : (selectedTemplate?.type || 'budget'));

        // Check if we are editing an existing template or creating a new one
        const existingTemplateId = activeModalTemplate && useAppStore.getState().templates.some(t => t.id === activeModalTemplate.id)
            ? activeModalTemplate.id
            : null;

        // Default features for ready templates
        let finalFeatures = [...selectedFeatures];
        if (creationType === 'template' && selectedTemplate) {
            const chartTypes = ['budget', 'expense_tracker', 'portfolio', 'retirement', 'tax', 'debt_strategy'];
            if (chartTypes.includes(selectedTemplate.type)) {
                finalFeatures = ['Grafikler', 'Trendler'];
            }
        } else if (creationType === 'transaction') {
            finalFeatures = ['Grafikler', 'Trendler'];
        }

        const newTemplate: Template = {
            id: existingTemplateId || `${selectedTemplate?.id || creationType}-${Date.now()}`,
            title,
            description: creationType === 'transaction' ? `${type === 'income' ? 'Gelir' : 'Gider'} işlemi` : (creationType === 'custom' ? 'Özel oluşturulmuş şablon' : (selectedTemplate?.description || '')),
            icon: selectedTemplate?.icon || (creationType === 'transaction' ? (type === 'income' ? TrendingUp : TrendingDown) : Wallet),
            type: templateType,
            config: {
                amount: creationType === 'transaction' ? parseFloat(amount) : undefined,
                transactionType: creationType === 'transaction' ? type : undefined,
                targetAmount: targetAmount ? parseFloat(targetAmount) : undefined,
                currentAmount: currentAmount ? parseFloat(currentAmount) : undefined,
                interestRate: interestRate ? parseFloat(interestRate) : undefined,
                age: age ? parseInt(age) : undefined,
                targetAge: targetAge ? parseInt(targetAge) : undefined,
                features: finalFeatures,
                budgetItems: budgetItems.length > 0 ? budgetItems : undefined,
                assets: assets.length > 0 ? assets : undefined,
                debts: debts.length > 0 ? debts : undefined,
                steps: steps.length > 0 ? steps : undefined,
                // New Fields
                categoryId,
                color: selectedColor,
                notes,
                date: date.toISOString(),
                recurring: {
                    enabled: isRecurring,
                    frequency,
                    interval: parseInt(customInterval) || 1,
                    period: customPeriod,
                    termination: { type: terminationType, date: terminationDate ? terminationDate.toISOString() : undefined }
                },
                installment: {
                    enabled: isInstallment,
                    count: parseInt(installmentCount) || 12,
                    period: installmentPeriod
                }
            },
            customFields: customFields.length > 0 ? customFields : undefined
        };



        if (existingTemplateId) {
            useAppStore.getState().updateTemplate(existingTemplateId, newTemplate);
            // Also update the corresponding dashboard widget if it exists
            const widgets = useAppStore.getState().dashboardWidgets;
            const matchingWidget = widgets.find(w => w.templateId === existingTemplateId);
            if (matchingWidget) {
                useAppStore.getState().updateDashboardWidget(matchingWidget.id, {
                    title: newTemplate.title,
                    config: newTemplate.config,
                    customFields: newTemplate.customFields,
                });
            }
            toast.success('Şablon başarıyla güncellendi');
        } else {
            addTemplate(newTemplate);
            if (creationType === 'transaction') {
                // Automatically add to dashboard for transactions
                useAppStore.getState().addToDashboard(newTemplate);
                toast.success('İşlem kaydedildi ve Dashboard\'a eklendi!');
            } else {
                toast.success('Şablon kütüphaneye eklendi!');
            }
        }

        // Navigate to templates list to see the created template
        useAppStore.getState().setCurrentView('templates');

        setTransactionModalOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setTitle('');
        setAmount('');
        setStep(1);
        setCustomFields([]);
        setSelectedTemplateRef(null);
        setIsRecurring(false);
        setIsInstallment(false);
        setTargetAmount('');
        setCurrentAmount('');
        setInterestRate('');
        setAge('');
        setTargetAge('');
        setSelectedFeatures([]);
        setBudgetItems([]);
        setAssets([]);
        setDebts([]);
        setDebts([]);
        setSteps([]);
        setNewItemName('');
        setNewItemAmount('');
        setNewItemType('expense');
        setCategoryId('');
        setNotes('');
        setNewCategoryName('');
        setNewCategoryColor('#000000');
        setSelectedColor('#10b981');
        setDate(new Date());
    };

    const addCustomField = () => {
        setCustomFields([...customFields, { id: `field-${Date.now()}`, label: 'Yeni Alan', value: '' }]);
    };

    const handleAddCategory = () => {
        if (!newCategoryName.trim()) return;

        addCustomCategory({
            label: newCategoryName,
            type: newCategoryType,
            color: newCategoryColor
        });

        setNewCategoryName('');
        setIsCategoryModalOpen(false);
        toast.success('Kategori başarıyla eklendi');
    };

    const TemplateFields = () => {
        const templateCategory = selectedTemplate?.type || (creationType === 'transaction' ? 'budget' : creationType);

        if (creationType === 'custom') {
            return (
                <div className="space-y-4 py-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">ÖZELLİKLER</Label>
                    <div className="grid grid-cols-2 gap-3">
                        {['Grafikler', 'Hedef Takibi', 'Tarih', 'Kategoriler', 'Notlar', 'İstatistikler', 'Trendler', 'Hatırlatıcı'].map(f => (
                            <div key={f} className="flex items-center space-x-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <Checkbox
                                    id={f}
                                    checked={selectedFeatures.includes(f)}
                                    onCheckedChange={(checked) => {
                                        if (checked) setSelectedFeatures([...selectedFeatures, f]);
                                        else setSelectedFeatures(selectedFeatures.filter(sf => sf !== f));
                                    }}
                                />
                                <Label htmlFor={f} className="text-xs font-medium cursor-pointer">{f}</Label>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        switch (templateCategory) {
            case 'budget':
            case 'expense_tracker':
                return (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">BÜTÇE KALEMLERİ (GELİR & GİDER)</Label>
                            {budgetItems.length > 0 && (
                                <span className="text-[10px] font-bold text-slate-400">{budgetItems.length} Kalem</span>
                            )}
                        </div>

                        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                            {budgetItems.length === 0 ? (
                                <div className="py-8 text-center border-2 border-dashed border-slate-100 rounded-xl">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Henüz kalem eklenmedi</div>
                                    <div className="text-[9px] text-slate-400 mt-1">Aşağıdan gelir veya gider ekleyerek başlayın</div>
                                </div>
                            ) : budgetItems.map(item => (
                                <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100 shadow-sm transition-all hover:border-slate-200 group">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-8 h-8 rounded-lg flex items-center justify-center",
                                            item.type === 'income' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                                        )}>
                                            {item.type === 'income' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                        </div>
                                        <div>
                                            <div className="text-[11px] font-bold text-slate-700">{item.name}</div>
                                            <div className="text-[9px] text-slate-400 uppercase font-bold tracking-tight">
                                                {item.type === 'income' ? 'Gelir' : 'Gider'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={cn("text-xs font-black", item.type === 'income' ? "text-emerald-600" : "text-rose-600")}>
                                            {item.type === 'income' ? '+' : '-'}₺{item.amount.toLocaleString()}
                                        </span>
                                        <Button
                                            variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                            onClick={() => setBudgetItems(budgetItems.filter(i => i.id !== item.id))}
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-[9px] font-bold text-slate-400 uppercase ml-1">KALEM ADI</Label>
                                    <Input
                                        value={newItemName}
                                        onChange={(e) => setNewItemName(e.target.value)}
                                        placeholder="Örn: Market Harcaması"
                                        className="h-10 text-xs bg-white border-slate-200 focus:ring-slate-900"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[9px] font-bold text-slate-400 uppercase ml-1">TİP</Label>
                                    <Select value={newItemType} onValueChange={(v: 'income' | 'expense') => setNewItemType(v)}>
                                        <SelectTrigger className="h-10 text-xs bg-white border-slate-200 focus:ring-slate-900">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="income">Gelir</SelectItem>
                                            <SelectItem value="expense">Gider</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div className="flex-1 space-y-1.5">
                                    <Label className="text-[9px] font-bold text-slate-400 uppercase ml-1">TUTAR (₺)</Label>
                                    <Input
                                        value={newItemAmount}
                                        onChange={(e) => setNewItemAmount(e.target.value)}
                                        type="number"
                                        placeholder="0.00"
                                        className="h-10 text-xs bg-white border-slate-200 focus:ring-slate-900"
                                    />
                                </div>
                                <div className="pt-[21px]">
                                    <Button
                                        className="h-10 bg-slate-900 hover:bg-slate-800 text-white px-5 rounded-xl font-bold text-xs flex items-center gap-2"
                                        onClick={() => {
                                            if (newItemName && newItemAmount) {
                                                setBudgetItems([...budgetItems, {
                                                    id: Math.random().toString(36).substr(2, 9),
                                                    name: newItemName,
                                                    amount: parseFloat(newItemAmount),
                                                    type: newItemType
                                                }]);
                                                setNewItemName('');
                                                setNewItemAmount('');
                                                toast.success('Kalem başarıyla eklendi');
                                            } else {
                                                toast.error('Lütfen tüm alanları doldurun');
                                            }
                                        }}
                                    >
                                        <Plus className="h-4 w-4" />
                                        EKLE
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'emergency':
            case 'holiday':
                return (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">HEDEF TUTAR</Label>
                            <Input type="number" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} placeholder="0.00" className="h-11" />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">MEVCUT BİRİKİM</Label>
                            <Input type="number" value={currentAmount} onChange={(e) => setCurrentAmount(e.target.value)} placeholder="0.00" className="h-11" />
                        </div>
                    </div>
                );
            case 'portfolio':
                return (
                    <div className="space-y-4">
                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">VARLIKLAR</Label>
                        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                            {assets.map(asset => (
                                <div key={asset.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 group">
                                    <span className="text-xs font-medium text-slate-700">{asset.name}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-slate-900">₺{asset.value.toLocaleString()}</span>
                                        <Button
                                            variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500"
                                            onClick={() => setAssets(assets.filter(a => a.id !== asset.id))}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2 pt-2">
                            <Input id="new-asset-name" placeholder="Varlık Adı" className="h-9 text-xs" />
                            <Input id="new-asset-value" type="number" placeholder="Değer" className="h-9 text-xs w-24" />
                            <Button
                                size="sm" className="h-9 bg-slate-900"
                                onClick={() => {
                                    const nameInput = document.getElementById('new-asset-name') as HTMLInputElement;
                                    const valInput = document.getElementById('new-asset-value') as HTMLInputElement;
                                    if (nameInput.value && valInput.value) {
                                        setAssets([...assets, {
                                            id: Math.random().toString(36).substr(2, 9),
                                            name: nameInput.value,
                                            value: parseFloat(valInput.value)
                                        }]);
                                        nameInput.value = '';
                                        valInput.value = '';
                                    }
                                }}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                );
            case 'debt':
            case 'debt_strategy':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">TOPLAM BORÇ</Label>
                                <Input type="number" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} placeholder="0.00" className="h-11" />
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">FAİZ ORANI (%)</Label>
                                <Input type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} placeholder="0.00" className="h-11" />
                            </div>
                        </div>
                    </div>
                );
            case 'retirement':
                return (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">MEVCUT YAŞ</Label>
                            <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="25" className="h-11" />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">HEDEF EMEKLİLİK YAŞI</Label>
                            <Input type="number" value={targetAge} onChange={(e) => setTargetAge(e.target.value)} placeholder="65" className="h-11" />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const FormContent = () => (
        <div className="flex flex-col h-full overflow-hidden">
            <div className={cn(
                "p-6 space-y-6 overflow-y-auto transaction-modal-scroll flex-1",
                isMobile && "pb-32 px-4"
            )}>
                {step === 1 && (
                    <div className="grid grid-cols-1 gap-4 py-4">
                        <Button
                            variant="outline"
                            className="h-24 flex flex-col gap-2 rounded-2xl border-slate-200 hover:border-slate-900 group"
                            onClick={() => {
                                setCreationType('transaction');
                                setSelectedTemplateRef(null);
                                setStep(3);
                            }}
                        >
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                <Wallet className="h-5 w-5" />
                            </div>
                            <span className="font-bold text-sm">Gelir / Gider Ekle</span>
                        </Button>

                        <Button
                            variant="outline"
                            className="h-24 flex flex-col gap-2 rounded-2xl border-slate-200 hover:border-slate-900 group"
                            onClick={() => { setCreationType('template'); setStep(2); }}
                        >
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                <Lock className="h-5 w-5" />
                            </div>
                            <span className="font-bold text-sm">Hazır Şablondan Oluştur</span>
                        </Button>

                        <Button
                            variant="outline"
                            className="h-24 flex flex-col gap-2 rounded-2xl border-slate-200 hover:border-slate-900 group"
                            onClick={() => {
                                setCreationType('custom');
                                setSelectedTemplateRef(null);
                                setStep(3);
                            }}
                        >
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                <Plus className="h-5 w-5" />
                            </div>
                            <span className="font-bold text-sm">Kendi Şablonunu Tasarla</span>
                        </Button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="p-0 h-8 w-8 text-slate-400">
                                <ChevronDown className="h-4 w-4 rotate-90" />
                            </Button>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">ŞABLON SEÇİN</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {templatesList.map(t => (
                                <Button
                                    key={t.id}
                                    variant="outline"
                                    className="h-auto py-4 px-3 flex flex-col items-center gap-2 text-center rounded-xl border-slate-100 hover:bg-slate-50"
                                    onClick={() => {
                                        setSelectedTemplateRef(t);
                                        setTitle(t.title);
                                        setStep(3);
                                    }}
                                >
                                    <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
                                        <TrendingUp className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="text-[11px] font-bold line-clamp-1">{t.title}</span>
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setStep(creationType === 'template' ? 2 : 1)} className="p-0 h-8 w-8 text-slate-400">
                                <ChevronDown className="h-4 w-4 rotate-90" />
                            </Button>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                {creationType === 'transaction' ? 'İŞLEM DETAYLARI' : 'ŞABLON DETAYLARI'}
                            </h3>
                        </div>

                        {TemplateFields()}

                        {creationType === 'transaction' ? (
                            <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
                                <div className="text-center">
                                    <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">TOPLAM GELİR</div>
                                    <div className="text-xs font-bold text-emerald-600">
                                        ₺{budgetItems.filter(i => i.type === 'income').reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
                                    </div>
                                </div>
                                <div className="text-center border-x border-slate-200">
                                    <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">TOPLAM GİDER</div>
                                    <div className="text-xs font-bold text-rose-600">
                                        ₺{budgetItems.filter(i => i.type === 'expense').reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">NET BAKİYE</div>
                                    <div className="text-xs font-black text-slate-900">
                                        ₺{(budgetItems.filter(i => i.type === 'income').reduce((sum, i) => sum + i.amount, 0) -
                                            budgetItems.filter(i => i.type === 'expense').reduce((sum, i) => sum + i.amount, 0)).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4 mb-6">
                                <Tabs value={type} onValueChange={(v) => setType(v as 'income' | 'expense')} className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 bg-slate-100 p-1 h-11 rounded-xl">
                                        <TabsTrigger value="income" className="rounded-lg font-semibold">
                                            <TrendingUp className="h-4 w-4 mr-2" /> Gelir
                                        </TabsTrigger>
                                        <TabsTrigger value="expense" className="rounded-lg font-semibold">
                                            <TrendingDown className="h-4 w-4 mr-2" /> Gider
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                        )}

                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label className={cn("text-xs font-bold uppercase tracking-widest", errors.title && "text-rose-500")}>İŞLEM / BÜTÇE BAŞLIĞI</Label>
                                <Input
                                    value={title}
                                    onChange={(e) => { setTitle(e.target.value); if (errors.title) setErrors(prev => ({ ...prev, title: false })); }}
                                    placeholder="örneğin: Şubat 2026 Bütçesi"
                                    className={cn("h-11 rounded-lg bg-white border-slate-200 focus:ring-slate-900", errors.title && "border-rose-500")}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {creationType !== 'transaction' && (
                                    <div className="grid gap-2">
                                        <Label className={cn("text-xs font-bold uppercase tracking-widest", errors.amount && "text-rose-500")}>TUTAR</Label>
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                value={amount}
                                                onChange={(e) => { setAmount(e.target.value); if (errors.amount) setErrors(prev => ({ ...prev, amount: false })); }}
                                                placeholder="0.00"
                                                className={cn("h-11 pl-3 pr-16 font-mono font-semibold", errors.amount && "border-rose-500")}
                                            />
                                            <div className="absolute right-2 top-1.5 align-middle">
                                                <span className="text-[10px] font-bold bg-slate-100 px-2 py-1 rounded">TRY</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">TARİH</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="h-11 justify-start text-left font-normal border-slate-200">
                                                <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                                                {format(date, "d MMMM yyyy", { locale: tr })}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">ÖZEL ALANLAR</Label>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={addCustomField}
                                        className="h-8 px-2 text-xs text-slate-600 hover:text-slate-900"
                                    >
                                        <Plus className="h-3.5 w-3.5 mr-1" />
                                        Yeni Alan
                                    </Button>
                                </div>



                                <div className="space-y-3">
                                    {customFields.map((field, index) => (
                                        <div key={field.id} className="flex gap-2 items-start animate-in fade-in slide-in-from-left-2 duration-300">
                                            <div className="grid gap-1.5 flex-1">
                                                <Input
                                                    placeholder="Alan Adı (örn: Kategori)"
                                                    value={field.label}
                                                    onChange={(e) => {
                                                        const updated = [...customFields];
                                                        updated[index].label = e.target.value;
                                                        setCustomFields(updated);
                                                    }}
                                                    className="h-9 text-xs"
                                                />
                                            </div>
                                            <div className="grid gap-1.5 flex-1">
                                                <Input
                                                    placeholder="Değer (örn: Market)"
                                                    value={field.value}
                                                    onChange={(e) => {
                                                        const updated = [...customFields];
                                                        updated[index].value = e.target.value;
                                                        setCustomFields(updated);
                                                    }}
                                                    className="h-9 text-xs bg-slate-50/50"
                                                />
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setCustomFields(customFields.filter(f => f.id !== field.id))}
                                                className="h-9 w-9 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg shrink-0"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">KATEGORİ</Label>
                                <Select
                                    value={categoryId}
                                    onValueChange={(val) => {
                                        if (val === 'create_new') {
                                            setIsCategoryModalOpen(true);
                                        } else {
                                            setCategoryId(val);
                                        }
                                    }}
                                >
                                    <SelectTrigger className="h-11 border-slate-200 w-full">
                                        <SelectValue placeholder="Kategori seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <div className="p-1 mb-1 border-b border-slate-100">
                                            <div
                                                className="flex items-center gap-2 p-2 text-sm text-blue-600 rounded-sm hover:bg-blue-50 cursor-pointer font-medium transition-colors"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setIsCategoryModalOpen(true);
                                                }}
                                            >
                                                <Plus className="h-4 w-4" />
                                                <span>Yeni Kategori Ekle...</span>
                                            </div>
                                        </div>
                                        {categories.filter(c => c.type === type || c.type === 'both').map(cat => (
                                            <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                                        ))}
                                        {customCategories.filter(c => c.type === type || c.type === 'both').map(cat => (
                                            <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* Hidden Dialog just for the Modal, controlled by state */}
                                <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
                                    <DialogContent className="sm:max-w-[400px]">
                                        <DialogHeader>
                                            <DialogTitle>Yeni Kategori Ekle</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="grid gap-2">
                                                <Label>Kategori Adı</Label>
                                                <Input
                                                    placeholder="Örn: Market"
                                                    value={newCategoryName}
                                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Tür</Label>
                                                <Select value={newCategoryType} onValueChange={(v: any) => setNewCategoryType(v)}>
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="income">Gelir</SelectItem>
                                                        <SelectItem value="expense">Gider</SelectItem>
                                                        <SelectItem value="both">Her İkisi</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="flex gap-2">
                                                <Button variant="outline" className="flex-1" onClick={() => setIsCategoryModalOpen(false)}>İptal</Button>
                                                <Button onClick={handleAddCategory} className="flex-1 bg-slate-900 text-white">Ekle</Button>
                                            </div>

                                            {/* List of Custom Categories for Deletion */}
                                            {customCategories.length > 0 && (
                                                <div className="pt-4 border-t border-slate-100 space-y-2">
                                                    <Label className="text-[10px] font-bold text-slate-400 uppercase">ÖZEL KATEGORİLERİ YÖNET</Label>
                                                    <div className="grid gap-2">
                                                        {customCategories.map(cat => (
                                                            <div key={cat.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color || '#10b981' }} />
                                                                    <span className="text-xs font-medium">{cat.label}</span>
                                                                </div>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        console.log('Attempting to delete category:', cat.id);
                                                                        removeCustomCategory(cat.id);
                                                                        toast.success(`"${cat.label}" kategorisi silindi`);
                                                                        if (categoryId === cat.id) setCategoryId('');
                                                                    }}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <div className="grid gap-2">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">KART RENGİ</Label>
                                <div className="flex items-center gap-4 py-2">
                                    <div className="relative flex items-center gap-3 group cursor-pointer">
                                        <div
                                            className="w-10 h-10 rounded-full border border-slate-200 shadow-sm transition-transform group-hover:scale-105 flex items-center justify-center overflow-hidden"
                                            style={{ backgroundColor: selectedColor }}
                                        >
                                            <Input
                                                type="color"
                                                value={selectedColor.startsWith('#') ? selectedColor : '#10b981'}
                                                onChange={(e) => setSelectedColor(e.target.value)}
                                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full border-0 p-0"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                                                Rengi Değiştir
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">
                                                {selectedColor}
                                            </span>
                                        </div>
                                        <Input
                                            type="color"
                                            value={selectedColor.startsWith('#') ? selectedColor : '#10b981'}
                                            onChange={(e) => setSelectedColor(e.target.value)}
                                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full border-0 p-0"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white rounded-lg border border-slate-200"><RefreshCw className="h-3.5 w-3.5" /></div>
                                            <Label className="text-sm font-semibold">Tekrarlayan</Label>
                                        </div>
                                        <Switch checked={isRecurring} onCheckedChange={(val) => { setIsRecurring(val); if (val) setIsInstallment(false); }} />
                                    </div>

                                    {isRecurring && (
                                        <div className="pt-4 border-t border-slate-200 space-y-4">
                                            <div className="grid gap-2">
                                                <Label className="text-[10px] font-bold text-slate-400 uppercase">SIKLIK</Label>
                                                <Select value={frequency} onValueChange={setFrequency}>
                                                    <SelectTrigger className="h-10 bg-white"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="daily">Günlük</SelectItem>
                                                        <SelectItem value="weekly">Haftalık</SelectItem>
                                                        <SelectItem value="monthly">Aylık</SelectItem>
                                                        <SelectItem value="yearly">Yıllık</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label className="text-[10px] font-bold text-slate-400 uppercase">BİTİŞ KURALI</Label>
                                                <RadioGroup value={terminationType} onValueChange={setTerminationType} className="grid gap-2">
                                                    <div className="flex items-center space-x-2"><RadioGroupItem value="never" id="never" /><Label htmlFor="never">Sonsuz</Label></div>
                                                    <div className="flex items-center space-x-2"><RadioGroupItem value="on-date" id="on-date" /><Label htmlFor="on-date">Tarihte bitsin</Label></div>
                                                </RadioGroup>
                                                {terminationType === 'on-date' && (
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button variant="outline" className="w-full text-xs">
                                                                {terminationDate ? format(terminationDate, "d MMM yyyy", { locale: tr }) : "Tarih Seçin"}
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={terminationDate} onSelect={setTerminationDate} /></PopoverContent>
                                                    </Popover>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white rounded-lg border border-slate-200"><CreditCard className="h-3.5 w-3.5" /></div>
                                            <Label className="text-sm font-semibold">Taksitli</Label>
                                        </div>
                                        <Switch checked={isInstallment} onCheckedChange={(val) => { setIsInstallment(val); if (val) setIsRecurring(false); }} />
                                    </div>

                                    {isInstallment && (
                                        <div className="pt-4 border-t border-slate-200 space-y-4">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="grid gap-1.5">
                                                    <Label className="text-[10px] font-bold text-slate-400">TAKSİT</Label>
                                                    <Input type="number" value={installmentCount} onChange={(e) => setInstallmentCount(e.target.value)} className="h-10 font-bold" />
                                                </div>
                                                <div className="grid gap-1.5">
                                                    <Label className="text-[10px] font-bold text-slate-400">ARALIK</Label>
                                                    <Select value={installmentPeriod} onValueChange={setInstallmentPeriod}>
                                                        <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="monthly">Aylık</SelectItem>
                                                            <SelectItem value="weekly">Haftalık</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">NOTLAR</Label>
                                <Textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="İşlem ile ilgili detaylı not ekleyin..."
                                    className="min-h-[80px] resize-none"
                                />
                            </div>
                        </div>

                        {/* Live Preview / Charts Section */}
                        <div
                            className="p-4 rounded-2xl space-y-4 shadow-xl transition-all duration-500 ease-in-out"
                            style={{
                                backgroundColor: selectedColor,
                                color: getContrastColor(selectedColor)
                            }}
                        >
                            <div className="flex items-center justify-between">
                                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Canlı Önizleme</h4>
                                <div className="flex items-center gap-1 opacity-80">
                                    <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                                    <span className="text-[8px] font-bold uppercase">Canlı</span>
                                </div>
                            </div>

                            <LivePreview
                                type={selectedTemplate?.type || creationType}
                                config={{
                                    targetAmount: parseFloat(targetAmount) || 0,
                                    currentAmount: parseFloat(currentAmount) || 0,
                                    interestRate: parseFloat(interestRate) || 0,
                                    age: parseInt(age) || 0,
                                    targetAge: parseInt(targetAge) || 0,
                                    budgetItems,
                                    assets,
                                    debts,
                                    steps,
                                    amount: parseFloat(amount) || 0,
                                    transactionType: type,
                                    color: selectedColor
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className={cn(
                "p-6 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row gap-2 h-auto",
                isMobile && "fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]"
            )}>
                <Button variant="ghost" onClick={() => setTransactionModalOpen(false)} className="flex-1 h-12 text-slate-600 font-semibold sm:order-1">İptal</Button>
                <Button onClick={handleSave} className="flex-1 h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold sm:order-2">Kaydet</Button>
            </div>
        </div >
    );

    if (isMobile) {
        return (
            <Sheet open={transactionModalOpen} onOpenChange={setTransactionModalOpen}>
                <SheetContent side="bottom" className="h-[92vh] p-0 rounded-t-[2rem] overflow-hidden border-none shadow-2xl">
                    <SheetHeader className="p-6 pb-2 border-b border-slate-50">
                        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4" />
                        <SheetTitle className="text-xl font-bold text-slate-900 text-center">Yeni İşlem</SheetTitle>
                    </SheetHeader>
                    {FormContent()}
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <Dialog open={transactionModalOpen} onOpenChange={setTransactionModalOpen}>
            <DialogContent className="sm:max-w-[560px] p-0 overflow-hidden border-none bg-white shadow-2xl rounded-2xl">
                <DialogHeader className="p-6 pb-2 border-b border-slate-50">
                    <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight">Yeni İşlem Ekle</DialogTitle>
                </DialogHeader>
                <div className="max-h-[80vh] overflow-hidden">
                    {FormContent()}
                </div>
            </DialogContent>
        </Dialog>
    );
}
