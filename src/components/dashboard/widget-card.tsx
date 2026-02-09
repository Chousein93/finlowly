import {
    GripVertical,
    Trash2,
    Plus,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppStore, DashboardWidget } from '@/store/use-app-store';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';

// Import Specific Widgets
import { BudgetWidget } from './widgets/budget-widget';
import { GoalWidget } from './widgets/goal-widget';
import { PortfolioWidget } from './widgets/portfolio-widget';
import { DebtWidget } from './widgets/debt-widget';
import { EducationWidget } from './widgets/education-widget';
import { RetirementWidget } from './widgets/retirement-widget';
import { TaxWidget } from './widgets/tax-widget';
import { ExpenseTrackerWidget } from './widgets/expense-tracker-widget';

export function WidgetCard({ widget }: { widget: DashboardWidget }) {
    const { removeFromDashboard } = useAppStore();
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: widget.id,
        data: {
            type: 'widget',
            widget: widget
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 100 : 1,
    };

    const renderContent = () => {
        const { type, customFields } = widget;

        switch (type) {
            case 'budget':
                return <BudgetWidget widget={widget} />;
            case 'emergency':
            case 'holiday':
                return <GoalWidget widget={widget} />;
            case 'portfolio':
                return <PortfolioWidget widget={widget} />;
            case 'debt':
            case 'debt_strategy':
                return <DebtWidget widget={widget} />;
            case 'guide':
            case 'basics':
                return <EducationWidget widget={widget} />;
            case 'retirement':
                return <RetirementWidget widget={widget} />;
            case 'tax':
                return <TaxWidget widget={widget} />;
            case 'expense_tracker':
                return <ExpenseTrackerWidget widget={widget} />;
            default:
                // Default generic rendering for unknown types or just custom fields
                return (
                    <div className="space-y-4">
                        {customFields && customFields.length > 0 ? (
                            <div className="grid grid-cols-1 gap-2.5">
                                {customFields.map(cf => (
                                    <div key={cf.id} className="group/field relative">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest truncate">{cf.label}</p>
                                        </div>
                                        <div className="p-2.5 rounded-lg bg-slate-50/50 border border-slate-100 group-hover/field:border-slate-300 transition-colors">
                                            <p className="text-sm font-semibold text-slate-700">{cf.value || '-'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-32 w-full flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 group/empty hover:bg-slate-50 transition-all duration-500">
                                <div className="p-3 rounded-full bg-white shadow-sm border border-slate-100 mb-3 group-hover/empty:scale-110 transition-transform">
                                    <Plus className="h-5 w-5 text-slate-300" />
                                </div>
                                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">İçerik Hazırlanıyor</p>
                                <p className="text-[11px] text-slate-300 mt-1 italic">Veri girişi yapın...</p>
                            </div>
                        )}
                    </div>
                );
        }
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            className={cn(
                "group relative border-slate-200 bg-white hover:border-slate-400 hover:shadow-lg hover:scale-[1.01] transition-all duration-300 overflow-hidden flex flex-col min-h-[220px]",
                isDragging && "opacity-50 scale-[0.98] shadow-2xl cursor-grabbing z-50"
            )}
        >
            {/* Visual Drag Handle - Floating Top Left */}
            <div
                {...attributes}
                {...listeners}
                className="absolute top-3 left-3 p-1.5 rounded-md text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 z-10"
                onClick={(e) => e.stopPropagation()}
                title="Sürükle"
            >
                <GripVertical className="h-4 w-4" />
            </div>

            {/* Delete Button - Floating Top Right */}
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
                onClick={(e) => {
                    e.stopPropagation();
                    removeFromDashboard(widget.id);
                }}
                aria-label="Widget'ı Kaldır"
                title="Kaldır"
            >
                <Trash2 className="h-4 w-4" />
            </Button>

            <CardHeader className="pb-2 pt-8 px-6">
                <CardTitle className="sm:text-base text-sm font-semibold text-slate-800 tracking-tight line-clamp-1 text-center">
                    {widget.title}
                </CardTitle>
            </CardHeader>

            <CardContent className="px-6 pb-6 pt-0 flex-1 flex flex-col">
                {renderContent()}
            </CardContent>
        </Card>
    );
}
