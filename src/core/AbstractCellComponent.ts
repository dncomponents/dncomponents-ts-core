import {ScrollView} from './corecls/ui/list/ScrollView';
import {ComponentUi} from './corecls/View';
import {BaseComponent} from './BaseComponent';
import {java} from 'j4ts';
import {DefaultMultiSelectionModel} from './corecls/selectionmodel/selectionImpl';
import {CellFactory} from './corecls/CellFactory';
import {AbstractCell} from './AbstractCell';
import {CellConfig} from './CellConfig';
import {EventHandler, HandlerRegistration} from './corecls/events';
import {
    CellEditHandler,
    FilterHandler,
    RowDataChangedEvent,
    RowDataChangedHandler,
    SelectionEvent,
    SelectionHandler
} from './corecls/handlers';
import {BaseCell} from './BaseCell';
import {CellContext} from './corecls/CellContext';
import {VirtualScroll} from './VirtualScroll';
import {Filter} from './corecls/Filter';
import * as events from 'events';
import {TreeNode} from './tree/TreeNode';
import Collectors = java.util.stream.Collectors;
import List = java.util.List;
import Comparator = java.util.Comparator;

export abstract class AbstractCellComponent<T, M, W extends ComponentUi<ScrollView>> extends BaseComponent<any, W> implements HasRowsData<T> {

    rows = new java.util.ArrayList<T>();

    protected visibleCells: java.util.List<BaseCell<T, M>>;

    selectionModel: DefaultMultiSelectionModel<T>;

    rowCellConfig: CellConfig<T, M>;

    filters = new java.util.ArrayList<Predicate<T>>();

    comparators = new java.util.ArrayList<java.util.Comparator<any>>();

    rowsFiltered: List<T> = new java.util.ArrayList<T>();

    virtualScroll: VirtualScroll = null;

    defaultCellFactory: CellFactory<T, M, any>;

    private editable: boolean = true;

    constructor(ui: W) {
        super(ui);
        this.visibleCells = new java.util.ArrayList<BaseCell<T, M>>();
        this.rows = new java.util.ArrayList<T>();
        this.rowsFiltered = new java.util.ArrayList<T>();
    }

    public static initCell(cell: AbstractCell<any, any, any>, model: any, config: CellConfig<any, any>, owner: AbstractCellComponent<any, any, any>): AbstractCell<any, any, any> {
        cell.setCellConfig(config);
        cell.setModel(model);
        cell.setOwner(owner);
        cell.bind();
        return cell;
    }

    static initCellList(cell: AbstractCell<any, any, any>, model: any, config: CellConfig<any, any>, visibleCells: java.util.List<any>, owner: AbstractCellComponent<any, any, any>): AbstractCell<any, any, any> {
        AbstractCellComponent.initCell(cell, model, config, owner);
        visibleCells.add(cell);
        return cell;
    }

    static initCellListDraw(cell: AbstractCell<any, any, any>, model: any, config: CellConfig<any, any>, visibleCells: java.util.List<any>, owner: AbstractCellComponent<any, any, any>): AbstractCell<any, any, any> {
        let cell1: AbstractCell<any, any, any> = AbstractCellComponent.initCellList(cell, model, config, visibleCells, owner);
        cell1.draw();
        return cell1;
    }

    /**
     *
     * @param {*} handler
     * @return {*}
     */
    public addRowDataChangedHandler(handler: RowDataChangedHandler): HandlerRegistration {
        return this.addHandler(handler);
    }

    /**
     *
     * @param {*} handler
     * @return {*}
     */
    // todo
    // public addSortHandler(handler: SortHandler): HandlerRegistration {
    //     return this.addHandler(handler);
    // }

    /**
     *
     * @param {*} handler
     * @return {*}
     */
    public addCellEditHandler(handler: CellEditHandler<T>): HandlerRegistration {
        return this.addHandler(handler);
    }

    /**
     * @return {*} unmodifiableList model list
     */
    public getRowsData(): java.util.List<T> {
        return this.rows;
    }

    /**
     * Sets list of model values to display.
     *
     * @param {*} rows
     */
    public setRowsData(rows: java.util.List<T>) {
        this.rows = <any>(new java.util.ArrayList<any>(rows));
        this.rowsFiltered = <any>(new java.util.ArrayList<any>(this.rows));
        RowDataChangedEvent.fire(this, rows.size());
    }

