import { SharedTemplateCard } from '@/components/dashboard/shared-template-card';
import { Heart, Star } from 'lucide-react';
import { useAppStore } from '@/store/use-app-store';
import { toast } from 'sonner';

export function FavoritesView() {
  const { templates, libraryTemplates, favorites, toggleFavorite, addToDashboard, openTemplateCreation, addToLibrary } = useAppStore();

  const favoriteItems = [
    ...templates.filter(t => favorites.includes(t.id)),
    ...libraryTemplates.filter(t => favorites.includes(t.id))
  ].map(t => ({
    ...t,
    isLibrary: libraryTemplates.some(lt => lt.id === t.id)
  }));

  return (
    <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight flex items-center gap-3">
            <Star className="h-6 w-6 text-amber-400 fill-amber-400" aria-hidden="true" />
            Favoriler
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Yıldızladığınız tüm şablonlar ve kütüphane öğeleri burada listelenir.
          </p>
        </div>
      </div>

      {favoriteItems.length === 0 ? (
        <div className="min-h-[400px] flex flex-col items-center justify-center animate-in zoom-in-95 duration-700">
          <div className="mx-auto w-20 h-20 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shadow-sm mb-6">
            <Star className="h-10 w-10 text-slate-200" />
          </div>
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-xl font-semibold text-slate-900">Henüz Favori Yok</h2>
            <p className="text-sm text-slate-500 leading-relaxed max-w-[320px]">
              Şablonları veya kütüphanenizdeki öğeleri yıldızlayarak buraya hızlı erişim sağlayabilirsiniz.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-24">
          {favoriteItems.map((item) => (
            <SharedTemplateCard
              key={item.id}
              template={item}
              variant={item.isLibrary ? 'library' : 'template'}
              isFavorite={true}
              onSecondaryAction={() => {
                toggleFavorite(item.id);
                toast.success('Favorilerden çıkarıldı');
              }}
              secondaryActionIcon={Star}
              secondaryActionLabel="Favorilerden Çıkar"
              onClick={() => openTemplateCreation(item)}
              onPrimaryAction={item.isLibrary ? () => {
                addToDashboard(item);
                toast.success('Widget dashboard\'a eklendi');
              } : undefined}
              primaryActionLabel={item.isLibrary ? "Dashboard'a Ekle" : undefined}
            />
          ))}
        </div>
      )}

      {/* Footer Info */}
      <div className="flex items-center justify-center py-12 text-slate-300 opacity-50 select-none pointer-events-none border-t border-slate-100">
        <p className="text-xs tracking-widest uppercase italic font-bold">Finlowly Persistence System v1.0</p>
      </div>
    </div>
  );
}
