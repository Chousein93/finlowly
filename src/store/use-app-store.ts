import { create } from 'zustand';

// Güvenli ID üretici fonksiyonu
function generateId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  const unique = crypto.randomUUID?.() || `${timestamp}-${random}`;
  return prefix ? `${prefix}-${unique}` : unique;
}

// Hata yönetimi ve debug fonksiyonları
function logError(error: Error, context: string) {
  console.error(`[Finlowly Error - ${context}]:`, error);
  // Burada hata raporlama servisine gönderilebilir
}

function logDebug(message: string, data?: any) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Finlowly Debug]: ${message}`, data);
  }
}

export type View = 'overview' | 'templates' | 'library' | 'favorites' | 'goals' | 'settings' | 'trash' | 'template-detail';

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
    customCategories?: { value: string; label: string; color: string; fill?: string }[];
    // New Fields for Enhanced Persistence
    categoryId?: string;
    color?: string;
    notes?: string;
    date?: string; // Main transaction date
    recurring?: {
      enabled: boolean;
      frequency: string;
      interval: number;
      period: string;
      termination: { type: string; date?: string };
    };
    installment?: {
      enabled: boolean;
      count: number;
      period: string;
    };
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
  isHidden?: boolean; // If true, only visible in template detail view, not on dashboard
}

// Geçici veri tipleri
export interface BudgetItem {
  id: string;
  name: string;
  amount: number;
  type: 'income' | 'expense';
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

export interface CustomCategory {
  id: string;
  label: string;
  type: 'income' | 'expense' | 'both';
  color?: string;
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
  customCategories: CustomCategory[];
  sidebarOrder: View[];
  activeDetailTemplate: Template | null;
  activeDetailWidget: DashboardWidget | null;
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
  addCustomCategory: (category: Omit<CustomCategory, 'id'>) => void;
  removeCustomCategory: (id: string) => void;
  updateDashboardWidget: (id: string, updates: Partial<DashboardWidget>) => void;
  updateTemplate: (id: string, updates: Partial<Template>) => void;
  reorderSidebar: (order: View[]) => void;
  reorderTemplates: (order: string[]) => void;
  openTemplateCreation: (template: Template) => void;
  openNewTransaction: () => void;
  restoreAllFromTrash: () => void;
  moveItemsToTemplates: (itemIds: string[]) => void;
  openTemplateDetail: (template: Template) => void;

  // Geçici veriler
  tempBudgetItems: { [widgetId: string]: BudgetItem[] };
  saveTempBudgetItems: (widgetId: string, items: BudgetItem[]) => void;
  cancelTempBudgetItems: (widgetId: string) => void;
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
  customCategories: [],
  sidebarOrder: ['overview', 'templates', 'library', 'goals', 'favorites', 'trash', 'settings'],
  activeDetailTemplate: null,
  activeDetailWidget: null,
  templatesOrder: [],
  tempBudgetItems: {},
  addTemplate: (template) => {
    try {
      logDebug('Adding template', template);
      set((state) => ({
        templates: [template, ...state.templates],
        templatesOrder: [template.id, ...state.templatesOrder],
      }));
    } catch (error) {
      logError(error as Error, 'addTemplate');
    }
  },

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

  openTemplateDetail: (template) =>
    set((state) => {
      // Find or create the dashboard widget for this template
      let widget = state.dashboardWidgets.find(w => w.templateId === template.id);

      if (!widget) {
        // Auto-create a dashboard widget for this template
        widget = {
          id: `${template.id}-${Date.now()}`,
          templateId: template.id,
          title: template.title,
          type: template.type,
          position: state.dashboardWidgets.length,
          config: template.config,
          customFields: template.customFields,
          isHidden: true, // Don't show on main dashboard by default
        };
        return {
          currentView: 'template-detail' as View,
          activeDetailTemplate: template,
          activeDetailWidget: widget,
          dashboardWidgets: [...state.dashboardWidgets, widget],
        };
      }

      return {
        currentView: 'template-detail' as View,
        activeDetailTemplate: template,
        activeDetailWidget: widget,
      };
    }),

  openNewTransaction: () => set({
    transactionModalOpen: true,
    activeModalTemplate: null,
    activeModalStep: 3,
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
    set((state) => {
      const item = state.deletedItems.find(i => i.id === id);
      const newState: Partial<AppState> = {
        deletedItems: state.deletedItems.filter(i => i.id !== id),
        selectedTrashItems: new Set(Array.from(state.selectedTrashItems).filter(sid => sid !== id))
      };

      // Also remove related templates and widgets to prevent ghost cards
      if (item?.type === 'template') {
        const templateId = item.data?.id || id;
        newState.templates = state.templates.filter(t => t.id !== templateId);
        newState.templatesOrder = state.templatesOrder.filter(tid => tid !== templateId);
        newState.dashboardWidgets = state.dashboardWidgets.filter(w => w.templateId !== templateId);
        newState.libraryTemplates = state.libraryTemplates.filter(t => t.id !== templateId && t.originalId !== templateId);
        newState.favorites = state.favorites.filter(fid => fid !== templateId);
      } else if (item?.type === 'widget') {
        const widgetId = item.data?.id || id;
        newState.dashboardWidgets = state.dashboardWidgets.filter(w => w.id !== widgetId);
      } else if (item?.type === 'goal') {
        const goalId = item.data?.id || id;
        newState.goals = state.goals.filter(g => g.id !== goalId);
        newState.goalsOrder = state.goalsOrder.filter(gid => gid !== goalId);
      }

      return newState;
    }),

  permanentDeleteSelected: () =>
    set((state) => {
      const selectedIds = Array.from(state.selectedTrashItems);
      const itemsToDelete = state.deletedItems.filter(i => selectedIds.includes(i.id));

      let newTemplates = [...state.templates];
      let newTemplatesOrder = [...state.templatesOrder];
      let newWidgets = [...state.dashboardWidgets];
      let newLibrary = [...state.libraryTemplates];
      let newFavorites = [...state.favorites];
      let newGoals = [...state.goals];
      let newGoalsOrder = [...state.goalsOrder];

      itemsToDelete.forEach(item => {
        if (item.type === 'template') {
          const templateId = item.data?.id || item.id;
          newTemplates = newTemplates.filter(t => t.id !== templateId);
          newTemplatesOrder = newTemplatesOrder.filter(tid => tid !== templateId);
          newWidgets = newWidgets.filter(w => w.templateId !== templateId);
          newLibrary = newLibrary.filter(t => t.id !== templateId && t.originalId !== templateId);
          newFavorites = newFavorites.filter(fid => fid !== templateId);
        } else if (item.type === 'widget') {
          const widgetId = item.data?.id || item.id;
          newWidgets = newWidgets.filter(w => w.id !== widgetId);
        } else if (item.type === 'goal') {
          const goalId = item.data?.id || item.id;
          newGoals = newGoals.filter(g => g.id !== goalId);
          newGoalsOrder = newGoalsOrder.filter(gid => gid !== goalId);
        }
      });

      return {
        deletedItems: state.deletedItems.filter(i => !selectedIds.includes(i.id)),
        selectedTrashItems: new Set(),
        templates: newTemplates,
        templatesOrder: newTemplatesOrder,
        dashboardWidgets: newWidgets,
        libraryTemplates: newLibrary,
        favorites: newFavorites,
        goals: newGoals,
        goalsOrder: newGoalsOrder,
      };
    }),

  emptyTrash: () =>
    set((state) => {
      // Collect all template/widget/goal IDs being permanently deleted
      let newTemplates = [...state.templates];
      let newTemplatesOrder = [...state.templatesOrder];
      let newWidgets = [...state.dashboardWidgets];
      let newLibrary = [...state.libraryTemplates];
      let newFavorites = [...state.favorites];
      let newGoals = [...state.goals];
      let newGoalsOrder = [...state.goalsOrder];

      state.deletedItems.forEach(item => {
        if (item.type === 'template') {
          const templateId = item.data?.id || item.id;
          newTemplates = newTemplates.filter(t => t.id !== templateId);
          newTemplatesOrder = newTemplatesOrder.filter(tid => tid !== templateId);
          newWidgets = newWidgets.filter(w => w.templateId !== templateId);
          newLibrary = newLibrary.filter(t => t.id !== templateId && t.originalId !== templateId);
          newFavorites = newFavorites.filter(fid => fid !== templateId);
        } else if (item.type === 'widget') {
          const widgetId = item.data?.id || item.id;
          newWidgets = newWidgets.filter(w => w.id !== widgetId);
        } else if (item.type === 'goal') {
          const goalId = item.data?.id || item.id;
          newGoals = newGoals.filter(g => g.id !== goalId);
          newGoalsOrder = newGoalsOrder.filter(gid => gid !== goalId);
        }
      });

      return {
        deletedItems: [],
        selectedTrashItems: new Set(),
        templates: newTemplates,
        templatesOrder: newTemplatesOrder,
        dashboardWidgets: newWidgets,
        libraryTemplates: newLibrary,
        favorites: newFavorites,
        goals: newGoals,
        goalsOrder: newGoalsOrder,
      };
    }),

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
    libraryFolders: [...state.libraryFolders, { id: generateId('folder'), name, itemIds: [] }]
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
      customFieldPool: [...state.customFieldPool, { id: generateId('pool'), label }]
    };
  }),
  addCustomCategory: (category) => set((state) => ({
    customCategories: [...state.customCategories, { ...category, id: generateId('cat') }]
  })),
  removeCustomCategory: (id) => set((state) => ({
    customCategories: state.customCategories.filter(c => c.id !== id)
  })),
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

  saveTempBudgetItems: (widgetId, items) => set((state) => {
    // Kalıcı verilere kaydet
    const widget = state.dashboardWidgets.find(w => w.id === widgetId);
    if (widget) {
      return {
        dashboardWidgets: state.dashboardWidgets.map(w =>
          w.id === widgetId
            ? {
              ...w,
              config: {
                ...w.config,
                budgetItems: items
              }
            }
            : w
        ),
        tempBudgetItems: {
          ...state.tempBudgetItems,
          [widgetId]: [] // Geçici veriyi temizle
        }
      };
    }
    return state;
  }),

  cancelTempBudgetItems: (widgetId) => set((state) => ({
    tempBudgetItems: {
      ...state.tempBudgetItems,
      [widgetId]: [] // Geçici veriyi temizle
    }
  })),
}));

// Helper function to get visible (non-trashed) library templates - No longer needed as libraryTemplates is filtered on delete
export function getVisibleLibraryTemplates(libraryTemplates: Template[]): Template[] {
  return libraryTemplates;
}
