'use client';

import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  LayoutTemplate,
  Library,
  Target,
  Settings,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  GripVertical,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAppStore, View } from '@/store/use-app-store';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

const menuItemsData: Partial<Record<View, { label: string; icon: any }>> = {
  overview: { label: 'Genel Bakış', icon: LayoutDashboard },
  templates: { label: 'Şablonlar', icon: LayoutTemplate },
  library: { label: 'Kütüphane', icon: Library },
  goals: { label: 'Hedefler', icon: Target },
  favorites: { label: 'Favoriler', icon: Star },
  trash: { label: 'Çöp Sepeti', icon: Trash2 },
  settings: { label: 'Ayarlar', icon: Settings },
};

function NavItem({
  id,
  isActive,
  collapsed,
  isMobileMode,
  handleMenuClick,
  deletedItems
}: {
  id: View,
  isActive: boolean,
  collapsed: boolean,
  isMobileMode: boolean,
  handleMenuClick: (id: View) => void,
  deletedItems: any[]
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver
  } = useSortable({
    id: `sidebar-${id}`,
    data: {
      type: 'sidebar-item',
      viewId: id
    }
  });

  const { activeDragType } = useAppStore();
  const item = menuItemsData[id];
  if (!item) return null;

  // Drag-and-drop logic removed for sidebar targets
  const isValidDrop = false;

  const Icon = item.icon;
  const isTrash = id === 'trash';
  const trashCount = isTrash ? deletedItems.length : 0;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "relative group mb-1",
        isDragging && "opacity-50 z-50 scale-95 transition-all duration-200"
      )}
    >
      <Button
        variant="ghost"
        onClick={() => handleMenuClick(id)}
        className={cn(
          "w-full flex items-center transition-all duration-200 relative group/btn",
          collapsed && !isMobileMode ? "justify-center px-0" : "justify-start px-3 gap-3",
          isActive
            ? "bg-slate-50 text-slate-900 font-medium"
            : "text-slate-500 hover:text-slate-900 hover:bg-slate-50",
          !isDragging && "cursor-grab active:cursor-grabbing"
        )}
      >
        {isActive && !isOver && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-slate-900 rounded-r-full" />
        )}

        <Icon className={cn(
          "h-5 w-5 shrink-0 transition-transform duration-200",
          isActive ? "text-slate-900" : "group-hover:scale-110"
        )} />

        {(!collapsed || isMobileMode) && (
          <div className="flex-1 flex items-center justify-between min-w-0">
            <span className="text-sm tracking-tight whitespace-nowrap truncate pl-1">
              {item.label}
            </span>
            {isTrash && trashCount > 0 && (
              <Badge variant="secondary" className="ml-auto bg-slate-100 text-slate-600 border-none px-1.5 h-5 min-w-[20px] justify-center text-[10px] font-bold">
                {trashCount}
              </Badge>
            )}
          </div>
        )}

        {collapsed && !isMobileMode && !isOver && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[100]">
            {item.label}
            {isTrash && trashCount > 0 && ` (${trashCount})`}
          </div>
        )}
      </Button>
    </div>
  );
}

export function Sidebar() {
  const { currentView, setCurrentView, sidebarCollapsed, toggleSidebar, deletedItems, sidebarOrder } = useAppStore();
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isMobile) setMobileOpen(false);
  }, [isMobile]);

  const handleMenuClick = (viewId: View) => {
    setCurrentView(viewId);
    if (isMobile) setMobileOpen(false);
  };
  const SidebarContent = ({ collapsed = false, isMobileMode = false }: { collapsed?: boolean, isMobileMode?: boolean }) => (
    <div className={cn(
      "h-full flex flex-col bg-white",
      !isMobileMode && "border-r border-slate-200"
    )}>
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-xs">F</span>
          </div>
          {(!collapsed || isMobileMode) && (
            <span className="font-semibold text-slate-800 tracking-tight whitespace-nowrap">
              Finlowly
            </span>
          )}
        </div>
        {!isMobileMode && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            aria-label={collapsed ? "Menüyü Genişlet" : "Menüyü Daralt"}
            className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto overflow-x-hidden">
        <SortableContext items={sidebarOrder.map(id => `sidebar-${id}`)} strategy={verticalListSortingStrategy}>
          {sidebarOrder.map((viewId) => (
            <NavItem
              key={viewId}
              id={viewId}
              isActive={currentView === viewId}
              collapsed={collapsed}
              isMobileMode={isMobileMode}
              handleMenuClick={handleMenuClick}
              deletedItems={deletedItems}
            />
          ))}
        </SortableContext>
      </nav>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50 lg:hidden hover:bg-slate-100 transition-colors"
            aria-label="Menüyü Aç"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64 border-none">
          <SidebarContent isMobileMode={true} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside
      className={cn(
        "h-screen flex flex-col transition-all duration-300 ease-in-out z-50 shrink-0",
        sidebarCollapsed ? "w-20" : "w-64"
      )}
    >
      <SidebarContent collapsed={sidebarCollapsed} />
    </aside>
  );
}
