import { create } from 'zustand';

export type View = 'overview' | 'templates' | 'library' | 'favorites' | 'goals' | 'settings' | 'trash';

export type TemplateType =
  | 'budget'
  | 'emergency'
  | 'holiday'
  | 'expense_tracker'
  | 'portfolio'
  | 'debt'
  | 'guide'
  | 'basics'
  | 'retirement'
  | 'tax'
  | 'debt_strategy';

export interface Template {
  id: string;
  title: string;
  description: string;
  icon?: any;
  type: TemplateType;
  config?: {
    amount?: number;
    transactionType?: 'income' | 'expense';
    targetAmount?: number;
    currentAmount?: number;
    targetDate?: string;
    interestRate?: number;
    monthlyIncome?: number;
    monthlySavings?: number;
    age?: number;
    targetAge?: number;
    features?: string[]; // e.g., ['charts', 'balance', 'categories']
    // Rich Data Arrays
    budgetItems?: { id: string; name: string; amount: number; type: 'income' | 'expense' }[];
    assets?: { id: string; name: string; value: number; type: string; color?: string }[];
    debts?: { id: string; name: string; amount: number; interestRate: number; minPayment: number }[];
    transactions?: { id: string; date: string; amount: number; description: string }[];
    steps?: { id: string; title: string; completed: boolean; description?: string }[];
  };
  customFields?: { id: string; label: string; value: string }[];
  originalId?: string; // Reference to source template
}

export interface DashboardWidget {
  id: string;
  templateId: string;
  title: string;
  type: TemplateType;
  position: number;
  config?: Template['config'];
  customFields?: Template['customFields'];
}

// Helper function for templates list - FULL LIST for selection
export const templatesList: Template[] = [
  { id: '1', title: 'Aylık Bütçe', description: 'Aylık gelir ve giderlerinizi planlayın', icon: null, type: 'budget' },
  { id: '2', title: 'Acil Durum Fonu', description: 'Beklenmedik durumlar için tasarruf oluşturun', icon: null, type: 'emergency' },
  { id: '3', title: 'Tatil Tasarrufu', description: 'Hayalinizdeki tatil için birikim yapın', icon: null, type: 'holiday' },
  { id: '4', title: 'Harcama Takipçisi', description: 'Günlük harcamalarınızı izleyin', icon: null, type: 'expense_tracker' },
  { id: '5', title: 'Yatırım Portföyü', description: 'Yatırımlarınızı takip edin', icon: null, type: 'portfolio' },
  { id: '6', title: 'Borç Ödeme', description: 'Borçlarınızı yönetin ve ödeyin', icon: null, type: 'debt' },
  { id: '7', title: 'Bütçeleme Kılavuzu', description: 'Bütçeleme ipuçları ve rehberi', icon: null, type: 'guide' },
  { id: '8', title: 'Yatırım Temelleri', description: 'Yatırım hakkında temel bilgiler', icon: null, type: 'basics' },
  { id: '9', title: 'Emeklilik Hesaplayıcısı', description: 'Emeklilik hedeflerinizi planlayın', icon: null, type: 'retirement' },
  { id: '10', title: 'Vergi Planlama', description: 'Vergi optimizasyonu için planlama', icon: null, type: 'tax' },
  { id: '11', title: 'Borç Ödeme Şablonu', description: 'Borç ödeme planı oluşturun', icon: null, type: 'debt_strategy' },
];

export interface LibraryFolder {
  id: string;
  name: string;
  itemIds: string[];
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  startDate: string;
  targetDate: string;
}

export interface DeletedItem {
  id: string;
  type: 'template' | 'widget' | 'goal' | 'folder' | 'sidebar-item';
  data: any;
  deletedAt: Date;
  expiresAt: Date;
}

