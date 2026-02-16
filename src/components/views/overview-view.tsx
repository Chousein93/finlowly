'use client';

import { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  LayoutGrid,
  ArrowUpCircle,
  ArrowDownCircle,
  CreditCard,
  PieChart,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/use-app-store';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { WidgetCard } from '@/components/dashboard/widget-card';

function DropZone() {
  const { isOver, setNodeRef } = useDroppable({
    id: 'dashboard-drop-zone',
  });

  const { activeDragType } = useAppStore();
  const isValid = activeDragType === 'library-item';

  if (!activeDragType || activeDragType === 'widget') return null;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "w-full h-32 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-2",
        isOver && isValid ? "border-emerald-500 bg-emerald-50/50 scale-[1.01]" : "border-slate-200 bg-slate-50/30",
        isOver && !isValid ? "border-rose-300 bg-rose-50/30" : ""
      )}
    >
      <div className={cn(
        "p-2 rounded-full",
        isOver && isValid ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"
      )}>
        <Plus className="h-6 w-6" />
      </div>
      <p className={cn(
        "text-xs font-bold uppercase tracking-wider",
        isOver && isValid ? "text-emerald-600" : "text-slate-400"
      )}>
        {isOver && !isValid ? "Buraya bırakılamaz" : "Buraya bırak"}
      </p>
    </div>
  );
}

const EXPENSE_CATEGORIES: Record<string, { label: string; color: string }> = {
  food: { label: 'Gıda', color: 'bg-orange-500' },
  transport: { label: 'Ulaşım', color: 'bg-blue-500' },
  shopping: { label: 'Alışveriş', color: 'bg-purple-500' },
  bills: { label: 'Faturalar', color: 'bg-rose-500' },
  entertainment: { label: 'Eğlence', color: 'bg-pink-500' },
  other: { label: 'Diğer', color: 'bg-slate-500' },
};

