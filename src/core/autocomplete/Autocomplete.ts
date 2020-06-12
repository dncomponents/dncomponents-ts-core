import {AbstractAutocomplete} from './AbstractAutocomplete';
import {java} from 'j4ts';
import {ComponentHtmlParser} from '../ComponentHtmlParser';
import {BaseComponent} from '../BaseComponent';
import {Ui} from '../views/Ui';
import {ListCellConfig, ListHtmlParser} from '../list/ListData';
import {HasRowsDataList} from '../AbstractCellComponent';
import {AutocompleteView} from './views/AutocompleteView';
import {ItemId} from '../corecls/entities';
import {Util} from '../corecls/Util';
import List = java.util.List;

export class Autocomplete<T> extends AbstractAutocomplete<T, AutocompleteView<T>, T> {

    constructor();
    constructor(view?: AutocompleteView<T> | ((p1: T) => string));
    constructor(view?: AutocompleteView<T>, fieldGetter?: (p1: T) => string);
    constructor(view?: AutocompleteView<T>, fieldGetter?: (p1: T) => string) {
        super(Util.isIsElement(view) ? view : Ui.get().getAutocompleteView(), fieldGetter);
    }

    public getView(): AutocompleteView<T> {
        return super.getView();
    }

    public setName(name: string): void {
        this.getView().setStringValue(name);
    }

    public setRowsData(rows: List<T>): void {
        this.getView().getHasRowsData().setRowsData(rows);
        this.getView().getHasRowsData().drawData();
    }

    public getHasRowsDataList(): HasRowsDataList<T> {
        return this.view.getHasRowsData();
    }

    /** // @ts-ignore */
    // @ts-ignore
    public getRowCellConfig(): ListCellConfig<T, string> {
        return <ListCellConfig<T, string>>this.view.getRowCellConfig();
    }
}

export class AutocompleteHtmlParser extends ComponentHtmlParser {

    private static instance: AutocompleteHtmlParser;

    private constructor() {
        super();
    }

    public static getInstance(): AutocompleteHtmlParser {
        if (this.instance == null)
            return this.instance = new AutocompleteHtmlParser();
        return this.instance;
    }

    public parse(htmlElement: Element, elements: Map<string, any>): BaseComponent<any, any> {
        let autocomplete: Autocomplete<ItemId>;
        let view = this.getView(this.getClazz(), htmlElement, elements);
        if (view != null)
            autocomplete = new Autocomplete(<AutocompleteView<any>><unknown>view);
        else
            autocomplete = new Autocomplete();
        if (htmlElement.hasChildNodes()) {
            ListHtmlParser.getChildren(autocomplete.getHasRowsDataList(), htmlElement, this);
        }
        this.replaceAndCopy(htmlElement, autocomplete);
        return autocomplete;
    }

    public getId(): string {
        return 'dn-autocomplete';
    }

    public getClazz(): string {
        return 'Autocomplete';
    }

}
