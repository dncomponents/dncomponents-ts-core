import {DialogViewSlots} from './DialogViewSlots';
import {HasViewSlots} from '../../BaseComponent';
import {View} from '../../corecls/View';
import {IsElement} from '../../corecls/IsElement';

export interface DialogView extends View, HasViewSlots<DialogViewSlots> {
    setHeader(element: IsElement<any>): void;

    setContent(element: HTMLElement): void;

    setFooter(element: IsElement<any>): void;

    setTitle(title: string): void;

    addCloseHandler(onCloseCmd: () => void): void;

    show(): void;

    hide(): void;

    addFooterElement(element: HTMLElement): void;

    clearFooter(): void;

    setWidth(width: string): void;

    setBackDrop(backdrop: boolean): void;

    setCloseOnEscape(closeOnEscape: boolean): void;

    setDraggable(draggable: boolean): void;

    setPosition(top: number, left: number): void;

    getTopPosition(): number;

    getLeftPosition(): number;

    setHeight(height: string): void;
}
