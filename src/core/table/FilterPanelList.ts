import {FilterPanel} from './FilterPanel';
import {java} from 'j4ts';
import {Ui} from '../views/Ui';
import {Comparator, FilterUtil, IsAnyOfComparator, IsNonOfComparator} from './FilterUtil';
import {AutocompleteMultiSelect} from '../autocomplete/AutocompleteMultiSelect';
import {CellEditor, DefaultCellEditor} from '../CellEditor';
import {ValueChangeHandler} from '../corecls/ValueClasses';
import {Autocomplete} from '../autocomplete/Autocomplete';
import {FilterPanelListView} from './views/FilterPanelListView';
import List = java.util.List;

export class FilterPanelList<T> extends FilterPanel<T> {

    private data: List<T>;

    public constructor(data: List<T>) {
        super(Ui.get().getFilterPanelListView());
        this.data = data;
        this.view.setValueComponent(this.getSingleCellEdit());
        this.comparators = FilterUtil.collectionComparators;
        this.bind();
    }


    public setValueComponentFromComparator(comparator: Comparator<any, any>): void {
        super.setValueComponentFromComparator(comparator);
        if (FilterUtil.isEmptyComparator(comparator)) {
            return;
        }
        if (comparator instanceof IsAnyOfComparator ||
            comparator instanceof IsNonOfComparator) {
            this.view.setValueComponent(this.getMultiCellEdit());
        } else {
            this.view.setValueComponent(this.getSingleCellEdit());
        }
    }

    private multiCellEdit: CellEditor<any>;

    private getMultiCellEdit(): CellEditor<any> {
        if (this.multiCellEdit == null) {
            let autocompleteMultiSelect = new AutocompleteMultiSelect(this.getView().getAutocompleteMultiSelectUi());
            autocompleteMultiSelect.setRowsData(this.data);
            this.multiCellEdit = new DefaultCellEditor(autocompleteMultiSelect);
            this.multiCellEdit.getHasValue().addValueChangeHandler(ValueChangeHandler.onValueChange(() => this.onValueChanged()));
        }
        return this.multiCellEdit;
    }


    private singleCellEdit: CellEditor<any>;

    private getSingleCellEdit(): CellEditor<any> {
        if (this.singleCellEdit == null) {
            let autocomplete = new Autocomplete<T>(this.getView().getAutocompleteView(), t => t + '');
            autocomplete.setRowsData(this.data);
            this.singleCellEdit = new DefaultCellEditor(autocomplete);
            this.singleCellEdit.getHasValue().addValueChangeHandler(ValueChangeHandler.onValueChange(() => this.onValueChanged()));
        }
        return this.singleCellEdit;
    }

    protected getView(): FilterPanelListView<any> {
        return <FilterPanelListView<any>>super.getView();
    }
}