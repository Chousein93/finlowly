import { useState } from 'react';
import { CheckCircle2, Circle, BookOpen, GraduationCap } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

import { useAppStore, DashboardWidget } from '@/store/use-app-store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const DEFAULT_STEPS = [
    { id: '1', title: 'Finansal Hedef Belirleme', description: 'Kısa ve uzun vadeli hedeflerini yaz.', completed: false },
    { id: '2', title: 'Acil Durum Fonu', description: '3-6 aylık giderin kadar birikim yap.', completed: false },
    { id: '3', title: 'Bütçe Oluşturma', description: 'Gelir ve giderlerini takip et.', completed: false },
    { id: '4', title: 'Borçları Temizleme', description: 'Yüksek faizli borçlardan kurtul.', completed: false },
    { id: '5', title: 'Yatırıma Başlama', description: 'Bileşik getirinin gücünü kullan.', completed: false },
];

export function EducationWidget({ widget }: { widget: DashboardWidget }) {
    const { updateDashboardWidget } = useAppStore();

    // Use config steps or defaults. If defaults, we should probably save them to config on first toggle so state persists.
    const steps = widget.config?.steps || DEFAULT_STEPS;

    const completedCount = steps.filter(s => s.completed).length;
    const progress = (completedCount / steps.length) * 100;

    const toggleStep = (stepId: string) => {
        const newSteps = steps.map(s => s.id === stepId ? { ...s, completed: !s.completed } : s);

        updateDashboardWidget(widget.id, {
            config: { ...widget.config, steps: newSteps }
        });

        const step = newSteps.find(s => s.id === stepId);
        if (step?.completed) {
            toast.success('Adım tamamlandı! 🎉');
        }
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600">
                        <GraduationCap className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Finansal Okuryazarlık</p>
                        <p className="text-xs font-bold text-slate-900 mt-0.5">% {progress.toFixed(0)} Tamamlandı</p>
                    </div>
                </div>
                {/* Donut Chart for Progress */}
                <div className="h-10 w-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={[
                                    { value: completedCount, fill: '#3b82f6' },
                                    { value: steps.length - completedCount, fill: '#e2e8f0' }
                                ]}
                                cx="50%"
                                cy="50%"
                                innerRadius={12}
                                outerRadius={18}
                                dataKey="value"
                                startAngle={90}
                                endAngle={-270}
                            >
                                <Cell key="completed" fill="#3b82f6" />
                                <Cell key="remaining" fill="#e2e8f0" />
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>



            {/* Steps List */}
            <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                {steps.map((step) => (
                    <div
                        key={step.id}
                        onClick={() => toggleStep(step.id)}
                        className={cn(
                            "flex items-start gap-3 p-2 rounded-lg border transition-all cursor-pointer group hover:shadow-sm",
                            step.completed
                                ? "bg-emerald-50/50 border-emerald-100"
                                : "bg-white border-slate-100 hover:border-blue-200"
                        )}
                    >
                        <div className={cn(
                            "mt-0.5 transition-colors",
                            step.completed ? "text-emerald-500" : "text-slate-300 group-hover:text-blue-400"
                        )}>
                            {step.completed ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                        </div>
                        <div className="flex-1">
                            <p className={cn(
                                "text-xs font-semibold transition-all",
                                step.completed ? "text-slate-500 line-through decoration-slate-300" : "text-slate-700"
                            )}>
                                {step.title}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                                {step.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