    /**
     *
     */
    public drawData() {
        this.view.getRootView().clear();
        this.visibleCells.clear();
        this.filterAndSort();
        this.displayFilteredData();
    }

    refreshSelections(): void {
        this.visibleCells.forEach(p1 => {
            p1.setSelection();
        });
    }

    /**
     * Displays data after all filters and sorting are applied.
     */
    protected displayFilteredData() {
        this.displayFilteredDataInVirtualScroll();
    }

    /**
     * If rows number reaches {@link VirtualScroll#scrollStarts} displays rows data in virtual scroll
     */
    displayFilteredDataInVirtualScroll() {
        if (this.rowsFiltered.size() > this.ensureVirtualScroll().scrollStarts)
            this.ensureVirtualScroll().drawData();
        else {
            this.removeScrollHandler();
            this.rowsFiltered.forEach((t) => this.createAndInitModelRowCell(t));
        }
    }

    /**
     *
     * @return {number}
     */
    public getRowSize(): number {
        return this.rows.size();
    }


    public getRowCell(row: T | number): BaseCell<T, M> {
        if (typeof row === 'number') {
            return this.visibleCells.get(row);
        } else {
            return this.visibleCells.stream().filter((cell) => cell.getModel() === row).findFirst().orElse(null);
        }
        throw new Error('invalid overload');
    }


    public getRowCells(list: java.util.List<T>): java.util.List<any> {
        return <any>(list.stream().map<any>((model) => this.getRowCell(model)).collect<any, any>(java.util.stream.Collectors.toList<any>()));
    }

    /**
     *
     * @return {DefaultMultiSelectionModel}
     */
    public getSelectionModel(): DefaultMultiSelectionModel<T> {
        return this.selectionModel;
    }

    setSelectionModel(selectionModel: DefaultMultiSelectionModel<any>) {
        this.selectionModel = selectionModel;
        let self = this;
        this.getSelectionModel().addSelectionHandler(new class extends SelectionHandler<List<T>> {
            onSelection(evt: SelectionEvent<java.util.List<T>>): void {
                for (let index = self.getCells().iterator(); index.hasNext();) {
                    let baseCell = index.next();
                    baseCell.setSelection();
                }
            };
        });
    }

    public getCells(): java.util.List<BaseCell<T, M>> {
        return this.visibleCells;
    }

    public getCellsSize(): number {
        return this.visibleCells.size();
    }

    createAndInitModelRowCell(model: T): BaseCell<any, any> {
        let cc: CellConfig<T, M> = this.ensureRowCellConfig(model);
        let cell: BaseCell<any, any> = cc.getCellFactory().getCell(new CellContext(cc, this.defaultCellFactory, model, this));
        AbstractCellComponent.initCellListDraw(cell, model, cc, this.visibleCells, this);
        this.view.getRootView().addItem(cell.asElement());
        return cell;
    }

    protected addRow(t: T) {
        this.rows.add(t);
        this.rowsFiltered.add(t);
        this.createAndInitModelRowCell(t);
    }


    protected insertRow(t: T, index: number) {
        this.rows.add(index, t);
        this.rowsFiltered.add(index, t);
        this.createAndInitModelRowCell(t);
    }

    public scrollIntoView(t: T) {
        let baseCell: BaseCell<any, any> = this.getRowCell(t);
        if (baseCell != null) baseCell.scrollInView();
    }

    /**
     *
     * @param {*} t
     */
    protected removeRow(t: T) {
        let cell: BaseCell<any, any> = this.getRowCell(t);
        if (cell != null) {
            cell.removeFromParent();
            this.visibleCells.remove(cell);
            this.rows.remove(t);
            this.rowsFiltered.remove(t);
        }
    }

    ensureVirtualScroll(): VirtualScroll {
        if (this.virtualScroll == null)
            this.virtualScroll = new VirtualScroll(this, this.view.getRootView());
        this.virtualScroll.scrollingStarts();
        return this.virtualScroll;
    }

    private removeScrollHandler() {
        if (this.virtualScroll != null)
            this.virtualScroll.removeScrollHandler();
    }

