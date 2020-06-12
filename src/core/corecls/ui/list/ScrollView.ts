import {View} from '../../View';
import {HandlerRegistration} from '../../events';
import {ScrollHandler} from '../../handlers';

export interface ScrollView extends View { // HasScrollHandlers
    getRowHeight(): number;

    addItem(element: HTMLElement): void;

    clear(): void;

    addScrollHandler(scrollHandler: ScrollHandler): HandlerRegistration;

    getScrollTop(): number;

    createEmptyRow(): HTMLElement;

    resetScrollTop(value: number): void;

    getScrollPanel(): HTMLElement;

    setScrollHeight(height: string): void;
}
