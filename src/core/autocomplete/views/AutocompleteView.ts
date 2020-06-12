import {BaseAutocompleteView} from './BaseAutocompleteView';
import {HasRowsDataList} from '../../AbstractCellComponent';

export interface AutocompleteView<M> extends BaseAutocompleteView<M> {
    getHasRowsData(): HasRowsDataList<M>;
}
