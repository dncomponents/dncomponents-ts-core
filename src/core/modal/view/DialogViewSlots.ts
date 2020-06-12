import {ViewSlots} from '../../BaseComponent';

export interface DialogViewSlots extends ViewSlots {
    getHeaderPanel(): HTMLElement;

    getContentPanel(): HTMLElement;

    getFooterPanel(): HTMLElement;
}
