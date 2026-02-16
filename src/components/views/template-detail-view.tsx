'use client';

import { ArrowLeft, Settings, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/store/use-app-store';
import { cn } from '@/lib/utils';

// Import all widget renderers
import { BudgetWidget } from '@/components/dashboard/widgets/budget-widget';
import { GoalWidget } from '@/components/dashboard/widgets/goal-widget';
import { PortfolioWidget } from '@/components/dashboard/widgets/portfolio-widget';
import { DebtWidget } from '@/components/dashboard/widgets/debt-widget';
import { EducationWidget } from '@/components/dashboard/widgets/education-widget';
import { RetirementWidget } from '@/components/dashboard/widgets/retirement-widget';
import { TaxWidget } from '@/components/dashboard/widgets/tax-widget';
import { ExpenseTrackerWidget } from '@/components/dashboard/widgets/expense-tracker-widget';

export function TemplateDetailView() {
    const {
        activeDetailTemplate,
        activeDetailWidget,
        setCurrentView,
        dashboardWidgets,
        removeFromDashboard,
        moveToTrash,
        saveTempBudgetItems,
        cancelTempBudgetItems,
    } = useAppStore();

    // Always read the LATEST widget from store (so live updates reflect)
    const liveWidget = activeDetailWidget
        ? dashboardWidgets.find(w => w.id === activeDetailWidget.id) || activeDetailWidget
        : null;

    if (!activeDetailTemplate || !liveWidget) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <p className="text-slate-400 text-sm">Şablon bulunamadı.</p>
                <Button
                    variant="outline"
                    onClick={() => setCurrentView('templates')}
                    className="gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Şablonlara Dön
                </Button>
            </div>
        );
    }

    const renderWidget = () => {
        switch (liveWidget.type) {
            case 'budget':
                return <BudgetWidget widget={liveWidget} />;
            case 'emergency':
            case 'holiday':
                return <GoalWidget widget={liveWidget} />;
            case 'portfolio':
                return <PortfolioWidget widget={liveWidget} />;
            case 'debt':
            case 'debt_strategy':
                return <DebtWidget widget={liveWidget} />;
            case 'guide':
            case 'basics':
                return <EducationWidget widget={liveWidget} />;
            case 'retirement':
                return <RetirementWidget widget={liveWidget} />;
            case 'tax':
                return <TaxWidget widget={liveWidget} />;
            case 'expense_tracker':
                return <ExpenseTrackerWidget widget={liveWidget} />;
            default:
                return (
                    <div className="text-center py-12 text-slate-400">
                        <p className="text-sm">Bu şablon tipi için içerik henüz hazır değil.</p>
                    </div>
                );
        }
    };

    return (
        <div className="p-4 sm:p-8 space-y-6 animate-in fade-in duration-500 max-w-[900px] mx-auto">
            {/* Navigation Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCurrentView('templates')}
                        className="h-9 w-9 rounded-xl hover:bg-slate-100 text-slate-500"
                        title="Geri Dön"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
                            {activeDetailTemplate.title}
                        </h1>
                        <p className="text-xs text-slate-400 mt-0.5">
                            {activeDetailTemplate.description}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            const { openTemplateCreation } = useAppStore.getState();
                            openTemplateCreation(activeDetailTemplate);
                        }}
                        className="h-8 px-3 rounded-lg text-xs gap-1.5 text-slate-600 border-slate-200"
                    >
                        <Settings className="h-3.5 w-3.5" />
                        Düzenle
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            moveToTrash(activeDetailTemplate, 'template');
                            setCurrentView('templates');
                        }}
                        className="h-8 px-3 rounded-lg text-xs gap-1.5 text-rose-500 border-rose-200 hover:bg-rose-50"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        Sil
                    </Button>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        if (liveWidget) {
                            cancelTempBudgetItems(liveWidget.id);
                        }
                        setCurrentView('templates');
                    }}
                    className="h-8 px-4 rounded-lg text-xs gap-1.5 text-slate-600 border-slate-200"
                >
                    <X className="h-3.5 w-3.5" />
                    İptal
                </Button>
                <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                        if (liveWidget) {
                            // Geçici verileri kalıcı hale getir
                            const items = liveWidget.config?.budgetItems || [];
                            saveTempBudgetItems(liveWidget.id, items);
                        }
                        setCurrentView('templates');
                    }}
                    className="h-8 px-4 rounded-lg text-xs gap-1.5 bg-slate-900 hover:bg-slate-800"
                >
                    <Save className="h-3.5 w-3.5" />
                    Kaydet
                </Button>
            </div>

            {/* Main Widget Content */}
            <Card className="border-slate-200 bg-white shadow-sm overflow-hidden">
                <CardContent className="p-6">
                    {renderWidget()}
                </CardContent>
            </Card>
        </div>
    );
}