interface AppState {
  currentView: View;
  sidebarCollapsed: boolean;
  libraryTemplates: Template[];
  templates: Template[];
  libraryFolders: LibraryFolder[];
  dashboardWidgets: DashboardWidget[];
  goals: Goal[];
  favorites: string[];
  selectedTemplates: Set<string>;
  selectedLibraryTemplates: Set<string>;
  selectedTrashItems: Set<string>;
  deletedItems: DeletedItem[];
  transactionModalOpen: boolean;
  activeModalTemplate: Template | null;
  activeModalStep: number;
  activeModalType: 'transaction' | 'template' | 'custom';
  activeDragId: string | null;
  activeDragType: 'template' | 'library-item' | 'widget' | 'folder' | 'sidebar-item' | 'goal' | null;
  rightPanelOpen: boolean;
  customFieldPool: { id: string; label: string }[];
  sidebarOrder: View[];
  addTemplate: (template: Template) => void;
  templatesOrder: string[]; // Store order of templates
  goalsOrder: string[]; // Store order of goals
  setCurrentView: (view: View) => void;
  toggleSidebar: () => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, goal: Partial<Goal>) => void;
  reorderGoals: (order: string[]) => void;
  toggleRightPanel: () => void;
  setTransactionModalOpen: (open: boolean) => void;
  addToLibrary: (template: Template) => void;
  removeFromLibrary: (templateId: string) => void;
  toggleFavorite: (templateId: string) => void;
  removeFromFavorites: (templateId: string) => void;
  addToDashboard: (template: Template) => void;
  removeFromDashboard: (widgetId: string) => void;
  reorderWidgets: (widgets: DashboardWidget[]) => void;
  setSelectedTemplate: (templateId: string, selected: boolean) => void;
  selectAllTemplates: (selected: boolean) => void;
  setSelectedLibraryTemplate: (templateId: string, selected: boolean) => void;
  selectAllLibraryTemplates: (selected: boolean) => void;
  setSelectedTrashItem: (id: string, selected: boolean) => void;
  selectAllTrashItems: (selected: boolean) => void;
  moveToTrash: (item: any, type: 'template' | 'widget' | 'folder' | 'sidebar-item' | 'goal') => void;
  restoreFromTrash: (id: string, target?: 'templates' | 'library') => void;
  restoreSelectedFromTrash: (target: 'templates' | 'library') => void;
  permanentDelete: (id: string) => void;
  permanentDeleteSelected: () => void;
  emptyTrash: () => void;
  reorderDeletedItems: (items: DeletedItem[]) => void;
  reorderLibraryTemplates: (templates: Template[]) => void;
  reorderFolderItems: (folderId: string, itemIds: string[]) => void;
  setActiveDrag: (id: string | null, type: 'template' | 'library-item' | 'widget' | 'folder' | null) => void;
  createFolder: (name: string) => void;
  renameFolder: (id: string, name: string) => void;
  deleteFolder: (id: string) => void;
  moveIntoFolder: (itemId: string, folderId: string | null) => void;
  addCustomFieldToPool: (label: string) => void;
  updateDashboardWidget: (id: string, updates: Partial<DashboardWidget>) => void;
  updateTemplate: (id: string, updates: Partial<Template>) => void;
  reorderSidebar: (order: View[]) => void;
  reorderTemplates: (order: string[]) => void;
  openTemplateCreation: (template: Template) => void;
  openNewTransaction: () => void;
  restoreAllFromTrash: () => void;
  moveItemsToTemplates: (itemIds: string[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentView: 'overview',
  sidebarCollapsed: false,
  libraryTemplates: [],
  templates: [],
  libraryFolders: [],
  dashboardWidgets: [],
  goals: [],
  goalsOrder: [],
  favorites: [],
  selectedTemplates: new Set(),
  selectedLibraryTemplates: new Set(),
  selectedTrashItems: new Set(),
  deletedItems: [],
  transactionModalOpen: false,
  activeModalTemplate: null,
  activeModalStep: 1,
  activeModalType: 'transaction',
  activeDragId: null,
  activeDragType: null,
  rightPanelOpen: true,
  customFieldPool: [
    { id: '1', label: 'Hedef Tutar' },
    { id: '2', label: 'Bitiş Tarihi' },
    { id: '3', label: 'Kategori' },
    { id: '4', label: 'Önem Derecesi' },
  ],
  sidebarOrder: ['overview', 'templates', 'library', 'goals', 'favorites', 'trash', 'settings'],
  templatesOrder: [],
  addTemplate: (template) =>
    set((state) => ({
      templates: [template, ...state.templates],
      templatesOrder: [template.id, ...state.templatesOrder],
    })),

  updateTemplate: (id, updates) =>
    set((state) => ({
      templates: state.templates.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),

  setActiveDrag: (id, type) =>
    set({ activeDragId: id, activeDragType: type }),

  setCurrentView: (view) => set({ currentView: view }),

  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  toggleRightPanel: () => set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),

  setTransactionModalOpen: (open) => set({ transactionModalOpen: open }),

  openTemplateCreation: (template) => set({
    transactionModalOpen: true,
    activeModalTemplate: template,
    activeModalStep: 3,
    activeModalType: 'template'
  }),

  openNewTransaction: () => set({
    transactionModalOpen: true,
    activeModalTemplate: null,
    activeModalStep: 1,
    activeModalType: 'transaction'
  }),

  addToLibrary: (template) =>
    set((state) => {
      // Create a unique instance of the template for the library
      const libraryItem = {
        ...template,
        id: `lib-${template.id}-${Date.now()}`,
        originalId: template.id // Keep track of source if needed
      };
      return {
        libraryTemplates: [...state.libraryTemplates, libraryItem],
      };
    }),

  removeFromLibrary: (templateId) =>
    set((state) => ({
      libraryTemplates: state.libraryTemplates.filter((t) => t.id !== templateId),
      favorites: state.favorites.filter((id) => id !== templateId),
      selectedLibraryTemplates: new Set(Array.from(state.selectedLibraryTemplates).filter((id) => id !== templateId)),
    })),

  toggleFavorite: (templateId) =>
    set((state) => {
      const isFavorite = state.favorites.includes(templateId);
      const newFavorites = isFavorite
        ? state.favorites.filter((id) => id !== templateId)
        : [...state.favorites, templateId];

      return {
        favorites: newFavorites
      };
    }),

  removeFromFavorites: (templateId) =>
    set((state) => ({
      favorites: state.favorites.filter((id) => id !== templateId),
    })),

  addToDashboard: (template) =>
    set((state) => ({
      dashboardWidgets: [
        ...state.dashboardWidgets,
        {
          id: `${template.id}-${Date.now()}`,
          templateId: template.id,
          title: template.title,
          type: template.type,
          position: state.dashboardWidgets.length,
          config: template.config,
          customFields: template.customFields,
        },
      ],
    })),

  removeFromDashboard: (widgetId) =>
    set((state) => ({
      dashboardWidgets: state.dashboardWidgets.filter((w) => w.id !== widgetId),
    })),

  reorderWidgets: (widgets) => set({ dashboardWidgets: widgets }),

  setSelectedTemplate: (templateId, selected) =>
    set((state) => {
      const newSelected = new Set(state.selectedTemplates);
      if (selected) {
        newSelected.add(templateId);
      } else {
        newSelected.delete(templateId);
      }
      return { selectedTemplates: newSelected };
    }),

  selectAllTemplates: (selected) =>
    set((state) => ({
      selectedTemplates: selected ? new Set(templatesList.map((t) => t.id)) : new Set(),
    })),

  setSelectedLibraryTemplate: (templateId, selected) =>
    set((state) => {
      const newSelected = new Set(state.selectedLibraryTemplates);
      if (selected) {
        newSelected.add(templateId);
      } else {
        newSelected.delete(templateId);
      }
      return { selectedLibraryTemplates: newSelected };
    }),

  selectAllLibraryTemplates: (selected) =>
    set((state) => ({
      selectedLibraryTemplates: selected ? new Set(state.libraryTemplates.map((t) => t.id)) : new Set(),
    })),

  setSelectedTrashItem: (id, selected) =>
    set((state) => {
      const newSelected = new Set(state.selectedTrashItems);
      if (selected) {
        newSelected.add(id);
      } else {
        newSelected.delete(id);
      }
      return { selectedTrashItems: newSelected };
    }),

  selectAllTrashItems: (selected) =>
    set((state) => ({
      selectedTrashItems: selected ? new Set(state.deletedItems.map(i => i.id)) : new Set(),
    })),

  moveToTrash: (item, type) =>
    set((state) => {
      const now = new Date();
      const expires = new Date();
      expires.setDate(now.getDate() + 30);

      const deletedItem: DeletedItem = {
        id: item.id || `${Date.now()}`,
        type,
        data: item,
        deletedAt: now,
        expiresAt: expires,
      };

      // Remove from active state based on type
      let newState: Partial<AppState> = {
        deletedItems: [...state.deletedItems, deletedItem]
      };

      if (type === 'template') {
        newState.libraryTemplates = state.libraryTemplates.filter(t => t.id !== item.id);
        newState.favorites = state.favorites.filter(id => id !== item.id);
      } else if (type === 'widget') {
        newState.dashboardWidgets = state.dashboardWidgets.filter(w => w.id !== item.id);
      } else if (type === 'goal') {
        newState.goals = state.goals.filter(g => g.id !== item.id);
      }

      return newState;
    }),

  restoreFromTrash: (id, target) =>
    set((state) => {
      const itemToRestore = state.deletedItems.find(i => i.id === id);
      if (!itemToRestore) return state;

      let newState: Partial<AppState> = {
        deletedItems: state.deletedItems.filter(i => i.id !== id),
        selectedTrashItems: new Set(Array.from(state.selectedTrashItems).filter(sid => sid !== id))
      };

      if (itemToRestore.type === 'template') {
        // If target specified, force it. Otherwise check data properties if needed, but default to templatesList source.
        if (target === 'library') {
          newState.libraryTemplates = [...state.libraryTemplates, itemToRestore.data];
        } else {
          newState.templates = [...state.templates, itemToRestore.data];
          if (!state.templatesOrder.includes(itemToRestore.data.id)) {
            newState.templatesOrder = [...state.templatesOrder, itemToRestore.data.id];
          }
        }
      } else if (itemToRestore.type === 'widget') {
        newState.dashboardWidgets = [...state.dashboardWidgets, itemToRestore.data];
      } else if (itemToRestore.type === 'goal') {
        newState.goals = [...state.goals, itemToRestore.data];
        if (!state.goalsOrder.includes(itemToRestore.data.id)) {
          newState.goalsOrder = [...state.goalsOrder, itemToRestore.data.id];
        }
      }

      return newState;
    }),

  restoreSelectedFromTrash: (target) =>
    set((state) => {
      const selectedIds = Array.from(state.selectedTrashItems);
      const itemsToRestore = state.deletedItems.filter(i => selectedIds.includes(i.id));

      let newState: Partial<AppState> = {
        deletedItems: state.deletedItems.filter(i => !selectedIds.includes(i.id)),
        selectedTrashItems: new Set()
      };

      // Force copies
      newState.libraryTemplates = [...state.libraryTemplates];
      newState.templates = [...state.templates];
      newState.dashboardWidgets = [...state.dashboardWidgets];
      newState.goals = [...state.goals];
      newState.templatesOrder = [...state.templatesOrder];
      newState.goalsOrder = [...state.goalsOrder];

      itemsToRestore.forEach(item => {
        if (item.type === 'template') {
          if (target === 'library') {
            newState.libraryTemplates!.push(item.data);
          } else {
            newState.templates!.push(item.data);
            if (!newState.templatesOrder!.includes(item.data.id)) {
              newState.templatesOrder!.push(item.data.id);
            }
          }
        } else if (item.type === 'widget') {
          newState.dashboardWidgets!.push(item.data);
        } else if (item.type === 'goal') {
          newState.goals!.push(item.data);
          if (!newState.goalsOrder!.includes(item.data.id)) {
            newState.goalsOrder!.push(item.data.id);
          }
        }
      });

      return newState;
    }),

  permanentDelete: (id) =>
    set((state) => ({
      deletedItems: state.deletedItems.filter(i => i.id !== id),
      selectedTrashItems: new Set(Array.from(state.selectedTrashItems).filter(sid => sid !== id))
    })),

  permanentDeleteSelected: () =>
    set((state) => {
      const selectedIds = Array.from(state.selectedTrashItems);
      return {
        deletedItems: state.deletedItems.filter(i => !selectedIds.includes(i.id)),
        selectedTrashItems: new Set()
      };
    }),

  emptyTrash: () => set({ deletedItems: [] }),

  reorderDeletedItems: (items) => set({ deletedItems: items }),

  restoreAllFromTrash: () =>
    set((state) => {
      const restoredTemplates = state.deletedItems
        .filter(i => i.type === 'template')
        .map(i => i.data);

      const restoredWidgets = state.deletedItems
        .filter(i => i.type === 'widget')
        .map(i => i.data);

      return {
        libraryTemplates: [...state.libraryTemplates, ...restoredTemplates],
        dashboardWidgets: [...state.dashboardWidgets, ...restoredWidgets],
        deletedItems: []
      };
    }),

  reorderLibraryTemplates: (templates) => set({ libraryTemplates: templates }),

  reorderFolderItems: (folderId, itemIds) => set((state) => ({
    libraryFolders: state.libraryFolders.map(f =>
      f.id === folderId ? { ...f, itemIds } : f
    )
  })),

  createFolder: (name) => set((state) => ({
    libraryFolders: [...state.libraryFolders, { id: `folder-${Date.now()}`, name, itemIds: [] }]
  })),

  renameFolder: (id, name) => set((state) => ({
    libraryFolders: state.libraryFolders.map(f => f.id === id ? { ...f, name } : f)
  })),

  deleteFolder: (id) => set((state) => ({
    libraryFolders: state.libraryFolders.filter(f => f.id !== id)
  })),

  moveIntoFolder: (itemId, folderId) => set((state) => {
    // Remove from all folders first
    const cleanFolders = state.libraryFolders.map(f => ({
      ...f,
      itemIds: f.itemIds.filter(id => id !== itemId)
    }));

    if (!folderId) return { libraryFolders: cleanFolders };

    return {
      libraryFolders: cleanFolders.map(f =>
        f.id === folderId ? { ...f, itemIds: [...f.itemIds, itemId] } : f
      )
    };
  }),

  addCustomFieldToPool: (label) => set((state) => {
    if (state.customFieldPool.some(f => f.label === label)) return state;
    return {
      customFieldPool: [...state.customFieldPool, { id: `pool-${Date.now()}`, label }]
    };
  }),
  updateDashboardWidget: (id, updates) => set((state) => ({
    dashboardWidgets: state.dashboardWidgets.map(w => w.id === id ? { ...w, ...updates, config: { ...w.config, ...updates.config } } : w)
  })),
  reorderSidebar: (order) => set({ sidebarOrder: order }),
  reorderTemplates: (order) => set({ templatesOrder: order }),

  addGoal: (goal) => set((state) => ({
    goals: [...state.goals, goal],
    goalsOrder: [...state.goalsOrder, goal.id]
  })),

  updateGoal: (id, updates) => set((state) => ({
    goals: state.goals.map(g => g.id === id ? { ...g, ...updates } : g)
  })),

  reorderGoals: (order) => set({ goalsOrder: order }),
  moveItemsToTemplates: (itemIds) => set((state) => {
    const itemsToMove = state.libraryTemplates.filter(t => itemIds.includes(t.id));
    const newTemplates = [...state.templates];
    const newTemplatesOrder = [...state.templatesOrder];

    itemsToMove.forEach(item => {
      if (!newTemplates.some(t => t.id === item.id)) {
        newTemplates.push(item);
        newTemplatesOrder.push(item.id);
      }
    });

    return {
      libraryTemplates: state.libraryTemplates.filter(t => !itemIds.includes(t.id)),
      templates: newTemplates,
      templatesOrder: newTemplatesOrder,
      selectedLibraryTemplates: new Set()
    };
  }),
}));

// Helper function to get visible (non-trashed) library templates - No longer needed as libraryTemplates is filtered on delete
export function getVisibleLibraryTemplates(libraryTemplates: Template[]): Template[] {
  return libraryTemplates;
}
