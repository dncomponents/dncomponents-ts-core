import {FilterPanelView} from './TableUi';
import {AutocompleteMultiSelectView} from '../../autocomplete/views/AutocompleteMultiSelectView';
import {AutocompleteView} from '../../autocomplete/views/AutocompleteView';

export interface FilterPanelListView<T> extends FilterPanelView<T> {
    getAutocompleteView(): AutocompleteView<any>;

    getAutocompleteMultiSelectUi(): AutocompleteMultiSelectView<any>;
}
