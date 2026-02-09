import { useState, useEffect } from 'react';
import { TrendingUp, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppStore, DashboardWidget } from '@/store/use-app-store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function RetirementWidget({ widget }: { widget: DashboardWidget }) {
    const { updateDashboardWidget } = useAppStore();

    // Local state for inputs to avoid constant store updates on keystroke
    const [inputs, setInputs] = useState({
        currentAge: widget.config?.age || 30,
        targetAge: widget.config?.targetAge || 65,
        currentSavings: widget.config?.currentAmount || 0,
        monthlyContribution: widget.config?.monthlySavings || 0,
        returnRate: 8 // Assuming 8% default
    });

    const [result, setResult] = useState(0);

    useEffect(() => {
        calculateRetirement();
    }, [inputs]);

    const calculateRetirement = () => {
        const years = inputs.targetAge - inputs.currentAge;
        if (years <= 0) {
            setResult(inputs.currentSavings);
            return;
        }

        const r = inputs.returnRate / 100 / 12;
        const n = years * 12;

        // Future Value of Current Savings: PV * (1+r)^n
        const fvSavings = inputs.currentSavings * Math.pow(1 + r, n);

        // Future Value of Contributions: PMT * (((1+r)^n - 1) / r)
        const fvContributions = inputs.monthlyContribution * ((Math.pow(1 + r, n) - 1) / r);

        setResult(fvSavings + fvContributions);
    };

    const saveConfig = () => {
        updateDashboardWidget(widget.id, {
            config: {
                ...widget.config,
                age: inputs.currentAge,
                targetAge: inputs.targetAge,
                currentAmount: inputs.currentSavings,
                monthlySavings: inputs.monthlyContribution
            }
        });
        toast.success('Emeklilik planı güncellendi');
    };

    return (
        <div className="space-y-4">
            {/* Result Display */}
            <div className="bg-slate-900 text-white p-3 rounded-xl flex items-center justify-between">
                <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tahmini Birikim</span>
                    <p className="text-xl font-bold mt-0.5">₺{Math.round(result).toLocaleString('tr-TR')}</p>
                </div>
                <div className="text-right">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{inputs.targetAge} Yaşında</span>
                    <p className="text-xs text-slate-400">{inputs.targetAge - inputs.currentAge} Yıl Sonra</p>
                </div>
            </div>

            {/* Input Grid */}
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Şimdiki Yaş</label>
                    <Input
                        type="number"
                        className="h-8 text-xs bg-slate-50"
                        value={inputs.currentAge}
                        onChange={e => setInputs({ ...inputs, currentAge: Number(e.target.value) })}
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Emeklilik Yaşı</label>
                    <Input
                        type="number"
                        className="h-8 text-xs bg-slate-50"
                        value={inputs.targetAge}
                        onChange={e => setInputs({ ...inputs, targetAge: Number(e.target.value) })}
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Mevcut Birikim</label>
                    <Input
                        type="number"
                        className="h-8 text-xs bg-slate-50"
                        value={inputs.currentSavings}
                        onChange={e => setInputs({ ...inputs, currentSavings: Number(e.target.value) })}
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Aylık Ekleme</label>
                    <Input
                        type="number"
                        className="h-8 text-xs bg-slate-50"
                        value={inputs.monthlyContribution}
                        onChange={e => setInputs({ ...inputs, monthlyContribution: Number(e.target.value) })}
                    />
                </div>
            </div>

            <Button onClick={saveConfig} className="w-full h-8 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white">
                <Calculator className="h-3 w-3 mr-2" />
                Planı Kaydet
            </Button>
        </div>
    );
}
