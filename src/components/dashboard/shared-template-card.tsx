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

// MiniChart removed — cards now show clean data without decorative graphs

// DataPreview removed for cleaner card UI

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
                <div className="flex flex-col items-center text-center gap-3">
                    <div className={cn(
                        "p-3.5 rounded-2xl border transition-all duration-300 group-hover:scale-110 group-hover:shadow-md",
                        variant === 'trash'
                            ? "bg-rose-50 border-rose-100 group-hover:bg-rose-500 group-hover:border-rose-500"
                            : "bg-slate-900 border-slate-900 group-hover:bg-slate-800"
                    )}>
                        {Icon ? (
                            <Icon className={cn(
                                "h-6 w-6 transition-colors duration-300",
                                variant === 'trash' ? "text-rose-400 group-hover:text-white" : "text-white"
                            )} />
                        ) : (
                            <div className="h-6 w-6 bg-slate-200 rounded-full" />
                        )}
                    </div>
                    <CardTitle className="text-base font-semibold text-slate-900 tracking-tight line-clamp-1">
                        {template.title || template.data?.title}
                    </CardTitle>
                </div>
            </CardHeader>

            <CardContent className="px-6 pb-5 pt-0 flex-1 flex flex-col">
                <p className="text-xs text-slate-400 text-center leading-relaxed line-clamp-2">
                    {template.description || template.data?.description || 'Açıklama yok.'}
                </p>

                {/* Data Visualization Removed - Card is now unique entry point */}

                <div className="mt-auto pt-4 flex items-center justify-center gap-2">
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
                                        "h-9 w-9 p-0 rounded-xl transition-all duration-200",
                                        isFavorite
                                            ? "bg-amber-50 border-amber-200 text-amber-500 hover:bg-amber-100"
                                            : "text-slate-300 border-slate-200 hover:border-slate-300 hover:text-slate-500"
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
                                    className="h-9 w-9 p-0 rounded-xl transition-all duration-200 text-slate-300 border-slate-200 hover:border-slate-400 hover:text-slate-600 hover:bg-slate-50"
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
