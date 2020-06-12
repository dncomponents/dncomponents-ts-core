import {View} from '../../corecls/View';
import {ClickHandler} from '../../corecls/handlers';
import {HasMainViewSlots} from '../../BaseComponent';

export interface AutocompleteMultiSelectItemView extends View, HasMainViewSlots {
    addRemoveClickHandler(clickHandler: ClickHandler): void;
}