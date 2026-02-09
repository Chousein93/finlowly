import {
  FolderOpen,
  Plus,
  GripVertical,
  Activity,
  Trash2,
  FolderPlus,
  MoreVertical,
  ChevronRight,
  Folder,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SharedTemplateCard } from '@/components/dashboard/shared-template-card';
import { Button } from '@/components/ui/button';
import { useAppStore, Template } from '@/store/use-app-store';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { useSortable, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function FolderCard({ folder, items }: { folder: any, items: Template[] }) {
  const { deleteFolder, renameFolder } = useAppStore();
  const { setNodeRef, isOver } = useDroppable({
    id: folder.id,
    data: {
      type: 'folder',
      folderId: folder.id
    }
  });

  const { activeDragType } = useAppStore();
  const isValidDrop = activeDragType === 'library-item';

  return (
    <div ref={setNodeRef} className="col-span-full space-y-4">
      <div className={cn(
        "flex items-center justify-between p-4 rounded-xl border transition-all duration-300",
        isOver && isValidDrop ? "bg-emerald-50 border-emerald-500 border-dashed scale-[1.01]" : "bg-slate-50/50 border-slate-100"
      )}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white border border-slate-100 shadow-sm">
            <Folder className="h-5 w-5 text-slate-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">{folder.name}</h3>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">{items.length} ÖĞE</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isOver && isValidDrop && (
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full animate-pulse capitalize">BURAYA BIRAK</span>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => renameFolder(folder.id, prompt('Yeni isim:', folder.name) || folder.name)}>
                <Activity className="h-4 w-4 mr-2" /> Yeniden Adlandır
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => deleteFolder(folder.id)} className="text-rose-600">
                <Trash2 className="h-4 w-4 mr-2" /> Sil
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pl-4 border-l-2 border-slate-100/50 ml-6">
          <SortableContext items={items.map(item => `library-${item.id}`)} strategy={rectSortingStrategy}>
            {items.map(item => (
              <LibraryItemCard key={item.id} template={item} />
            ))}
          </SortableContext>
        </div>
      )}

      {items.length === 0 && !isOver && (
        <div className="ml-10 py-4 text-center border border-dashed border-slate-100 rounded-xl">
          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Klasör Boş - Buraya sürükleyin</p>
        </div>
      )}
    </div>
  );
}

// Moved to top

function LibraryItemCard({ template }: { template: Template }) {
  const { moveToTrash, addToDashboard, selectedLibraryTemplates, setSelectedLibraryTemplate, openTemplateCreation } = useAppStore();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: `library-${template.id}`,
    data: {
      type: 'library-item',
      template: template
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
  };

  const isSelected = selectedLibraryTemplates.has(template.id);

  return (
    <SharedTemplateCard
      template={template}
      variant="library"
      isSelected={isSelected}
      onSelect={() => setSelectedLibraryTemplate(template.id, !isSelected)}
      onClick={() => openTemplateCreation(template)}

      // Primary: Add to Dashboard
      onPrimaryAction={() => {
        addToDashboard(template);
        toast.success('Widget dashboard\'a eklendi');
      }}
      primaryActionIcon={Activity}
      primaryActionLabel="Dashboard'a Ekle"

      // DND & Styling
      dndAttributes={attributes}
      dndListeners={listeners}
      isDragging={isDragging}
      dragRef={setNodeRef}
      style={style}
    />
  );
}



