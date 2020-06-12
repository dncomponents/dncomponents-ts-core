import {TooltipView} from '../../tooltip/view/TooltipView';
import {MainViewSlots, Renderer} from '../../BaseComponent';

export interface PopoverView extends TooltipView<PopoverViewSlots> {
    setPopoverTitle(title: string): void;
}

export interface PopoverViewSlots extends MainViewSlots {
    getTitle(): HTMLElement;
}

export interface PopoverRenderer<T> extends Renderer<T, PopoverViewSlots> {
}