    public removeRows(list: java.util.List<T>) {
        this.getSelectionModel().setSelected(list, false, true);
        let listt: java.util.List<any> = <any>(new java.util.ArrayList<any>(list));
        let iter: java.util.Iterator<T> = listt.iterator();
        while (iter.hasNext()) {
            let t: T = iter.next();
            this.removeRow(t);
        }
    }

    /**
     *
     * @return {*}
     */
    getView(): W {
        return super.getView();
    }

    /**
     * For performance reasons instead of adding handlers to each cell
     * only one is added to a root component and intercept events from the cells.
     *
     * @param {*} handler Cell event handler
     * @return {*}
     */
    public addCellHandler(handler: EventHandler<any>): HandlerRegistration {
        let listener: EventListener = evt => {
            for (let index = this.getCells().iterator(); index.hasNext();) {
                let baseCell = index.next();
                if (baseCell.asElement().contains(((<Node>evt.target)))) {
                    handler.handleEvent(evt);
                }
            }
        };
        this.asElement().addEventListener(handler.getType(), listener);
        return {
            removeHandler: () => {
                this.asElement().removeEventListener(handler.getType(), listener);
            }
        } as HandlerRegistration;
    }


    public getCell(element: HTMLElement | Event): BaseCell<T, any> {
        if (element instanceof HTMLElement) {
            return this.getCellElement(element);
        } else if (element instanceof Event) {
            return this.getCellEvent(element);
        } else throw new Error('invalid overload');
    }

    private getCellElement(element: HTMLElement): BaseCell<T, any> {
        for (let index = this.getCells().iterator(); index.hasNext();) {
            let baseCell = index.next();
            if (baseCell.asElement().contains(element)) {
                return baseCell;
            }
        }
        return null;
    }

    public getCellEvent(evt: Event): BaseCell<T, any> {
        for (let index = this.getCells().iterator(); index.hasNext();) {
            let baseCell = index.next();
            if (baseCell.asElement().contains((<Node><any>evt.target))) {
                return baseCell;
            }
        }
        return null;
    }

    /**
     * Gets whether cells for this component can be editable.
     *
     * @return {boolean} <code>true</code> if the component is editable
     */
    public isEditable(): boolean {
        return this.editable;
    }

    /**
     * Sets whether this component can have editable cells {@link BaseCell}
     * <p>
     * After setting this value, call {@link #drawData()} to change takes an effect.
     * <p>
     * note: To enable cell editing, field {@link CellConfig#} must be defined.
     * see: {@link FieldSetter}
     * Also it is possible to turn on/of editing for individual columns see {@link CellConfig#}
     * <p>
     *
     * @param {boolean} editable <code>true</code> to enable editing, <code>false</code>
     * to disable it
     */
    public setEditable(editable: boolean) {
        this.editable = editable;
    }

    /**
     * Applies filters and sort data.
     * Filtered and sorted results are stored to {@link AbstractCellComponent#rowsFiltered}
     * while {@link AbstractCellComponent#rows} remains the same.
     */
    filterAndSort() {
        this.rowsFiltered.clear();
        let collect = this.rows.stream()
            .filter(this.onePredicate())
            .sorted(this.oneComparator())
            .collect(Collectors.toList<any>());
        this.rowsFiltered.addAll(collect);
    }

    /**
     * Creates unique comparator from comparators list {@link AbstractCellComponent#comparators}
     *
     * @return {*} {@link Comparator}
     */
    oneComparator(): java.util.Comparator<T> {
        let cc = (a: T, b: T): number => {
            return 0;
        };
        for (let index = this.comparators.iterator(); index.hasNext();) {
            let comp: Comparator<any> = index.next();
            cc = thenComparingOne(cc, comp);
        }
        return cc;
    }

    /**
     * Creates unique predicate from predicate list {@link AbstractCellComponent#filters}
     *
     * @return {*} {@link Predicate}
     */
    onePredicate(): Predicate<T> {
        return this.filters
            .stream()
            .reduce((p1: Predicate<any>, p2: Predicate<any>) => {
                return (t: T): boolean => {
                    return p1(t) && p2(t);
                };
            })
            .orElse(() => true);
    }

    /**
     * Registers filter. To apply registered filter either run {@link #drawData()}
     *
     * @param {*} predicate to be registered
     */
    // public addFilterr(filter: (p1: T) => boolean) {
    //     let v: Predicate<T> = filter;
    //     this.filters.add(v);
    // }

