import {ComponentUi, View} from '../corecls/View';
import {EventHandler, HandlerRegistration} from '../corecls/events';
import {IsElement} from '../corecls/IsElement';
import {Command, HasMainViewSlots} from '../BaseComponent';
import {ClickHandler} from '../corecls/handlers';

export interface DropDownUi extends ComponentUi<DropDownView> {
    getDropDownItemView(): DropDownItemView;
}

export interface DropDownView extends View {
    addClickOnButton(handler: EventHandler<any>): void;

    showList(b: boolean): void;

    addItem(item: IsElement<any>): void;

    removeItem(item: IsElement<any>): void;

    setButtonHtmlContent(content: HTMLElement): void;

    getRelativeElement(): IsElement<any>;

    setButtonContent(content: string): void;

    addClickOutOfButton(clickHandler: ClickHandler): HandlerRegistration;

    addDropDownPanel(dropDownPanel: IsElement<any>): void;
}

export interface DropDownItemView extends View, HasMainViewSlots {
    setContent(content: string): void;

    setHtmlContent(content: HTMLElement): void;

    addClickHandler(clickHandler: ClickHandler): void;

    setActive(active: boolean): void;
}
