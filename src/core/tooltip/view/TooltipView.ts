import {HasViewSlots, MainViewSlots, Renderer, ViewSlots} from '../../BaseComponent';
import {View} from '../../corecls/View';
import {java} from 'j4ts';
import text = java.text;

export interface TooltipView<V extends MainViewSlots> extends View, HasViewSlots<V> {
    setBottomOrientation(): void;

    setTopOrientation(): void;

    setLeftOrientation(): void;

    setRightOrientation(): void;

    calculatePositionBottom(owner: HTMLElement): void;

    calculatePositionTop(owner: HTMLElement): void;

    calculatePositionLeft(owner: HTMLElement): void;

    calculatePositionRight(owner: HTMLElement): void;

    setContent(text: string | HTMLElement): void;
}