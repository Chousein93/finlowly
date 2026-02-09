import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical } from 'lucide-react';
import { Template } from '@/store/use-app-store';
import { DraggableAttributes } from '@dnd-kit/core';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

interface SharedTemplateCardProps {
    template: Template | any; // Any for trash items resilience
    variant: 'template' | 'library' | 'trash';
    isSelected?: boolean;
    onSelect?: () => void;
    isFavorite?: boolean;
    onToggleFavorite?: () => void;
    onPrimaryAction?: () => void;
    primaryActionIcon?: any;
    primaryActionLabel?: string;
    onSecondaryAction?: () => void;
    secondaryActionIcon?: any;
    secondaryActionLabel?: string;
    dndAttributes?: DraggableAttributes;
    dndListeners?: SyntheticListenerMap;
    isDragging?: boolean;
    dragRef?: (node: HTMLElement | null) => void;
    style?: React.CSSProperties;
    customFooter?: React.ReactNode;
    onClick?: () => void;
}

function MiniChart({ color = 'emerald' }: { color?: string }) {
    return (
        <div className="w-full h-12 flex items-end gap-1 mt-4 px-2">
            {[40, 70, 45, 90, 65, 80, 50, 95].map((height, i) => (
                <div
                    key={i}
                    className={cn(
                        "flex-1 rounded-t-sm transition-all duration-1000 ease-out animate-in slide-in-from-bottom-full delay-[var(--delay)]",
                        color === 'emerald' ? "bg-emerald-500/20 group-hover:bg-emerald-500" : "bg-slate-900/20 group-hover:bg-slate-900"
                    )}
                    style={{
                        height: `${height}%`,
                        // @ts-ignore
                        "--delay": `${i * 50}ms`
                    }}
                />
            ))}
        </div>
    );
}

function DataPreview({ template }: { template: any }) {
    const config = template.config || template.data?.config;
    if (!config) return null;

    const features = config.features || [];
    const hasCharts = features.includes('Grafikler') || features.includes('Trendler') || features.includes('İstatistikler');

    // 1. Progress Bar Logic (for Goals/Funds)
    if (config.targetAmount && config.currentAmount !== undefined) {
        const percentage = Math.min(Math.round((config.currentAmount / config.targetAmount) * 100), 100);
        return (
            <div className="w-full space-y-2 mt-4">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>İlerleme</span>
                    <span>%{percentage}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-slate-900 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <div className="text-center font-sans font-medium text-slate-900 mt-1">
                    {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(config.currentAmount)}
                    <span className="text-slate-400 text-[10px] ml-1">/ {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(config.targetAmount)}</span>
                </div>
                {hasCharts && <MiniChart />}
            </div>
        );
    }

    // 2. Transaction Logic (Income/Expense)
    if (config.amount !== undefined) {
        const isIncome = config.transactionType === 'income';
        return (
            <div className="w-full mt-4 p-3 rounded-lg border border-slate-100 bg-slate-50/50 flex flex-col items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    {isIncome ? 'GELİR TUTARI' : 'GİDER TUTARI'}
                </span>
                <span className={cn(
                    "font-sans font-bold text-lg",
                    isIncome ? "text-emerald-600" : "text-rose-600"
                )}>
                    {isIncome ? '+' : '-'}{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(config.amount)}
                </span>
                {hasCharts && <MiniChart color={isIncome ? 'emerald' : 'slate'} />}
            </div>
        );
    }

    // 3. Simple Summary for others
    if (config.interestRate || config.age || hasCharts) {
        return (
            <div className="w-full">
                <div className="grid grid-cols-2 gap-2 mt-4 w-full">
                    {config.interestRate !== undefined && (
                        <div className="bg-slate-50 p-2 rounded border border-slate-100 text-center">
                            <div className="text-[8px] text-slate-400 uppercase font-bold">Faiz</div>
                            <div className="text-xs font-bold text-slate-900">%{config.interestRate}</div>
                        </div>
                    )}
                    {config.age !== undefined && (
                        <div className="bg-slate-50 p-2 rounded border border-slate-100 text-center">
                            <div className="text-[8px] text-slate-400 uppercase font-bold">Yaş</div>
                            <div className="text-xs font-bold text-slate-900">{config.age}</div>
                        </div>
                    )}
                </div>
                {hasCharts && <MiniChart />}
            </div>
        );
    }

    return null;
}