export function OverviewView() {
  const [timeRange, setTimeRange] = useState('month');
  const [viewType, setViewType] = useState<'income' | 'expense'>('income');
  const { dashboardWidgets } = useAppStore();

  // ── Computed Live Data ────────────────────────────────────────────
  const activeWidgets = useMemo(() => dashboardWidgets.filter(w => !w.isHidden), [dashboardWidgets]);

  const { totalIncome, totalExpense, netBalance, totalDebt, totalMinPayment, debtCount, categoryData, totalPortfolio, totalGoalSaved, totalGoalRemaining } = useMemo(() => {
    let income = 0;
    let expense = 0;
    let debt = 0;
    let minPay = 0;
    let dCount = 0;
    let portfolio = 0;
    let goalSaved = 0;
    let goalTarget = 0;
    const catMap: Record<string, number> = {};

    for (const w of activeWidgets) {
      const items = w.config?.budgetItems || [];

      // Budget / Expense Tracker widgets
      if (w.type === 'budget' || w.type === 'expense_tracker') {
        for (const item of items) {
          if (item.type === 'income') income += item.amount;
          else expense += item.amount;

          // Category tracking for expense tracker
          if (item.type === 'expense' && (item as any).category) {
            const cat = (item as any).category as string;
            catMap[cat] = (catMap[cat] || 0) + item.amount;
          }
        }
      }

      // Debt widgets
      if (w.type === 'debt_strategy') {
        const debts = w.config?.debts || [];
        for (const d of debts) {
          debt += d.amount;
          minPay += d.minPayment;
          dCount++;
        }
      }

      // Portfolio widgets
      if (w.type === 'portfolio') {
        const assets = w.config?.assets || [];
        for (const a of assets) portfolio += a.value;
      }

      // Goal widgets (emergency, holiday)
      if (w.type === 'emergency' || w.type === 'holiday') {
        goalSaved += w.config?.currentAmount || 0;
        goalTarget += w.config?.targetAmount || 0;
      }
    }

    const totalExpenseForCats = Object.values(catMap).reduce((s, v) => s + v, 0);
    const cats = Object.entries(catMap)
      .map(([key, total]) => ({
        name: EXPENSE_CATEGORIES[key]?.label || key,
        color: EXPENSE_CATEGORIES[key]?.color || 'bg-slate-400',
        total,
        percentage: totalExpenseForCats > 0 ? (total / totalExpenseForCats) * 100 : 0,
      }))
      .sort((a, b) => b.total - a.total);

    return {
      totalIncome: income,
      totalExpense: expense,
      netBalance: income - expense,
      totalDebt: debt,
      totalMinPayment: minPay,
      debtCount: dCount,
      categoryData: cats,
      totalPortfolio: portfolio,
      totalGoalSaved: goalSaved,
      totalGoalRemaining: Math.max(goalTarget - goalSaved, 0),
    };
  }, [activeWidgets]);

  return (
    <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Genel Bakış</h1>
        <p className="text-sm text-slate-500 mt-1">Finansal performansınızın detaylı özeti.</p>
      </div>

      {/* Performance Overview Card */}
      <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-500 overflow-hidden bg-white">
        <CardHeader className="border-b border-slate-50 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-slate-600" />
              Performans Genel Bakış
            </CardTitle>

            <div className="flex items-center gap-2">
              {/* Gelir/Gider Toggle */}
              <div className="flex items-center bg-slate-100 p-1 rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewType('income')}
                  className={cn(
                    "px-3 py-1.5 h-8 text-xs font-medium transition-all duration-200",
                    viewType === 'income'
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
                  Gelir
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewType('expense')}
                  className={cn(
                    "px-3 py-1.5 h-8 text-xs font-medium transition-all duration-200",
                    viewType === 'expense'
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  <TrendingDown className="h-3.5 w-3.5 mr-1.5" />
                  Gider
                </Button>
              </div>

              {/* Zaman Aralığı Seçici */}
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[130px] h-9 text-xs border-slate-200 bg-white hover:bg-slate-50 transition-colors">
                  <Calendar className="h-3.5 w-3.5 mr-2 text-slate-400" />
                  <SelectValue placeholder="Zaman Aralığı" />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="today" className="text-xs">Bugün</SelectItem>
                  <SelectItem value="week" className="text-xs">Hafta</SelectItem>
                  <SelectItem value="month" className="text-xs">Ay</SelectItem>
                  <SelectItem value="year" className="text-xs">Yıl</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-8 pb-8">
          {/* Placeholder Grafik Alanı with Skeleton effects */}
          <div className="relative h-[320px] w-full rounded-xl border border-dashed border-slate-300 bg-slate-50/50 flex flex-col items-center justify-center group overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 shrink-0" />

            <div className="relative z-10 flex flex-col items-center animate-in zoom-in-95 duration-700 w-full px-12">
              <div className="w-16 h-16 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <BarChart3 className="h-8 w-8 text-slate-400" />
              </div>

              <div className="w-full max-w-sm space-y-4">
                <div className="flex items-end justify-center gap-1.5 h-32 mb-4">
                  {[40, 70, 45, 90, 65, 80, 50, 85, 60, 75].map((h, i) => (
                    <div
                      key={i}
                      className="w-full bg-slate-200/50 rounded-t-sm animate-pulse"
                      style={{ height: `${h}%`, animationDelay: `${i * 100}ms` }}
                    />
                  ))}
                </div>
                <div className="space-y-2 flex flex-col items-center">
                  <h3 className="text-base font-bold text-slate-700 tracking-tight">Performans Verileri Bekleniyor</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-[280px] text-center leading-relaxed">
                    İşlemlerinizi ekledikçe finansal gelişiminiz burada görselleştirilecek.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Cards Grid - LIVE DATA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Monthly Summary - Live from budget/expense widgets */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 bg-white group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Aylık Özet</CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Gelir</span>
                <div className="flex items-center gap-1.5">
                  <ArrowUpCircle className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-sm font-bold text-emerald-600">₺{totalIncome.toLocaleString('tr-TR')}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Gider</span>
                <div className="flex items-center gap-1.5">
                  <ArrowDownCircle className="h-3.5 w-3.5 text-rose-500" />
                  <span className="text-sm font-bold text-rose-600">₺{totalExpense.toLocaleString('tr-TR')}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Net</span>
                <div className="flex items-center gap-1.5">
                  <div className="h-3.5 w-3.5 rounded-full bg-slate-100 flex items-center justify-center">
                    {netBalance >= 0 ? <TrendingUp className="h-2 w-2 text-emerald-500" /> : <TrendingDown className="h-2 w-2 text-rose-500" />}
                  </div>
                  <span className={cn("text-sm font-bold", netBalance >= 0 ? "text-emerald-600" : "text-rose-600")}>₺{Math.abs(netBalance).toLocaleString('tr-TR')}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Debt Status - Live from debt widgets */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 bg-white group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Borç Durumu</CardTitle>
            <CreditCard className="h-4 w-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Toplam Borç</span>
                <span className="text-sm font-bold text-slate-900">₺{totalDebt.toLocaleString('tr-TR')}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Min. Ödeme</span>
                <span className="text-sm font-bold text-slate-900">₺{totalMinPayment.toLocaleString('tr-TR')}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Borç Sayısı</span>
                <span className="text-sm font-bold text-slate-900">{debtCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Category Distribution - Live from expense tracker widgets */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 bg-white group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Harcama Kategorileri</CardTitle>
            <PieChart className="h-4 w-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <div className="space-y-2 py-1">
                {categoryData.slice(0, 4).map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-2 h-2 rounded-full", cat.color)} />
                      <span className="font-medium text-slate-700">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">₺{cat.total.toLocaleString('tr-TR')}</span>
                      <span className="text-[10px] text-slate-400">%{cat.percentage.toFixed(0)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-6 py-2">
                <div className="relative h-20 w-20 shrink-0">
                  <div className="absolute inset-0 rounded-full border-[6px] border-slate-100 border-dashed animate-spin-slow" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PieChart className="h-6 w-6 text-slate-200" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-slate-700">Veri yok</h4>
                  <p className="text-[10px] text-slate-400 leading-tight">Harcama eklediğinizde kategorileriniz burada görünecektir.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 4. Portfolio & Goals Overview */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 bg-white group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Varlık & Hedefler</CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
          </CardHeader>
          <CardContent>
            {(totalPortfolio > 0 || totalGoalSaved > 0) ? (
              <div className="grid grid-cols-3 gap-2 mt-1">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Portföy</span>
                  <span className="text-sm font-bold text-emerald-600">₺{totalPortfolio.toLocaleString('tr-TR')}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Hedef Birikim</span>
                  <span className="text-sm font-bold text-blue-600">₺{totalGoalSaved.toLocaleString('tr-TR')}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Hedef Kalan</span>
                  <span className="text-sm font-bold text-amber-600">₺{totalGoalRemaining.toLocaleString('tr-TR')}</span>
                </div>
              </div>
            ) : (
              <div className="h-20 w-full rounded-lg border border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="h-1 w-8 rounded-full bg-slate-200" />
                  <div className="h-1 w-12 rounded-full bg-slate-100" />
                  <div className="h-1 w-6 rounded-full bg-slate-50" />
                </div>
                <p className="text-[10px] text-slate-400 text-center font-medium">Veri yok - Portföy veya hedef widget'ı ekleyin.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dashboard Widget Area */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-semibold text-slate-800 tracking-tight flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-slate-500" />
            Widget Alanı
          </h2>
        </div>

        <DropZone />

        {/* Widgets Grid */}
        <SortableContext
          items={activeWidgets.map(w => w.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full min-h-[100px]">
            {activeWidgets.map((widget) => (
              <WidgetCard key={widget.id} widget={widget} />
            ))}
          </div>
        </SortableContext>

        {/* Empty State */}
        {activeWidgets.length === 0 && (
          <div className="relative min-h-[300px] w-full rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/30 flex flex-col items-center justify-center transition-all duration-300 group">
            <div className="flex flex-col items-center max-w-[360px] text-center space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
              <div className="w-14 h-14 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <LayoutGrid className="h-7 w-7 text-slate-300" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-medium text-slate-700">Dashboard'unuz Boş</h3>
                <p className="text-sm text-slate-400 leading-relaxed px-4">
                  Kütüphanenizden şablonları buraya sürükleyerek kişisel dashboard'unuzu oluşturun.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer message */}
      <div className="flex items-center justify-center py-10 text-slate-300 opacity-40 select-none pointer-events-none">
        <p className="text-[10px] tracking-[0.2em] font-bold uppercase transition-opacity duration-300 hover:opacity-100">
          Finlowly Dashboard System v1.0
        </p>
      </div>
    </div>
  );
}
