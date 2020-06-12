import {ComponentUi, View} from '../corecls/View';
import {IsElement} from '../corecls/IsElement';
import {Command, HasViewSlots, ViewSlots} from '../BaseComponent';

export interface AccordionUi extends ComponentUi<AccordionView> {
    getAccordionItemView(): AccordionItemView;
}

export interface AccordionView extends View {
    addItem(item: IsElement<any>): void;

    removeItem(item: IsElement<any>): void;

    clearAll(): void;
}

export interface AccordionItemViewSlots extends ViewSlots {
    getTitle(): HTMLElement;

    getContent(): HTMLElement;
}

export interface AccordionItemView extends View, HasViewSlots<AccordionItemViewSlots> {

    addItemSelectedHandler(handler: EventListener): void;

    select(b: boolean): void;

    setItemTitle(html: String): void;

    setItemTitle(html: HTMLElement): void;

    setItemContent(html: string): void;

    setItemContent(htmlElement: HTMLElement): void;

    setImmediate(command: Command): void;

    getTitle(): String;

    getContent(): String;
}