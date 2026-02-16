'use client';

import { useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Clock,
  ArrowUpCircle,
  ArrowDownCircle,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/use-app-store';
import { cn } from '@/lib/utils';

interface StatItemProps {
  title: string;
  value: string;
  icon: any;
  iconColor: string;
  bgColor: string;
  trend?: 'up' | 'down' | 'neutral';
}

function StatItem({ title, value, icon: Icon, iconColor, bgColor, trend }: StatItemProps) {
  return (
    <Card className="border-slate-100 shadow-none bg-white hover:bg-slate-50/50 transition-colors duration-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${bgColor} shrink-0`}>
            <Icon className={`h-4 w-4 ${iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">{title}</p>
            <p className={cn(
              "text-lg font-bold truncate mt-0.5",
              trend === 'up' ? "text-emerald-600" : trend === 'down' ? "text-rose-600" : "text-slate-900"
            )}>{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function RightPanel() {
  const { openNewTransaction, toggleRightPanel, dashboardWidgets } = useAppStore();

  // ── Live Data from Dashboard Widgets ────────────────────────────────
  const { totalIncome, totalExpense, netBalance } = useMemo(() => {
    let income = 0;
    let expense = 0;

    for (const w of dashboardWidgets) {
      const items = w.config?.budgetItems || [];

      if (w.type === 'budget' || w.type === 'expense_tracker') {
        for (const item of items) {
          if (item.type === 'income') income += item.amount;
          else expense += item.amount;
        }
      }
    }

    return {
      totalIncome: income,
      totalExpense: expense,
      netBalance: income - expense,
    };
  }, [dashboardWidgets]);

  const formatCurrency = (val: number) =>
    `₺${Math.abs(val).toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  return (
    <aside className="w-80 bg-white border-l border-slate-200 flex flex-col hidden xl:flex animate-in slide-in-from-right duration-500 overflow-hidden">
      {/* Structured Header */}
      <div className="h-14 flex items-center justify-between px-6 border-b border-slate-50 shrink-0 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">FİNLOWLY</span>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => openNewTransaction()}
            className="h-8 px-3 rounded-full bg-slate-900 text-white text-[10px] font-bold hover:bg-slate-800 transition-colors shadow-sm"
          >
            + Yeni
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleRightPanel()}
            className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200"
            title="Paneli Gizle"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-6 pt-2 space-y-8 h-full overflow-y-auto">

        {/* Quick Stats Section — LIVE DATA */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 tracking-tight">Hızlı İstatistikler</h2>
            {(totalIncome > 0 || totalExpense > 0) && (
              <span className="text-[9px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full animate-pulse">Canlı</span>
            )}
          </div>

          <div className="grid gap-3">
            <StatItem
              title="Toplam Gelir"
              value={formatCurrency(totalIncome)}
              icon={ArrowUpCircle}
              iconColor="text-emerald-600"
              bgColor="bg-emerald-50"
              trend={totalIncome > 0 ? 'up' : 'neutral'}
            />
            <StatItem
              title="Toplam Gider"
              value={formatCurrency(totalExpense)}
              icon={ArrowDownCircle}
              iconColor="text-rose-600"
              bgColor="bg-rose-50"
              trend={totalExpense > 0 ? 'down' : 'neutral'}
            />
            <StatItem
              title="Kalan Bakiye"
              value={`${netBalance < 0 ? '-' : ''}${formatCurrency(netBalance)}`}
              icon={Wallet}
              iconColor={netBalance >= 0 ? "text-emerald-600" : "text-rose-600"}
              bgColor={netBalance >= 0 ? "bg-emerald-50" : "bg-rose-50"}
              trend={netBalance >= 0 ? 'up' : 'down'}
            />
          </div>
        </section>

        {/* Separator */}
        <div className="border-t border-slate-100" />

        {/* Recent Activity Section */}
        <section className="space-y-4 flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 tracking-tight">Son Aktiviteler</h2>
            <span className="text-[10px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">Canlı</span>
          </div>

          <div className="h-full flex flex-col items-center justify-center py-12 text-center space-y-3">
            <div className="p-3 rounded-full bg-slate-50 border border-slate-100">
              <Clock className="h-6 w-6 text-slate-300" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-600">Henüz aktivite yok</p>
              <p className="text-xs text-slate-400 max-w-[180px]">
                Yaptığınız işlemler ve güncellemeler burada listelenecektir.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom Tip Card */}
        <Card className="bg-slate-900 border-none shadow-md overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12" />
          <CardContent className="p-4 relative z-10">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Günün İpucu</p>
            <p className="text-xs text-slate-200 mt-2 text-center leading-relaxed italic">
              "Birikim yapmanın en iyi yolu, harcamadan önce kenara ayırmaktır."
            </p>
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}
