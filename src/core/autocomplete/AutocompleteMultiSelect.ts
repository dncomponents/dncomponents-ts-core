import {java} from 'j4ts';
import {AbstractAutocompleteMultiSelect} from './AbstractAutocompleteMultiSelect';
import {Ui} from '../views/Ui';
import {HasRowsDataList} from '../AbstractCellComponent';
import {ComponentHtmlParser} from '../ComponentHtmlParser';
import {BaseComponent} from '../BaseComponent';
import {ListHtmlParser} from '../list/ListData';
import {ItemId} from '../corecls/entities';
import {AutocompleteMultiSelectView} from './views/AutocompleteMultiSelectView';
import List = java.util.List;

export class AutocompleteMultiSelect<T> extends AbstractAutocompleteMultiSelect<T, List<T>> {
    constructor();
    constructor(view: AutocompleteMultiSelectView<T>);
    constructor(view?: AutocompleteMultiSelectView<T>, fieldGetter?: (p1: T) => string);
    constructor(view?: AutocompleteMultiSelectView<T>, fieldGetter?: (p1: T) => string) {
        super(Ui.get().getAutocompleteMultiSelectView(false), fieldGetter);
    }

    public getRowsData(): List<T> {
        return this.view.getHasRowsData().getRowsData();
    }

    getHasRowsDataList(): HasRowsDataList<T> {
        return <HasRowsDataList<T>>this.view.getHasRowsData();
    }

    public setRowsData(rows: List<T>): void {
        this.getHasRowsDataList().setRowsData(rows);
        this.view.getHasRowsData().drawData();
    }

}

export class AutocompleteMultiSelectHtmlParser extends ComponentHtmlParser {

    private static instance: AutocompleteMultiSelectHtmlParser;

    private constructor() {
        super();
    }

    public static getInstance(): AutocompleteMultiSelectHtmlParser {
        if (this.instance == null)
            return this.instance = new AutocompleteMultiSelectHtmlParser();
        return this.instance;
    }

    public parse(htmlElement: Element, elements:  Map<string, any>): BaseComponent<any, any> {
        let autocomplete: AutocompleteMultiSelect<ItemId>;
        let view = this.getView(this.getClazz(), htmlElement, elements);
        if (view != null)
            autocomplete = new AutocompleteMultiSelect(<AutocompleteMultiSelectView<any>><unknown>view);
        else
            autocomplete = new AutocompleteMultiSelect();
        if (htmlElement.hasChildNodes()) {
            ListHtmlParser.getChildren(autocomplete.getHasRowsDataList(), htmlElement, this);
        }
        this.replaceAndCopy(htmlElement, autocomplete);
        return autocomplete;
    }

    public getId(): string {
        return 'dn-autocomplete-multi-select';
    }

    public getClazz(): string {
        return 'AutocompleteMultiSelect';
    }

}
