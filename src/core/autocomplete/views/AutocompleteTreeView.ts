import {TreeNode} from '../../tree/TreeNode';
import {BaseAutocompleteView} from './BaseAutocompleteView';
import {HasCloseHandlers, HasOpenHandlers} from '../../corecls/handlers';
import {HasTreeData} from '../../AbstractCellComponent';

export interface AutocompleteTreeView<T> extends BaseAutocompleteView<TreeNode<T>> {
    getHasRowsData(): HasTreeData<T>;

    getHasOpenHandlers(): HasOpenHandlers<TreeNode<T>>;

    getHasCloseHandlers(): HasCloseHandlers<TreeNode<T>>;
}
