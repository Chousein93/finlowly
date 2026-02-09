'use client';

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
import { X } from 'lucide-react';

interface StatItemProps {
  title: string;
  value: string;
  icon: any;
  iconColor: string;
  bgColor: string;
}

function StatItem({ title, value, icon: Icon, iconColor, bgColor }: StatItemProps) {
  return (
    <Card className="border-slate-100 shadow-none bg-white hover:bg-slate-50/50 transition-colors duration-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${bgColor} shrink-0`}>
            <Icon className={`h-4 w-4 ${iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">{title}</p>
            <p className="text-lg font-bold text-slate-900 truncate mt-0.5">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function RightPanel() {
  const { openNewTransaction, toggleRightPanel } = useAppStore();

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

        {/* Quick Stats Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 tracking-tight">Hızlı İstatistikler</h2>
          </div>

          <div className="grid gap-3">
            <StatItem
              title="Toplam Gelir"
              value="₺0"
              icon={ArrowUpCircle}
              iconColor="text-emerald-600"
              bgColor="bg-emerald-50"
            />
            <StatItem
              title="Toplam Gider"
              value="₺0"
              icon={ArrowDownCircle}
              iconColor="text-rose-600"
              bgColor="bg-rose-50"
            />
            <StatItem
              title="Kalan Bakiye"
              value="₺0"
              icon={Wallet}
              iconColor="text-slate-600"
              bgColor="bg-slate-100"
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
