import {ComponentUi, View} from '../corecls/View';
import {BaseCellView} from '../corecls/BaseCellView';
import {HasValue} from '../corecls/ValueClasses';
import {ScrollView} from '../corecls/ui/list/ScrollView';
import {HasNavigationHandler} from '../corecls/handlers';

export interface ListCellCheckBoxView extends BaseCellView {
    getCheckbox(): HasValue<boolean>;
}

export interface ListView extends View, ScrollView, HasNavigationHandler {
    setScrollable(b: boolean): void;
}

export interface ListUi extends ComponentUi<ListView> {
    getListCellView(): BaseCellView;

    getListCheckBoxView(): ListCellCheckBoxView;
}