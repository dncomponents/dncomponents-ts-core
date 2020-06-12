import {ViewSlots} from '../../BaseComponent';

export interface TabItemViewSlots extends ViewSlots {
    getTitle(): HTMLElement;

    getIcon(): HTMLElement;

    getContent(): HTMLElement;
}