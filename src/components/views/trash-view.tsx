import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SharedTemplateCard } from '@/components/dashboard/shared-template-card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2, RotateCcw, AlertTriangle, Info } from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore, DeletedItem } from '@/store/use-app-store';
import { useSortable, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { formatDistanceToNow, differenceInDays } from 'date-fns';
import { tr } from 'date-fns/locale';

export function TrashView() {
  const {
    deletedItems,
    restoreFromTrash,
    permanentDelete,
    emptyTrash,
    selectedTrashItems,
    setSelectedTrashItem,
    selectAllTrashItems,
    restoreSelectedFromTrash,
    permanentDeleteSelected
  } = useAppStore();
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [isDeletingSelected, setIsDeletingSelected] = useState(false);

  const handleEmptyTrash = () => {
    emptyTrash();
    toast.success('Çöp sepeti boşaltıldı');
    setIsDeletingAll(false);
  };

  const handleRestoreSelected = (target: 'templates' | 'library') => {
    restoreSelectedFromTrash(target);
    toast.success(`Seçilen öğeler ${target === 'library' ? 'Kütüphaneye' : 'Şablonlara'} geri alındı`);
  };

  const handlePermanentDeleteSelected = () => {
    permanentDeleteSelected();
    toast.success('Seçilen öğeler kalıcı olarak silindi');
    setIsDeletingSelected(false);
  };

  if (deletedItems.length === 0) {
    return (
      <div className="p-4 sm:p-8 min-h-[60vh] flex flex-col items-center justify-center animate-in fade-in duration-500">
        <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-6">
          <Trash2 className="h-10 w-10 text-slate-300" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Çöp Sepeti Boş</h2>
        <p className="text-sm text-slate-400 max-w-[280px] text-center">
          Silinen öğeler burada görünecek
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight flex items-center gap-3">
            <Trash2 className="h-6 w-6 text-slate-600" aria-hidden="true" />
            Çöp Sepeti
          </h1>
          <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5" />
            Silinen öğeler 30 gün sonra kalıcı olarak silinir
          </p>
        </div>

        <div className="flex gap-2">
          {selectedTrashItems.size > 0 && (
            <Button
              variant="outline"
              onClick={() => selectAllTrashItems(selectedTrashItems.size !== deletedItems.length)}
              className="border-slate-200 text-slate-600 font-bold h-8 px-4 text-[11px] uppercase tracking-wider hover:bg-slate-50 rounded-lg shadow-sm"
            >
              {selectedTrashItems.size === deletedItems.length ? 'Seçimi Kaldır' : 'Tümünü Seç'}
            </Button>
          )}
        </div>
      </div>

      {/* Deleted Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 pb-24">
        <SortableContext items={deletedItems.map(item => `trash-${item.id}`)} strategy={rectSortingStrategy}>
          {deletedItems.map((item) => (
            <TrashItemCard
              key={item.id}
              item={item}
              isSelected={selectedTrashItems.has(item.id)}
              onSelect={() => setSelectedTrashItem(item.id, !selectedTrashItems.has(item.id))}
            />
          ))}
        </SortableContext>
      </div>

      {/* Bulk Action Bar */}
      {selectedTrashItems.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-6 duration-300">
          <Card className="bg-slate-900 border-none shadow-2xl rounded-2xl p-1.5 flex items-center gap-1.5 ring-1 ring-white/10">
            <div className="px-3 border-r border-slate-800 shrink-0">
              <span className="text-[10px] font-black text-white tracking-widest uppercase">
                {selectedTrashItems.size} SEÇİLİ
              </span>
            </div>

            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRestoreSelected('templates')}
                className="h-8 px-3 text-[10px] font-bold text-slate-400 hover:text-white hover:bg-slate-800 uppercase tracking-widest rounded-xl transition-all"
              >
                <RotateCcw className="h-3 w-3 mr-1.5" />
                Şablonlara
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRestoreSelected('library')}
                className="h-8 px-3 text-[10px] font-bold text-slate-400 hover:text-white hover:bg-slate-800 uppercase tracking-widest rounded-xl transition-all"
              >
                <RotateCcw className="h-3 w-3 mr-1.5" />
                Kütüphaneye
              </Button>

              <AlertDialog open={isDeletingSelected} onOpenChange={setIsDeletingSelected}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 text-[10px] font-bold text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 uppercase tracking-widest rounded-xl transition-all"
                  >
                    <Trash2 className="h-3 w-3 mr-1.5" />
                    Kalıcı Sil
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="border-none shadow-2xl rounded-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold text-slate-900">Seçilenleri Kalıcı Sil</AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-500">
                      Seçili {selectedTrashItems.size} öğeyi kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="gap-2 sm:gap-0">
                    <AlertDialogCancel className="border-slate-200 text-slate-600 font-semibold h-11">İptal</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handlePermanentDeleteSelected}
                      className="bg-rose-600 hover:bg-rose-700 text-white font-bold h-11"
                    >
                      Kalıcı Sil
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// Moved to top

function TrashItemCard({
  item,
  isSelected,
  onSelect
}: {
  item: DeletedItem;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const { restoreFromTrash, permanentDelete } = useAppStore();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: `trash-${item.id}`,
    data: {
      type: 'trash-item',
      item: item
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
  };

  // Calculate days left
  const daysLeft = differenceInDays(new Date(item.expiresAt), new Date());
  const isExpiringSoon = daysLeft <= 3;

  return (
    <SharedTemplateCard
      template={item.data || item}
      variant="trash"
      isSelected={isSelected}
      onSelect={onSelect}

      // DND & Styling
      dndAttributes={attributes}
      dndListeners={listeners}
      isDragging={isDragging}
      dragRef={setNodeRef}
      style={style}
    />
  );
}
