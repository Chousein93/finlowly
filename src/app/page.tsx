'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { OverviewView } from '@/components/views/overview-view';
import { TemplatesView } from '@/components/views/templates-view';
import { LibraryView } from '@/components/views/library-view';
import { FavoritesView } from '@/components/views/favorites-view';
import { TrashView } from '@/components/views/trash-view';
import { GoalsView } from '@/components/views/goals-view';
import { SettingsView } from '@/components/views/settings-view';
import { PlaceholderView } from '@/components/views/placeholder-view';
import { TemplateDetailView } from '@/components/views/template-detail-view';
import { useAppStore } from '@/store/use-app-store';

export default function Home() {
  const { currentView } = useAppStore();

  const renderView = () => {
    switch (currentView) {
      case 'overview':
        return <OverviewView />;
      case 'templates':
        return <TemplatesView />;
      case 'library':
        return <LibraryView />;
      case 'favorites':
        return <FavoritesView />;
      case 'trash':
        return <TrashView />;
      case 'goals':
        return <GoalsView />;
      case 'settings':
        return <SettingsView />;
      case 'template-detail':
        return <TemplateDetailView />;
      default:
        return <OverviewView />;
    }
  };

  return <AppLayout>{renderView()}</AppLayout>;
}