export function LibraryView() {
  const { libraryTemplates, libraryFolders, createFolder, selectedLibraryTemplates } = useAppStore();
  const hasItems = libraryTemplates.length > 0;

  return (
    <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Kütüphane</h1>
          <p className="text-sm text-slate-500 mt-1">
            Kişiselleştirilmiş finansal araçlarınız ve şablonlarınız.
          </p>
        </div>
        <div className="flex gap-3">
          {selectedLibraryTemplates.size > 0 && (
            <Button
              variant="outline"
              className="h-9 px-4 rounded-xl text-[11px] font-bold uppercase tracking-wider border-slate-200 hover:bg-slate-50 text-slate-600 transition-all font-sans"
              onClick={() => {
                const { selectAllLibraryTemplates } = useAppStore.getState();
                const allSelected = libraryTemplates.every(t => selectedLibraryTemplates.has(t.id));
                selectAllLibraryTemplates(!allSelected);
              }}
            >
              {libraryTemplates.length > 0 && libraryTemplates.every(t => selectedLibraryTemplates.has(t.id)) ? 'Seçimi Kaldır' : 'Tümünü Seç'}
            </Button>
          )}
        </div>
      </div>

      {/* Library Content Area */}
      <div className="min-h-[400px]">
        {!hasItems && libraryFolders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 animate-in zoom-in-95 duration-700 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
            <div className="mx-auto w-20 h-20 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm mb-6">
              <FolderOpen className="h-10 w-10 text-slate-300" />
            </div>

            <div className="text-center space-y-2 mb-8">
              <h2 className="text-xl font-semibold text-slate-900 font-sans">Kütüphaneniz Boş</h2>
              <p className="text-sm text-slate-500 leading-relaxed max-w-[320px] font-sans">
                Sağ üstteki "+ Yeni" butonunu kullanarak hazır veya özel şablonlar ekleyebilirsiniz.
              </p>
            </div>

            <Button
              variant="outline"
              onClick={() => {
                const name = prompt('Klasör adı:', 'Yeni Klasör');
                if (name) createFolder(name);
              }}
              className="h-9 px-6 rounded-xl text-[11px] font-bold uppercase tracking-wider border-slate-200 hover:bg-white transition-all gap-2 font-sans"
            >
              <Plus className="h-4 w-4" />
              İlk Klasörü Oluştur
            </Button>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
              {/* Uncategorized Items */}
              {(() => {
                const uncategorizedItems = libraryTemplates.filter(t => !libraryFolders.some(f => f.itemIds.includes(t.id)));
                return (
                  <SortableContext items={uncategorizedItems.map(t => `library-${t.id}`)} strategy={rectSortingStrategy}>
                    {uncategorizedItems.map((template) => (
                      <LibraryItemCard key={template.id} template={template} />
                    ))}

                    {/* New Folder Action Card */}
                    <button
                      onClick={() => {
                        const name = prompt('Klasör adı:', 'Yeni Klasör');
                        if (name) createFolder(name);
                      }}
                      className="group relative flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all duration-300 min-h-[160px]"
                    >
                      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-110 group-hover:bg-white transition-all duration-300">
                        <FolderPlus className="h-6 w-6 text-slate-400 group-hover:text-slate-900" />
                      </div>
                      <div className="text-center">
                        <span className="block text-xs font-bold text-slate-400 group-hover:text-slate-900 uppercase tracking-widest transition-colors font-sans">
                          Yeni Klasör
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium font-sans">
                          Öğeleri gruplayın
                        </span>
                      </div>

                      {/* Hover decoration */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Plus className="h-4 w-4 text-slate-300" />
                      </div>
                    </button>
                  </SortableContext>
                );
              })()}
            </div>

            {/* Folders */}
            <div className="space-y-8">
              {libraryFolders.map(folder => (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                  items={libraryTemplates.filter(t => folder.itemIds.includes(t.id))}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-center py-12 text-slate-300 opacity-50 select-none pointer-events-none border-t border-slate-100">
        <p className="text-xs tracking-widest uppercase italic font-bold">Finlowly Library System v1.0</p>
      </div>

      {/* Bulk Action Bar */}
      {selectedLibraryTemplates.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-xl z-50 flex items-center gap-4 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-md">
            {selectedLibraryTemplates.size} Seçildi
          </span>
          <div className="h-4 w-px bg-white/20" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const { selectedLibraryTemplates, addToDashboard, selectAllLibraryTemplates, libraryTemplates } = useAppStore.getState();
              libraryTemplates.filter(t => selectedLibraryTemplates.has(t.id)).forEach(t => addToDashboard(t));
              toast.success(`${selectedLibraryTemplates.size} widget dashboard'a eklendi`);
              selectAllLibraryTemplates(false);
            }}
            className="h-8 hover:bg-white/20 text-white text-xs font-medium"
          >
            Dashboard'a Ekle
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const { selectedLibraryTemplates, moveItemsToTemplates } = useAppStore.getState();
              const count = selectedLibraryTemplates.size;
              moveItemsToTemplates(Array.from(selectedLibraryTemplates));
              toast.success(`${count} öğe şablonlara taşındı`);
            }}
            className="h-8 hover:bg-white/20 text-white text-xs font-medium"
          >
            Şablonlara Taşı
          </Button>

          {libraryFolders.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 hover:bg-white/20 text-white text-xs font-medium gap-2"
                >
                  Klasöre Taşı
                  <ChevronRight className="h-4 w-4 rotate-90" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-48">
                <div className="px-2 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Klasör Seçin</div>
                {libraryFolders.map(folder => (
                  <DropdownMenuItem
                    key={folder.id}
                    onClick={() => {
                      const { selectedLibraryTemplates, moveIntoFolder, selectAllLibraryTemplates } = useAppStore.getState();
                      selectedLibraryTemplates.forEach(itemId => moveIntoFolder(itemId, folder.id));
                      toast.success(`${selectedLibraryTemplates.size} öğe "${folder.name}" klasörüne taşındı`);
                      selectAllLibraryTemplates(false);
                    }}
                    className="gap-2"
                  >
                    <Folder className="h-4 w-4 text-slate-400" />
                    {folder.name}
                  </DropdownMenuItem>
                ))}
                <div className="h-px bg-slate-100 my-1" />
                <DropdownMenuItem
                  onClick={() => {
                    const { selectedLibraryTemplates, moveIntoFolder, selectAllLibraryTemplates } = useAppStore.getState();
                    selectedLibraryTemplates.forEach(itemId => moveIntoFolder(itemId, null));
                    toast.success(`${selectedLibraryTemplates.size} öğe klasörden çıkarıldı`);
                    selectAllLibraryTemplates(false);
                  }}
                  className="text-slate-400"
                >
                  Klasörden Çıkar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const { selectedLibraryTemplates, moveToTrash, selectAllLibraryTemplates, libraryTemplates } = useAppStore.getState();
              libraryTemplates.filter(t => selectedLibraryTemplates.has(t.id)).forEach(t => moveToTrash(t, 'template'));
              toast.success(`${selectedLibraryTemplates.size} öğe silindi`);
              selectAllLibraryTemplates(false);
            }}
            className="h-8 hover:bg-rose-500/20 text-rose-300 hover:text-rose-100 text-xs font-medium"
          >
            Sil
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const { selectAllLibraryTemplates } = useAppStore.getState();
              selectAllLibraryTemplates(false);
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