    public addFilter(predicate: Predicate<T> | Filter<T>) {
        if ((predicate as Filter<any>).fireFilterChange !== undefined) {
            this.filters.add((<Filter<T>>predicate).compare());
            (<Filter<T>>predicate).addFilterHandler(FilterHandler.onFilter(evt => this.drawData()));
        } else {
            this.filters.add(predicate);
        }

    }

    hasFilters(): boolean {
        return !this.filters.isEmpty();
    }

    /**
     * Gets all model items after applying filtering and sorting to {@link #rows}.
     * This list is sub-set of {@link #rows} which holds original model values.
     *
     * @return {*} list of filtered model items.
     */
    public getRowsFiltered(): java.util.List<T> {
        return this.rowsFiltered;
    }

    /**
     * Gets all filters registered to this component
     *
     * @return {*} filters
     */
    public getFilters(): java.util.List<any> {
        return this.filters;
    }

    /**
     * Removes filter from list of registered filters.
     * Call {@link #drawData()} to see changes.
     *
     * @param {events.filters.Filter} rowFilter
     */
    public removeFilter(rowFilter: Filter<any>) {
        this.filters.remove(rowFilter);
    }

    /**
     * Clears all registered filters of this component.
     * Call {@link #drawData()} to see changes.
     */
    public clearAllFilters() {
        this.filters.clear();
    }

    /**
     * Ads {@link Comparator} to comparator lists.
     *
     * @param {*} comparator
     * @see AbstractCellComponent#oneComparator() ()
     */
    protected addComparator(comparator: java.util.Comparator<T>) {
        this.comparators.add(<any>(comparator));
    }

    /**
     * Removes comparator from list.
     *
     * @param {*} comparator to remove
     */
    removeComparator(comparator: java.util.Comparator<T>) {
        this.comparators.remove(comparator);
    }

    /**
     * Clears all comparators.
     */
    clearComparators() {
        this.comparators.clear();
    }

    protected getComparators(): java.util.List<java.util.Comparator<any>> {
        return this.comparators;
    }

    newBlock() {
    }

    public getRowCellConfig(): CellConfig<T, M> {
        return this.ensureRowCellConfig();
    }

    public ensureRowCellConfig(): CellConfig<T, M> ;
    public ensureRowCellConfig(model: T): CellConfig<T, M> ;
    public ensureRowCellConfig(model?: T): CellConfig<T, M> {
        if (this.rowCellConfig == null)
            this.rowCellConfig = new CellConfig<T, M>().setFieldGetter(p1 => null);
        return this.rowCellConfig;
    }

    public resetScrollPosition() {
        this.getView().getRootView().resetScrollTop(null);
    }

    public resetScrollTo(value: number) {
        this.getView().getRootView().resetScrollTop(value);
    }

    public setScrollHeight(height: string) {
        this.view.getRootView().setScrollHeight(height);
    }

}

export interface Predicate<T> {
    (p1: T): boolean;
}

export interface HasPredicate<T> {
    compare(): Predicate<T>;
}

export interface HasRowsData<T> {
    getRowsData(): java.util.List<T>;

    drawData(): void;

    refreshSelections(): void;
}

export interface HasRowsDataList<T> extends HasRowsData<T> {
    addRow(t: T): void;

    insertRow(t: T, index: number): void;

    removeRow(t: T): void;

    setRowsData(rows: List<T>): void;
}

export interface HasTreeData<T> extends HasRowsData<TreeNode<T>> {
    setRoot(root: TreeNode<T>): void;

    getRoot(): TreeNode<T>;
}


export function thenComparing(fieldGetter: (p1: any) => number, keyComparator: Comparator<any>): Comparator<any> {
    return (a1, b1) => {
        return keyComparator.apply(this, [fieldGetter.apply(this, [a1]), fieldGetter.apply(this, [b1])]);
    };
}

export function thenComparingOne(thisComp: Comparator<any>, other: Comparator<any>): Comparator<any> {
    return (c1, c2) => {
        let res = thisComp.apply(this, [c1, c2]);
        return (res != 0) ? res : other.apply(this, [c1, c2]);
    };
}

export function reverseOrder(comp: Comparator<any>): Comparator<any> {
    return (a, b) => {
        return comp.apply(this, [b, a]);
    };
}
