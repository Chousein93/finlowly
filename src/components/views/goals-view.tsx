'use client';

import { useState } from 'react';
import {
    Target,
    Plus,
    MoreHorizontal,
    Calendar,
    Clock,
    Pencil,
    Trash2,
    PlusCircle,
    MinusCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useAppStore, Goal } from '@/store/use-app-store';
import { toast } from 'sonner';
import { useSortable, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const CustomGoalCard = ({ goal, isSelected, onSelect }: { goal: Goal, isSelected: boolean, onSelect: () => void }) => {
    const { moveToTrash, updateGoal } = useAppStore();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: goal.id,
        data: {
            type: 'goal',
            goal: goal
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 100 : 1,
    };

    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    const remaining = goal.targetAmount - goal.currentAmount;

    return (
        <Card
            ref={setNodeRef}
            style={style}
            className={cn(
                "border-slate-200 bg-white group overflow-hidden relative flex flex-col min-h-[180px] transition-all duration-300",
                isDragging ? "opacity-50 scale-[0.98] shadow-xl z-50 ring-2 ring-slate-900 ring-offset-2" : "hover:shadow-lg hover:scale-[1.01]",
                isSelected && "ring-2 ring-slate-900 ring-offset-2"
            )}
        >
            {/* Selection Overlay */}
            {isSelected && (
                <div className="absolute inset-0 bg-slate-900/5 z-0 pointer-events-none" />
            )}

            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
                <div className="flex items-center gap-3">
                    {/* Drag Handle */}
                    <div
                        {...attributes}
                        {...listeners}
                        className="cursor-grab active:cursor-grabbing p-1.5 -ml-2 rounded-md text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        <MoreHorizontal className="h-4 w-4 rotate-90" />
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                        <Target className="h-5 w-5 text-slate-400 group-hover:text-slate-900 transition-colors" />
                    </div>
                    <CardTitle className="sm:text-lg text-base font-bold text-slate-900 line-clamp-1 select-none">{goal.name}</CardTitle>
                </div>

                <div className="flex items-center gap-1">
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelect();
                        }}
                        className={cn(
                            "h-5 w-5 rounded-md border-2 transition-all cursor-pointer mr-2 flex items-center justify-center",
                            isSelected
                                ? "bg-slate-900 border-slate-900"
                                : "border-slate-300 bg-transparent hover:border-slate-400"
                        )}
                    >
                        {isSelected && <Target className="h-3 w-3 text-white" />}
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label="Hedef Seçenekleri">
                                <MoreHorizontal className="h-4 w-4 text-slate-400" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32">
                            <DropdownMenuItem className="text-xs font-medium cursor-pointer">
                                <Pencil className="h-3.5 w-3.5 mr-2" />
                                Düzenle
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-xs font-medium cursor-pointer text-rose-600 focus:text-rose-600"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (confirm('Bu hedefi silmek istediğinize emin misiniz?')) {
                                        moveToTrash(goal, 'goal');
                                        toast.success('Çöp sepetine taşındı');
                                    }
                                }}
                            >
                                <Trash2 className="h-3.5 w-3.5 mr-2" />
                                Sil
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-4 relative z-10">
                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">HEDEF TUTAR</span>
                        <p className="text-sm font-bold text-slate-900">₺{goal.targetAmount.toLocaleString('tr-TR')}</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">MEVCUT</span>
                        <p className="text-sm font-bold text-emerald-600">₺{goal.currentAmount.toLocaleString('tr-TR')}</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">KALAN</span>
                        <p className="text-sm font-bold text-slate-900">₺{remaining.toLocaleString('tr-TR')}</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-end">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">İLERLEME</span>
                        <span className="text-xs font-bold text-slate-900">%{progress.toFixed(0)}</span>
                    </div>
                    <Progress value={progress} className="h-2.5 bg-slate-100" />
                </div>

                <div className="grid grid-cols-2 gap-4 py-3 px-4 bg-slate-50/50 rounded-xl border border-slate-100">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3 text-slate-400" />
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">HEDEF TARİHİ</span>
                        </div>
                        <span className="text-xs font-semibold text-slate-700">{goal.targetDate}</span>
                    </div>
                    <div className="flex flex-col gap-1 text-right">
                        <div className="flex items-center gap-1.5 justify-end">
                            <Clock className="h-3 w-3 text-slate-400" />
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">KALAN SÜRE</span>
                        </div>
                        <span className="text-xs font-bold text-slate-900">120 gün kaldı</span>
                    </div>
                </div>

                <div className="flex gap-2 pt-2">
                    <Button
                        variant="outline"
                        className="flex-1 h-10 text-xs font-bold border-slate-200 hover:bg-slate-50 hover:text-emerald-600 rounded-lg group"
                        onClick={(e) => {
                            e.stopPropagation();
                            const amount = Number(prompt('Eklenecek tutar:', '1000'));
                            if (amount > 0) {
                                updateGoal(goal.id, { currentAmount: goal.currentAmount + amount });
                                toast.success('Tutar eklendi');
                            }
                        }}
                    >
                        <PlusCircle className="h-4 w-4 mr-2 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                        Para Ekle
                    </Button>
                    <Button
                        variant="outline"
                        className="flex-1 h-10 text-xs font-bold border-slate-200 hover:bg-slate-50 hover:text-rose-600 rounded-lg group"
                        onClick={(e) => {
                            e.stopPropagation();
                            const amount = Number(prompt('Çıkarılacak tutar:', '1000'));
                            if (amount > 0) {
                                updateGoal(goal.id, { currentAmount: Math.max(0, goal.currentAmount - amount) });
                                toast.success('Tutar çıkarıldı');
                            }
                        }}
                    >
                        <MinusCircle className="h-4 w-4 mr-2 text-slate-400 group-hover:text-rose-500 transition-colors" />
                        Para Çıkar
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export function GoalsView() {
    const { goals, goalsOrder } = useAppStore();
    const [selectedGoals, setSelectedGoals] = useState<Set<string>>(new Set());

    // Sort goals based on order
    const sortedGoals = [...goals].sort((a, b) => {
        const indexA = goalsOrder.indexOf(a.id);
        const indexB = goalsOrder.indexOf(b.id);
        return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
    });

    const toggleSelection = (id: string) => {
        const newSelection = new Set(selectedGoals);
        if (newSelection.has(id)) newSelection.delete(id);
        else newSelection.add(id);
        setSelectedGoals(newSelection);
    };

    if (goals.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 animate-in fade-in duration-500 min-h-[60vh]">
                <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 shadow-sm">
                    <Target className="h-10 w-10 text-slate-300" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Henüz Hedef Yok</h2>
                <p className="text-slate-500 mt-2 text-center max-w-sm">
                    İlk finansal hedefinizi ekleyerek tasarruf etmeye başlayın.
                </p>
                <Button className="mt-8 bg-slate-900 hover:bg-slate-800 text-white font-bold h-11 px-6 rounded-xl shadow-lg shadow-slate-900/10">
                    <Plus className="h-5 w-5 mr-2" />
                    Yeni Hedef Ekle
                </Button>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Hedefler</h1>
                    <p className="text-sm text-slate-500 mt-1">Gelecekteki hayalleriniz için tasarruf takibi.</p>
                </div>
                <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-11 px-6 rounded-xl shadow-lg shadow-slate-900/10 shrink-0">
                    <Plus className="h-5 w-5 mr-2" />
                    Yeni Hedef Ekle
                </Button>
            </div>

            {/* Goals Grid */}
            <SortableContext
                items={sortedGoals.map(g => g.id)}
                strategy={rectSortingStrategy}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                    {sortedGoals.map((goal) => (
                        <CustomGoalCard
                            key={goal.id}
                            goal={goal}
                            isSelected={selectedGoals.has(goal.id)}
                            onSelect={() => toggleSelection(goal.id)}
                        />
                    ))}
                </div>
            </SortableContext>
        </div>
    );
}
