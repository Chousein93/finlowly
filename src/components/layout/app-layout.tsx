'use client';

import { ReactNode, useState } from 'react';
import { Sidebar } from './sidebar';
import { RightPanel } from './right-panel';
import { Button } from '@/components/ui/button';
import { Plus, ChevronLeft, Target, Trash2 } from 'lucide-react';
import { TransactionModal } from '../transaction-modal';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners
} from '@dnd-kit/core';
import { useAppStore } from '@/store/use-app-store';
import { toast } from 'sonner';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeData, setActiveData] = useState<any>(null);

  const {
    addToLibrary,
    addToDashboard,
    setTransactionModalOpen,
    openNewTransaction,
    setActiveDrag,
    dashboardWidgets,
    reorderWidgets,
    moveIntoFolder,
    libraryFolders,
    rightPanelOpen,
    toggleRightPanel,
    sidebarOrder,
    reorderSidebar,
    templatesOrder,
    reorderTemplates,
    moveToTrash,
    reorderLibraryTemplates,
    reorderFolderItems,
    reorderDeletedItems,
    libraryTemplates,
    deletedItems,
  } = useAppStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const id = active.id as string;
    const type = active.data.current?.type as any;

    setActiveId(id);
    setActiveData(active.data.current);
    setActiveDrag(id, type);

    setActiveDrag(id, type);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;

    setActiveId(null);
    setActiveData(null);
    setActiveDrag(null, null);

    if (!over) {
      return;
    }

    // SCENARIO 4: KÜTÜPHANE ÖĞESİ -> KLASÖR veya Klasörden Dışarı
    if (active.data.current?.type === 'library-item') {
      if (over.data.current?.type === 'folder') {
        const folderId = over.data.current.folderId;
        const folder = libraryFolders.find(f => f.id === folderId);
        moveIntoFolder(active.data.current.template.id, folderId);
        toast.success(`Şablon "${folder?.name || 'Klasör'}" içine taşındı`);
        return;
      } else if (over.id === 'library-drop-zone') {
        moveIntoFolder(active.data.current.template.id, null);
        toast.success('Şablon klasörden çıkarıldı');
        return;
      }
    }

    // SCENARIO 5: SIDEBAR REORDER
    if (active.data.current?.type === 'sidebar-item' && over.data.current?.type === 'sidebar-item' && active.id !== over.id) {
      const activeViewId = active.data.current.viewId;
      const overViewId = over.data.current.viewId;

      const oldIndex = sidebarOrder.indexOf(activeViewId);
      const newIndex = sidebarOrder.indexOf(overViewId);

      const newOrder = [...sidebarOrder];
      const [removed] = newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, removed);

      reorderSidebar(newOrder);
      return;
    }

    // SCENARIO 6: TEMPLATE REORDER
    if (active.data.current?.type === 'template' && over.data.current?.type === 'template' && active.id !== over.id) {
      const activeId = active.id as string;
      const overId = over.id as string;

      const oldIndex = templatesOrder.indexOf(activeId);
      const newIndex = templatesOrder.indexOf(overId);

      const newOrder = [...templatesOrder];
      const [removed] = newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, removed);

      reorderTemplates(newOrder);
      return;
    }

    // SCENARIO 3: DASHBOARD İÇİ REORDER
    if (active.data.current?.type === 'widget' && over.data.current?.type === 'widget' && active.id !== over.id) {
      const oldIndex = dashboardWidgets.findIndex((w) => w.id === active.id);
      const newIndex = dashboardWidgets.findIndex((w) => w.id === over.id);

      const newWidgets = [...dashboardWidgets];
      const [removed] = newWidgets.splice(oldIndex, 1);
      newWidgets.splice(newIndex, 0, removed);

      reorderWidgets(newWidgets);
      return;
    }

    // SCENARIO 9: KÜTÜPHANE ÖĞESİ REORDER
    if (active.data.current?.type === 'library-item' && over.data.current?.type === 'library-item' && active.id !== over.id) {
      const activeTemplateId = active.data.current.template.id;
      const overTemplateId = over.data.current.template.id;

      // Check if reordering within a folder
      const folder = libraryFolders.find(f => f.itemIds.includes(activeTemplateId));
      const overFolder = libraryFolders.find(f => f.itemIds.includes(overTemplateId));

      if (folder && overFolder && folder.id === overFolder.id) {
        // Within the same folder
        const oldIndex = folder.itemIds.indexOf(activeTemplateId);
        const newIndex = folder.itemIds.indexOf(overTemplateId);

        const newItemIds = [...folder.itemIds];
        const [removed] = newItemIds.splice(oldIndex, 1);
        newItemIds.splice(newIndex, 0, removed);

        reorderFolderItems(folder.id, newItemIds);
      } else if (!folder && !overFolder) {
        // Both items are uncategorized
        const oldIndex = libraryTemplates.findIndex(t => t.id === activeTemplateId);
        const newIndex = libraryTemplates.findIndex(t => t.id === overTemplateId);

        const newTemplates = [...libraryTemplates];
        const [removed] = newTemplates.splice(oldIndex, 1);
        newTemplates.splice(newIndex, 0, removed);

        reorderLibraryTemplates(newTemplates);
      }
      return;
    }

    // SCENARIO 10: TRASH ITEM REORDER
    if (active.data.current?.type === 'trash-item' && over.data.current?.type === 'trash-item' && active.id !== over.id) {
      const activeId = active.data.current.item.id;
      const overId = over.data.current.item.id;

      const oldIndex = deletedItems.findIndex(i => i.id === activeId);
      const newIndex = deletedItems.findIndex(i => i.id === overId);

      const newDeletedItems = [...deletedItems];
      const [removed] = newDeletedItems.splice(oldIndex, 1);
      newDeletedItems.splice(newIndex, 0, removed);

      reorderDeletedItems(newDeletedItems);
      return;
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCorners}
    >
      <div className="min-h-screen bg-white text-slate-900 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 min-h-screen flex flex-col relative overflow-y-auto bg-slate-50/30">
          {children}

          {/* Panel Re-open Button (when closed) */}
          {!rightPanelOpen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleRightPanel()}
              className="fixed top-6 right-6 h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all z-40 hidden xl:flex"
              title="Paneli Göster"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </main>

        {rightPanelOpen && <RightPanel />}
      </div>

      {/* Floating Action Button (FAB) for Mobile & Quick Entry */}
      <Button
        onClick={() => openNewTransaction()}
        aria-label="Yeni işlem ekle"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-slate-900 text-white shadow-xl shadow-slate-900/20 hover:scale-110 active:scale-95 transition-all duration-300 z-50 group xl:hidden flex items-center justify-center p-0"
      >
        <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
      </Button>

      <TransactionModal />

      <DragOverlay dropAnimation={{
        sideEffects: defaultDropAnimationSideEffects({
          styles: {
            active: {
              opacity: '0.4',
            },
          },
        }),
      }}>
        {activeId ? (
          <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-4 shadow-xl flex items-center gap-3 scale-[0.5] opacity-90 cursor-grabbing animate-in zoom-in-95 duration-200 z-[100] ring-1 ring-slate-900/10">
            {(() => {
              const data = activeData;
              let title = '';
              let Icon: any = null;

              if (data?.template) {
                title = data.template.title;
                Icon = data.template.icon;
              } else if (data?.goal) {
                title = data.goal.name;
                Icon = Target; // Import Target if not available or pass it
              } else if (data?.item) { // Trash item
                const innerData = data.item.data;
                title = innerData.title || innerData.name || 'Öğe';
                Icon = innerData.icon || Trash2;
              }

              return (
                <>
                  <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center shadow-sm">
                    {Icon ? <Icon className="h-5 w-5 text-white" /> : <div className="w-5 h-5 bg-white/20 rounded-sm" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 tracking-tight whitespace-nowrap">{title}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-0.5">Taşınıyor...</p>
                  </div>
                </>
              );
            })()}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
