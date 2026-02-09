import { useState } from 'react';
import { Plus, Trash2, TrendingUp, PieChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppStore, DashboardWidget } from '@/store/use-app-store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const ASSET_TYPES = [
    { value: 'stock', label: 'Hisse Senedi', color: 'bg-emerald-500' },
    { value: 'gold', label: 'Altın', color: 'bg-amber-400' },
    { value: 'crypto', label: 'Kripto', color: 'bg-indigo-500' },
    { value: 'real_estate', label: 'Gayrimenkul', color: 'bg-rose-500' },
    { value: 'cash', label: 'Nakit', color: 'bg-slate-500' },
    { value: 'fund', label: 'Yatırım Fonu', color: 'bg-blue-500' },
];

export function PortfolioWidget({ widget }: { widget: DashboardWidget }) {
    const { updateDashboardWidget } = useAppStore();
    const [assetName, setAssetName] = useState('');
    const [assetValue, setAssetValue] = useState('');
    const [assetType, setAssetType] = useState('stock');

    const assets = widget.config?.assets || [];
    const totalValue = assets.reduce((sum, a) => sum + a.value, 0);

    const handleAddAsset = () => {
        if (!assetName || !assetValue) return;
        const val = parseFloat(assetValue);
        if (isNaN(val) || val <= 0) return;

        const newAsset = {
            id: Math.random().toString(36).substr(2, 9),
            name: assetName,
            value: val,
            type: assetType,
            color: ASSET_TYPES.find(t => t.value === assetType)?.color
        };

        updateDashboardWidget(widget.id, {
            config: { ...widget.config, assets: [...assets, newAsset] }
        });

        setAssetName('');
        setAssetValue('');
        toast.success('Varlık eklendi');
    };

    const handleRemoveAsset = (id: string) => {
        const newAssets = assets.filter(a => a.id !== id);
        updateDashboardWidget(widget.id, {
            config: { ...widget.config, assets: newAssets }
        });
    };

    // Prepare chart data segments
    // Simple visualization: stacked bar for now as valid CSS pie charts need more calculation
    // Or we can do a simple grid distribution

    return (
        <div className="space-y-4">
            {/* Total Value */}
            <div className="flex justify-between items-center bg-slate-900 text-white p-3 rounded-xl shadow-lg shadow-slate-200">
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Toplam Portföy</p>
                    <p className="text-xl font-bold mt-1">₺{totalValue.toLocaleString('tr-TR')}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                </div>
            </div>

            {/* Asset Distribution Bar */}
            {totalValue > 0 && (
                <div className="space-y-2">
                    <div className="flex h-2 w-full rounded-full overflow-hidden">
                        {assets.map((asset, i) => (
                            <div
                                key={asset.id}
                                className={cn("h-full", asset.color || 'bg-slate-300')}
                                style={{ width: `${(asset.value / totalValue) * 100}%` }}
                                title={`${asset.name}: %${((asset.value / totalValue) * 100).toFixed(1)}`}
                            />
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-2 text-[10px]">
                        {ASSET_TYPES.filter(t => assets.some(a => a.type === t.value)).map(type => (
                            <div key={type.value} className="flex items-center gap-1">
                                <div className={cn("w-2 h-2 rounded-full", type.color)} />
                                <span className="font-medium text-slate-600">{type.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Asset List */}
            <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
                {assets.length === 0 && (
                    <div className="text-center py-4 text-xs text-slate-400 italic">Henüz varlık eklenmedi</div>
                )}
                {assets.map(asset => {
                    const typeInfo = ASSET_TYPES.find(t => t.value === asset.type);
                    return (
                        <div key={asset.id} className="flex items-center justify-between text-xs p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 group transition-all">
                            <div className="flex items-center gap-2">
                                <div className={cn("w-1.5 h-1.5 rounded-full", typeInfo?.color)} />
                                <div className="flex flex-col">
                                    <span className="text-slate-700 font-medium truncate max-w-[80px]">{asset.name}</span>
                                    <span className="text-[9px] text-slate-400">{typeInfo?.label}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900">₺{asset.value.toLocaleString()}</span>
                                <button
                                    onClick={() => handleRemoveAsset(asset.id)}
                                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-opacity"
                                >
                                    <Trash2 className="h-3 w-3" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Add Asset Form */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-50">
                <div className="flex-1 min-w-0 flex gap-2">
                    <Select value={assetType} onValueChange={setAssetType}>
                        <SelectTrigger className="w-[80px] h-8 text-[10px] px-2 bg-slate-50 border-slate-200">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {ASSET_TYPES.map(t => (
                                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Input
                        placeholder="Varlık adı"
                        value={assetName}
                        onChange={(e) => setAssetName(e.target.value)}
                        className="h-8 text-xs bg-slate-50 border-slate-200 focus-visible:ring-1"
                    />
                    <Input
                        placeholder="Değer"
                        type="number"
                        value={assetValue}
                        onChange={(e) => setAssetValue(e.target.value)}
                        className="w-[70px] h-8 text-xs bg-slate-50 border-slate-200 focus-visible:ring-1"
                    />
                </div>
                <Button
                    size="icon"
                    className="h-8 w-8 shrink-0 bg-slate-900 hover:bg-slate-800"
                    onClick={handleAddAsset}
                >
                    <Plus className="h-3.5 w-3.5" />
                </Button>
            </div>
        </div>
    );
}
