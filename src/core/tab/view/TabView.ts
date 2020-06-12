import {View} from '../../corecls/View';

export interface TabView extends View {
    addItem(tabItem: HTMLElement, tabContent: HTMLElement): void;

    removeItem(tabItem: HTMLElement, tabContent: HTMLElement): void;
}
