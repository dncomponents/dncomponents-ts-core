import {View} from '../../corecls/View';
import {HasMainViewSlots} from '../../BaseComponent';

export interface ButtonView extends View, HasMainViewSlots {
    setText(text: string): void;

    setHTML(html: string): void;

    getHTML(): string;

    getText(): string;

    setEnabled(enabled: boolean): void;
}