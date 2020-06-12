import {Command, HasViewSlots} from '../../BaseComponent';
import {View} from '../../corecls/View';
import {TabItemViewSlots} from './TabItemViewSlots';

export interface TabItemView extends View, HasViewSlots<TabItemViewSlots> {
    addItemSelectedHandler(handler: EventListener): void;

    select(b: boolean): void;

    setItemTitle(text?: any): void;

    setItemTitleHtml(html: string): void;

    setItemContent(html?: any): void;

    setImmediate(command: Command): void;

    getTabItemNav(): HTMLElement;

    getTabItemContent(): HTMLElement;
}
