'use client';

import {
  PiggyBank,
  DollarSign,
  Plane,
  ShoppingCart,
  TrendingUp,
  CreditCard,
  FileText,
  BookOpen,
  Calculator,
  Receipt,
  Wallet,
  GripVertical,
  X,
  Save,
  Star,
  LayoutTemplate,
  Plus
} from 'lucide-react';
import { SharedTemplateCard } from '@/components/dashboard/shared-template-card';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/use-app-store';
import { toast } from 'sonner';
import { useSortable, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';

const ICON_MAP: Record<string, any> = {
  budget: PiggyBank,
  emergency: DollarSign,
  holiday: Plane,
  expense_tracker: ShoppingCart,
  portfolio: TrendingUp,
  debt: CreditCard,
  guide: FileText,
  basics: BookOpen,
  retirement: Calculator,
  tax: Receipt,
  debt_strategy: Wallet,
};

// Moved to top

function SortableTemplateCard({ template }: { template: any }) {
  const { moveToTrash, toggleFavorite, favorites, addToLibrary, openTemplateCreation, selectedTemplates, setSelectedTemplate } = useAppStore();
  const isFavorite = favorites.includes(template.id);
  const isSelected = selectedTemplates.has(template.id);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: template.id,
    data: {
      type: 'template',
      template: template
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
  };

  return (
    <SharedTemplateCard
      template={template}
      variant="template"
      isSelected={isSelected}
      onSelect={() => setSelectedTemplate(template.id, !isSelected)}
      onClick={() => openTemplateCreation(template)}
      isFavorite={isFavorite}

      // Secondary: Favorite
      onSecondaryAction={() => toggleFavorite(template.id)}
      secondaryActionIcon={Star}
      secondaryActionLabel={isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}

      // DND & Styling
      dndAttributes={attributes}
      dndListeners={listeners}
      isDragging={isDragging}
      dragRef={setNodeRef}
      style={style}
    />
  );
}

export function TemplatesView() {
  const { templates, templatesOrder, reorderTemplates, deletedItems, libraryTemplates, selectedTemplates } = useAppStore();

  // Sort templates from store based on templatesOrder
  const sortedTemplates = [...templates].sort((a, b) => {
    const indexA = templatesOrder.indexOf(a.id);
    const indexB = templatesOrder.indexOf(b.id);
    const valA = indexA === -1 ? 999 : indexA;
    const valB = indexB === -1 ? 999 : indexB;
    return valA - valB;
  });

  // Filter and attach icon mapping if icon is null in store
  const activeTemplates = sortedTemplates
    .map(t => ({
      ...t,
      icon: t.icon || ICON_MAP[t.type] || Wallet
    }))
    .filter(t =>
      !deletedItems.some(d => d.type === 'template' && d.id === t.id) &&
      !libraryTemplates.some(lt => lt.id === t.id)
    );

  return (
    <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Şablonlar</h1>
          <p className="text-sm text-slate-500 mt-1">
            Kreatif ve özelleştirilebilir finansal araçlarınız.
          </p>
        </div>
        <div className="flex gap-2">
          {selectedTemplates.size > 0 && (
            <Button
              variant="outline"
              onClick={() => {
                const { selectAllTemplates } = useAppStore.getState();
                const allSelected = activeTemplates.every(t => selectedTemplates.has(t.id));
                selectAllTemplates(!allSelected);
              }}
              className="h-8 px-4 rounded-lg text-[11px] font-bold uppercase tracking-wider"
            >
              {activeTemplates.every(t => selectedTemplates.has(t.id)) ? 'Seçimi Kaldır' : 'Tümünü Seç'}
            </Button>
          )}
        </div>
      </div>

      <div className="min-h-[400px]">
        {activeTemplates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 animate-in zoom-in-95 duration-700 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
            <div className="mx-auto w-20 h-20 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm mb-6">
              <LayoutTemplate className="h-10 w-10 text-slate-300" />
            </div>

            <div className="text-center space-y-2 mb-8">
              <h2 className="text-xl font-semibold text-slate-900 font-sans">Henüz Şablonunuz Yok</h2>
              <p className="text-sm text-slate-500 leading-relaxed max-w-[320px] font-sans">
                Kendi finansal şablonlarınızı oluşturmak için aşağıdaki butonu veya sağ üstteki "+ Yeni" butonunu kullanın.
              </p>
            </div>

            <Button
              onClick={() => {
                const { openTemplateCreation } = useAppStore.getState();
                openTemplateCreation({
                  id: `temp-${Date.now()}`,
                  title: 'Yeni Şablon',
                  description: 'Kendi şablonunuzu özelleştirin',
                  type: 'budget',
                  config: {}
                });
              }}
              className="bg-slate-900 text-white hover:bg-slate-800 h-10 px-8 rounded-xl shadow-lg shadow-slate-900/10 gap-2 text-[11px] font-bold uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98] font-sans"
            >
              <Plus className="h-4 w-4" />
              Yeni Şablon Oluştur
            </Button>
          </div>
        ) : (
          <SortableContext
            items={activeTemplates.map(t => t.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {activeTemplates.map((template) => (
                <SortableTemplateCard key={template.id} template={template} />
              ))}

              {/* Add Template Card */}
              <button
                onClick={() => {
                  const { openTemplateCreation } = useAppStore.getState();
                  openTemplateCreation({
                    id: `temp-${Date.now()}`,
                    title: 'Yeni Şablon',
                    description: 'Kendi şablonunuzu özelleştirin',
                    type: 'budget',
                    config: {}
                  });
                }}
                className="group relative flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all duration-300 min-h-[160px]"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-110 group-hover:bg-white transition-all duration-300">
                  <Plus className="h-6 w-6 text-slate-400 group-hover:text-slate-900" />
                </div>
                <div className="text-center">
                  <span className="block text-xs font-bold text-slate-400 group-hover:text-slate-900 uppercase tracking-widest transition-colors font-sans">
                    Şablon Oluştur
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium font-sans">
                    Kişiye özel tasarım
                  </span>
                </div>
              </button>
            </div>
          </SortableContext>
        )}
      </div>

      {/* Footer message */}
      <div className="flex items-center justify-center py-10 text-slate-300 opacity-40 select-none pointer-events-none">
        <p className="text-[10px] tracking-[0.2em] font-bold uppercase transition-opacity duration-300 hover:opacity-100">
          Finlowly Discovery System v1.0
        </p>
      </div>

      {/* Bulk Action Bar */}
      {selectedTemplates.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-xl z-50 flex items-center gap-4 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-md">
            {selectedTemplates.size} Seçildi
          </span>
          <div className="h-4 w-px bg-white/20" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const { selectedTemplates, addToLibrary, selectAllTemplates } = useAppStore.getState();
              activeTemplates.filter(t => selectedTemplates.has(t.id)).forEach(t => addToLibrary(t));
              toast.success(`${selectedTemplates.size} şablon kütüphaneye eklendi`);
              selectAllTemplates(false);
            }}
            className="h-8 hover:bg-white/20 text-white text-xs font-medium"
          >
            Kütüphaneye Ekle
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const { selectedTemplates, moveToTrash, selectAllTemplates } = useAppStore.getState();
              activeTemplates.filter(t => selectedTemplates.has(t.id)).forEach(t => moveToTrash(t, 'template'));
              toast.success(`${selectedTemplates.size} şablon çöp sepetine taşındı`);
              selectAllTemplates(false);
            }}
            className="h-8 hover:bg-rose-500/20 text-rose-300 hover:text-rose-100 text-xs font-medium"
          >
            Çöp Sepetine Taşı
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const { selectAllTemplates } = useAppStore.getState();
              selectAllTemplates(false);
            }}
            className="h-8 w-8 p-0 rounded-full hover:bg-white/20 text-white/50 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
