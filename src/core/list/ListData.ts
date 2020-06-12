import {AbstractCellComponent, HasRowsDataList, reverseOrder} from '../AbstractCellComponent';
import {ListUi} from './ListUi';
import {java} from 'j4ts';
import {Ui} from '../views/Ui';
import {ListCell} from './ListCell';
import {ListTreeCellNavigator, ListTreeMultiSelectionModel} from './ListTreeMultiSelectionModel';
import {CellConfig} from '../CellConfig';
import {CellFactory} from '../corecls/CellFactory';
import {BaseCell} from '../BaseCell';
import {CellContext} from '../corecls/CellContext';
import {ComponentHtmlParser} from '../ComponentHtmlParser';
import {BaseComponent} from '../BaseComponent';
import {ItemId} from '../corecls/entities';
import {Util} from '../corecls/Util';
import {getDefaultComparator} from '../corecls/corecls';
import List = java.util.List;
import Comparator = java.util.Comparator;

export class ListData<T, M> extends AbstractCellComponent<T, M, ListUi> implements HasRowsDataList<T> {

    private comparator: java.util.Comparator<any>;

    private sortable: boolean = true;

    public getComparator(): Comparator<T> {
        if (this.comparator != null) {
            return this.comparator;
        } else {
            return getDefaultComparator(this.getRowCellConfig().getFieldGetter());
        }
    }

    private scrollable: boolean;

    constructor();
    constructor(view?: ListUi | ((p1: T) => any));
    constructor(view?: ListUi, fieldGetter?: (p1: T) => any);
    constructor(view?: ListUi, fieldGetter?: (p1: T) => any) {
        super(Util.isIsElement(view) ? view : Ui.get().getListUi());
        if (fieldGetter)
            this.getRowCellConfig().setFieldGetter(fieldGetter);
        this.defaultCellFactory = new class implements CellFactory<T, M, any> {
            getCell(c: CellContext<T, M, any>): BaseCell<T, M> {
                return new ListCell();
            }
        };
        // this.getRowCellConfig().setCellFactory(this.defaultCellFactory);
        /** // @ts-ignore */
        // @ts-ignore
        this.setSelectionModel(new ListTreeMultiSelectionModel(this, this.getView().getRootView()));
    }

    public getCells(): java.util.List<ListCell<T, M>> {
        return <any>super.getCells();
    }

    public getRowCell(row?: T | number): any {
        return <ListCell<T, M>>super.getRowCell(row);
    }

    public getSelectionModel(): ListTreeMultiSelectionModel<T> {
        return <ListTreeMultiSelectionModel<any>>super.getSelectionModel();
    }

    /**
     * Sorts with default sorter for cell
     *
     * @param {boolean} b <code>true</code> ascending <code>false</code> descending <code>null</code> for original
     */
    public sort(b: boolean) {
        if (!this.isSortable()) return;
        this.clearComparators();
        let comparator: java.util.Comparator<any> = <any>(this.getComparator());
        if (b != null)
            if (b)
                this.addComparator(<any>(comparator));
            else
                this.addComparator(reverseOrder(comparator));
        this.drawData();
    }

    public isScrollable(): boolean {
        return this.scrollable;
    }

    public setScrollable(b: boolean) {
        this.view.getRootView().setScrollable(b);
        this.scrollable = b;
    }

    /**
     * Sets the comparator used to compare the items in this column when sorting.
     * <code>null</code> to remove custom comparator.
     * If not set default sorter is used based on FieldGetter
     *
     * @param {*} comparator the Comparator to use for sorting
     */
    public setComparator(comparator: java.util.Comparator<T>) {
        this.comparator = <any>(comparator);
    }

    public removeComparator(): any {
        this.comparator = <any>(null);

    }

    /**
     * Sets if the column can be sorted (defaults to true).
     *
     * @param {boolean} sortable the sortable state
     */
    public setSortable(sortable: boolean) {
        this.sortable = sortable;
    }

    /**
     * Returns <code>true</code> if the column is sortable.
     *
     * @return {boolean} the sortable state
     */
    public isSortable(): boolean {
        return this.sortable;
    }

    newBlock() {
        let cellNavigator: ListTreeCellNavigator = this.getSelectionModel().getCellNavigator();
        if (cellNavigator != null && cellNavigator.working) {
            cellNavigator.focusCurrentCell();
        }
    }

    /** // @ts-ignore */
    // @ts-ignore
    ensureRowCellConfig(): ListCellConfig<T, M> {
        if (this.rowCellConfig == null)
            this.rowCellConfig = <any>new ListCellConfig();
        return <any>this.rowCellConfig;
    }

    /** // @ts-ignore */
    // @ts-ignore
    public getRowCellConfig(): ListCellConfig<T, M> {
        return this.ensureRowCellConfig();
    }

    public addRow(t: T): void {
        super.addRow(t);
    }

    public insertRow(t: T, index: number): void {
        return super.insertRow(t, index);
    }

    public removeRow(t: T): void {
        super.removeRow(t);
    }

    public setRowsData(rows: List<T>): void {
        super.setRowsData(rows);
    }

}

export interface ListCellFactory<T, M> extends CellFactory<T, M, AbstractCellComponent<any, any, any>> {
    /**
     *
     * @param {CellContext} c
     * @return {com.dncomponents.client.components.list.ListCell}
     */
    getCell(c?: any): any;
}


export class ListCellConfig<T, M> extends CellConfig<T, M> {

    constructor() {
        super();
        this.builder = new ListCell.Builder();
        let self = this;
        this.setCellFactory({
            getCell(c?: any): any {
                return c.createDefaultCell().initWithBuilder(self.builder);
            }
        });
    }

    /** // @ts-ignore */
    // @ts-ignore
    setCellFactory(cellFactory: ListCellFactory<T, M>): ListCellConfig<T, M> {
        /** // @ts-ignore */
        // @ts-ignore
        return super.setCellFactory(cellFactory);
    }

    /** // @ts-ignore */
    // @ts-ignore
    getCellFactory<C extends ListCellFactory<T, M>>(): C {
        return (<C><unknown>super.getCellFactory());
    }
}

export class ListHtmlParser extends ComponentHtmlParser {

    private static instance: ListHtmlParser;

    private constructor() {
        super();
    }

    public static getInstance(): ListHtmlParser {
        if (this.instance == null)
            return this.instance = new ListHtmlParser();
        return this.instance;
    }

    public parse(htmlElement: Element, elements: Map<string, any>): BaseComponent<any, any> {
        let list: ListData<ItemId, string>;
        let view = this.getView(this.getClazz(), htmlElement, elements);
        if (view != null)
            list = new ListData(<ListUi>view);
        else
            list = new ListData();
        list.getRowCellConfig().setFieldGetter(p1 => p1 + '');
        if (htmlElement.hasChildNodes()) {
            ListHtmlParser.getChildren(list, htmlElement, this);
        }
        this.replaceAndCopy(htmlElement, list);
        return list;
    }

    public static getChildren(hasRowsData: HasRowsDataList<ItemId>, htmlElement: Element, cp: ComponentHtmlParser) {
        let elementsByTagName = htmlElement.getElementsByTagName(ComponentHtmlParser.ITEM);
        for (let i: number = 0; i < elementsByTagName.length; i++) {
            let at: HTMLElement = <HTMLElement>elementsByTagName[i];
            hasRowsData.addRow(cp.getIdItem(at));
        }
        hasRowsData.drawData();
    }


    public getId(): string {
        return 'dn-list';
    }

    public getClazz(): string {
        return 'ListData';
    }

}