import {BaseAutocompleteView} from './BaseAutocompleteView';
import {AutocompleteMultiSelectItemView} from './AutocompleteMultiSelectItemView';
import {IsElement} from '../../corecls/IsElement';

export interface AutocompleteMultiSelectView<M> extends BaseAutocompleteView<M> {
    clearItems(): void;

    addItem(item: IsElement<any>): void;

    getAutocompleteMultiSelectItemView(): AutocompleteMultiSelectItemView;
}