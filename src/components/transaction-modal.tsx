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
    Plus
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

const colors = [
    { name: 'emerald', class: 'bg-emerald-500', border: 'border-emerald-600' },
    { name: 'blue', class: 'bg-blue-500', border: 'border-blue-600' },
    { name: 'rose', class: 'bg-rose-500', border: 'border-rose-600' },
    { name: 'amber', class: 'bg-amber-500', border: 'border-amber-600' },
    { name: 'violet', class: 'bg-violet-500', border: 'border-violet-600' },
    { name: 'orange', class: 'bg-orange-500', border: 'border-orange-600' },
];

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
        const income = items.filter((i: any) => i.type === 'income').reduce((sum: number, i: any) => sum + i.amount, 0);
        const expense = items.filter((i: any) => i.type === 'expense').reduce((sum: number, i: any) => sum + i.amount, 0);
        const balance = income - expense;
        const rate = income > 0 ? (expense / income) * 100 : 0;

        return (
            <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white/5 p-2 rounded-xl border border-white/10 text-center">
                        <div className="text-[8px] font-bold text-slate-500">GELİR</div>
                        <div className="text-xs font-bold text-emerald-400">₺{income.toLocaleString()}</div>
                    </div>
                    <div className="bg-white/5 p-2 rounded-xl border border-white/10 text-center">
                        <div className="text-[8px] font-bold text-slate-500">GİDER</div>
                        <div className="text-xs font-bold text-rose-400">₺{expense.toLocaleString()}</div>
                    </div>
                    <div className="bg-white/5 p-2 rounded-xl border border-white/10 text-center">
                        <div className="text-[8px] font-bold text-slate-500">BAKİYE</div>
                        <div className="text-xs font-bold">₺{balance.toLocaleString()}</div>
                    </div>
                </div>
                <div className="space-y-1.5 h-16 flex items-end gap-1 px-1">
                    {[30, 60, 45, 80, 50, 90, 70, 100].map((h, i) => (
                        <div key={i} className="flex-1 bg-emerald-500/20 rounded-t-sm" style={{ height: `${h}%` }} />
                    ))}
                </div>
            </div>
        );
    }

    // 2. Goal Logic (Emergency/Holiday)
    if (type === 'emergency' || type === 'holiday') {
        const perc = config.targetAmount > 0 ? Math.min((config.currentAmount / config.targetAmount) * 100, 100) : 0;
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-end">
                    <div>
                        <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">İLERLEME</div>
                        <div className="text-lg font-bold">%{perc.toFixed(1)}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">KALAN</div>
                        <div className="text-xs font-bold text-emerald-400">₺{(config.targetAmount - config.currentAmount).toLocaleString()}</div>
                    </div>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${perc}%` }} />
                </div>
            </div>
        );
    }

    // 3. Portfolio
    if (type === 'portfolio') {
        const total = config.assets?.reduce((sum: number, a: any) => sum + a.value, 0) || 0;
        return (
            <div className="space-y-4">
                <div className="text-center">
                    <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">TOPLAM VARLIK</div>
                    <div className="text-2xl font-bold">₺{total.toLocaleString()}</div>
                </div>
                <div className="flex h-3 w-full rounded-full overflow-hidden bg-white/5 border border-white/10">
                    {config.assets?.map((a: any, i: number) => (
                        <div key={i} className="h-full bg-emerald-500" style={{ width: `${(a.value / (total || 1)) * 100}%`, opacity: 1 - i * 0.2 }} />
                    ))}
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
        activeModalType
    } = useAppStore();
    const isMobile = useIsMobile();
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [date, setDate] = useState<Date>(new Date());
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [errors, setErrors] = useState<{ title?: boolean, amount?: boolean }>({});
    const [selectedColor, setSelectedColor] = useState('emerald');

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
                setCustomFields(activeModalTemplate.customFields || []);
            } else {
                setSelectedTemplateRef(null);
                setTitle('');
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

    const handleSave = () => {
        const newErrors: { title?: boolean, amount?: boolean } = {};
        if (!title.trim()) newErrors.title = true;
        if (creationType === 'transaction' && (!amount || parseFloat(amount) <= 0)) newErrors.amount = true;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error('Lütfen zorunlu alanları doldurun');
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
            },
            customFields: customFields.length > 0 ? customFields : undefined
        };

        // Add new custom fields to pool
        customFields.forEach(cf => {
            if (cf.label.trim()) {
                useAppStore.getState().addCustomFieldToPool(cf.label);
            }
        });

        if (existingTemplateId) {
            useAppStore.getState().updateTemplate(existingTemplateId, newTemplate);
            toast.success('Şablon başarıyla güncellendi');
        } else {
            addTemplate(newTemplate);
            toast.success('Yeni şablon Şablonlar bölümüne başarıyla eklendi');
        }

        // Always redirect to Templates view
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
        setSteps([]);
    };

    const addCustomField = () => {
        setCustomFields([...customFields, { id: `field-${Date.now()}`, label: 'Yeni Alan', value: '' }]);
    };

    const TemplateFields = () => {
        const type = selectedTemplate?.type || creationType;

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

        switch (type) {
            case 'budget':
            case 'expense_tracker':
                return (
                    <div className="space-y-4">
                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">BÜTÇE KALEMLERİ</Label>
                        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                            {budgetItems.map(item => (
                                <div key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 group">
                                    <div className="flex items-center gap-2">
                                        <div className={cn("w-1.5 h-1.5 rounded-full", item.type === 'income' ? "bg-emerald-500" : "bg-rose-500")} />
                                        <span className="text-xs font-medium text-slate-700">{item.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={cn("text-xs font-bold", item.type === 'income' ? "text-emerald-600" : "text-rose-600")}>
                                            {item.type === 'income' ? '+' : '-'}₺{item.amount.toLocaleString()}
                                        </span>
                                        <Button
                                            variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500"
                                            onClick={() => setBudgetItems(budgetItems.filter(i => i.id !== item.id))}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2 pt-2">
                            <Input id="new-item-name" placeholder="Açıklama" className="h-9 text-xs" />
                            <Input id="new-item-amount" type="number" placeholder="Tutar" className="h-9 text-xs w-24" />
                            <Button
                                size="sm" className="h-9 bg-slate-900"
                                onClick={() => {
                                    const nameInput = document.getElementById('new-item-name') as HTMLInputElement;
                                    const amountInput = document.getElementById('new-item-amount') as HTMLInputElement;
                                    if (nameInput.value && amountInput.value) {
                                        setBudgetItems([...budgetItems, {
                                            id: Math.random().toString(36).substr(2, 9),
                                            name: nameInput.value,
                                            amount: parseFloat(amountInput.value),
                                            type: type // use parent modal type (income/expense)
                                        }]);
                                        nameInput.value = '';
                                        amountInput.value = '';
                                    }
                                }}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
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
                            onClick={() => { setCreationType('transaction'); setStep(3); }}
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
                            onClick={() => { setCreationType('custom'); setStep(3); }}
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

                        {creationType === 'transaction' && (
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
                        )}

                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label className={cn("text-xs font-bold uppercase tracking-widest", errors.title && "text-rose-500")}>BAŞLIK</Label>
                                <Input
                                    value={title}
                                    onChange={(e) => { setTitle(e.target.value); if (errors.title) setErrors(prev => ({ ...prev, title: false })); }}
                                    placeholder="örneğin: Maaş, Kira, Market"
                                    className={cn("h-11 rounded-lg", errors.title && "border-rose-500")}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {creationType === 'transaction' && (
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

                                {/* Custom Field Pool Suggestions */}
                                {customFieldPool.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {customFieldPool.slice(0, 6).map(field => (
                                            <Button
                                                key={field.id}
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setCustomFields([...customFields, { id: `field-${Date.now()}`, label: field.label, value: '' }]);
                                                }}
                                                className="h-7 px-2 text-[10px] font-medium border-slate-200 bg-slate-50/50 hover:bg-slate-100 rounded-full"
                                            >
                                                + {field.label}
                                            </Button>
                                        ))}
                                    </div>
                                )}

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
                                <Select>
                                    <SelectTrigger className="h-11 border-slate-200">
                                        <SelectValue placeholder="Kategori seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.filter(c => c.type === type || c.type === 'both').map(cat => (
                                            <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">KATEGORİ RENGİ</Label>
                                <div className="flex items-center gap-3 py-1">
                                    {colors.map((color) => (
                                        <button
                                            key={color.name}
                                            onClick={() => setSelectedColor(color.name)}
                                            className={cn(
                                                "w-8 h-8 rounded-full transition-all flex items-center justify-center",
                                                color.class,
                                                selectedColor === color.name ? "ring-2 ring-offset-2 ring-slate-900 scale-110" : "opacity-80"
                                            )}
                                        >
                                            {selectedColor === color.name && <Check className="h-4 w-4 text-white" />}
                                        </button>
                                    ))}
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
                                <Textarea placeholder="İşlem ile ilgili detaylı not ekleyin..." className="min-h-[80px] resize-none" />
                            </div>
                        </div>

                        {/* Live Preview / Charts Section */}
                        <div className="p-4 bg-slate-900 rounded-2xl text-white space-y-4 shadow-xl">
                            <div className="flex items-center justify-between">
                                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Canlı Önizleme</h4>
                                <div className="flex items-center gap-1 text-emerald-400">
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
                                    transactionType: type
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
        </div>
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