export function SharedTemplateCard({
    template,
    variant,
    isSelected,
    onSelect,
    isFavorite,
    onToggleFavorite,
    onPrimaryAction,
    primaryActionIcon: PrimaryIcon,
    primaryActionLabel,
    onSecondaryAction,
    secondaryActionIcon: SecondaryIcon,
    secondaryActionLabel,
    dndAttributes,
    dndListeners,
    isDragging,
    dragRef,
    style,
    customFooter,
    onClick
}: SharedTemplateCardProps) {
    const Icon = template.icon || template.data?.icon;

    return (
        <Card
            ref={dragRef}
            style={style}
            {...dndAttributes}
            {...dndListeners}
            className={cn(
                "group relative border-slate-200 bg-white hover:border-slate-400 hover:shadow-lg hover:scale-[1.01] transition-all duration-300 overflow-hidden flex flex-col min-h-[220px]",
                isDragging && "opacity-50 scale-[0.98] shadow-2xl cursor-grabbing z-50",
                variant === 'trash' && "opacity-80 hover:opacity-100"
            )}
            onClick={onClick} // Card click triggers the passed onClick handler (e.g. open details)
        >
            {/* Visual Drag Handle (optional icon, but listeners are on card now) */}
            {variant !== 'trash' && dndListeners && (
                <div
                    className="absolute top-3 left-3 p-1.5 rounded-md text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 z-10"
                    onClick={(e) => e.stopPropagation()}
                >
                    <GripVertical className="h-4 w-4" />
                </div>
            )}

            {/* Selection Indicator (Top Right) */}
            {onSelect && (
                <div className="absolute top-3 right-3 z-10">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelect();
                        }}
                        className={cn(
                            "h-8 w-8 p-0 transition-all duration-200 border-none shadow-none bg-transparent hover:bg-slate-100",
                            isSelected
                                ? "text-slate-900 font-bold"
                                : "text-slate-300 hover:text-slate-500"
                        )}
                    >
                        <span className={cn("text-xs", isSelected && "scale-125")}>{isSelected ? '✓' : '○'}</span>
                    </Button>
                </div>
            )}

            <CardHeader className="pb-3 pt-8 px-6">
                <div className="flex flex-col items-center text-center gap-4">
                    <div className={cn(
                        "p-3 rounded-xl border transition-all duration-300 group-hover:bg-slate-900 group-hover:border-slate-900",
                        variant === 'trash' ? "bg-rose-50 border-rose-100" : "bg-slate-50 border-slate-100"
                    )}>
                        {Icon ? (
                            <Icon className={cn(
                                "h-6 w-6 transition-colors duration-300 group-hover:text-white",
                                variant === 'trash' ? "text-rose-400" : "text-slate-600"
                            )} />
                        ) : (
                            <div className="h-6 w-6 bg-slate-200 rounded-full" />
                        )}
                    </div>
                    <CardTitle className="sm:text-base text-sm font-semibold text-slate-900 tracking-tight line-clamp-1">
                        {template.title || template.data?.title}
                    </CardTitle>
                </div>
            </CardHeader>

            <CardContent className="px-6 pb-6 pt-0 flex-1 flex flex-col">
                <p className="sm:text-sm text-xs text-slate-500 text-center leading-relaxed line-clamp-2">
                    {template.description || template.data?.description || 'Açıklama yok.'}
                </p>

                {/* Data Visualization Section */}
                <DataPreview template={template} />

                <div className="mt-auto pt-6 flex items-center justify-center gap-2">
                    {/* Custom Footer overrides default buttons if provided */}
                    {customFooter ? customFooter : (
                        <>
                            {/* Secondary Action (Left) - e.g. Favorite */}
                            {onSecondaryAction && SecondaryIcon && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSecondaryAction();
                                    }}
                                    className={cn(
                                        "h-8 w-8 p-0 transition-all duration-200",
                                        isFavorite
                                            ? "bg-slate-900 border-slate-900 text-white hover:bg-slate-800"
                                            : "text-slate-400 hover:border-slate-400"
                                    )}
                                    title={secondaryActionLabel}
                                >
                                    <SecondaryIcon className={cn("h-4 w-4", isFavorite && "fill-current")} />
                                </Button>
                            )}

                            {/* Primary Action (Right) - e.g. Add to Library */}
                            {onPrimaryAction && PrimaryIcon && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onPrimaryAction();
                                    }}
                                    className="h-8 w-8 p-0 transition-all duration-200 text-slate-400 hover:border-slate-400 hover:text-slate-900"
                                    title={primaryActionLabel}
                                >
                                    <PrimaryIcon className="h-4 w-4" />
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
