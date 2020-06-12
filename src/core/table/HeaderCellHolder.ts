/**
 * Manages sorting,grouping and filtering by columns.
 * Fires corresponding event for each column operation.
 * Ui elements that deal with this operations should listen to {@link AbstractModifierEvent} events and update their
 * views accordingly i.e {@link AbstractHeaderCell} cells and bar panels {@link BaseBarPanel}
 *
 * @author nikolasavic
 * @param {Table} table
 * @param {TreeGroupBy} groupBy
 * @class
 */
import {Table, TreeGroupBy} from './Table';
import {EventHandler, HandlerRegistration, HasHandlers} from '../corecls/events';
import {java} from 'j4ts';
import {AbstractHeaderCell, ColumnConfig, SortingDirection} from './TableUtil';
import {Predicate, reverseOrder, thenComparingOne} from '../AbstractCellComponent';
import {Comparator, FilterUtil} from './FilterUtil';

import Collection = java.util.Collection;
import LinkedHashSet = java.util.LinkedHashSet;
import List = java.util.List;

export class HeaderCellHolder implements HasGroupByHandler, HasSortHandler, HasFilterHandler {

    multiSorting: boolean = false;

    multiFiltering: boolean = true;

    multiGrouping: boolean = true;

    headerSortingList = new LinkedHashSet<HeaderSorting>();

    filtersInOrder = new java.util.ArrayList<HeaderFiltering>();

    groupByInOrder = new LinkedHashSet<HeaderGrouping>();

    table: Table<any>;

    groupBy: TreeGroupBy<any>;


    constructor(table: Table<any>, groupBy: TreeGroupBy<any>) {
        this.table = table;
        this.groupBy = groupBy;
    }

    public addCell(cell: AbstractHeaderCell) {
        cell.setHeaderCellHolder(this);
    }

    public filtered(cell: HeaderFiltering) {
        this.sortOrFilter<any>(cell, this.filtersInOrder, this.multiFiltering);
        this.fireEvent(new FilterEvent(this.filtersInOrder));
        this.table.resetScrollTo(0.0);
    }

    public sorted(cell: HeaderSorting) {
        this.sortOrFilter<any>(cell, this.headerSortingList, this.multiSorting);
        this.fireEvent(new SortEvent(this.headerSortingList));
        this.table.resetScrollPosition();
    }

    public group(cell: HeaderGrouping) {
        this.sortOrFilter<any>(cell, this.groupByInOrder, this.multiGrouping);
        this.fireEvent(new GroupByEvent(this.groupByInOrder));
        this.table.resetScrollTo(0.0);
        //todo
        // this.table.groupBy.resetScrollTo(0.0);
    }

    private sortOrFilter<T extends HeaderWithModifiers<any>>(hm: T, list: java.util.Collection<T>, multi: boolean) {
        if (!list.contains(hm)) {
            if (!multi)
                list.clear();
            list.remove(hm);
            if (hm.getActiveModifier() != null)
                list.add(hm);
        } else if (hm.getActiveModifier() == null)
            list.remove(hm);
        this.table.drawData();
    }

    public filterData(): boolean {
        this.clearFiltersAndComparators();
        this.addFiltersAndComparators();
        if (!this.groupByInOrder.isEmpty()) {
            this.table.getGroupBy().groupBy2(this.groupByInOrder);
            return true;
        } else {
            if (this.groupBy != null)
                this.groupBy.clear();
        }
        return false;
    }

    public hasModifiers(): boolean {
        return !this.headerSortingList.isEmpty() || !this.filtersInOrder.isEmpty() || !this.groupByInOrder.isEmpty();
    }

    private clearFiltersAndComparators() {
        // this.table.getComparators().removeIf((e) => (e != null && e instanceof <any>ComparatorHc)); //todo ComparatorHc instead of clear all
        // this.table.getFilters().removeIf((e) => (e != null && e instanceof <any>PredicateHc)); //todo PredicateHc instead of clear all
        this.table.clearAllFilters();
        this.table.clearComparators();
    }

    private addFiltersAndComparators() {
        // if (!this.filtersInOrder.isEmpty())
        //     this.table.addFilter(this.oneFilter());
        if (!this.filtersInOrder.isEmpty()) {
            for (let index = this.filtersInOrder.iterator(); index.hasNext();) {
                let comp = index.next();
                this.table.addFilter(comp.getActiveModifier());
                // this.table.addComparator(comp.getActiveModifier());
            }
        }

        if (!this.headerSortingList.isEmpty()) {
            for (let index = this.headerSortingList.iterator(); index.hasNext();) {
                let comp = index.next();
                this.table.addComparator(comp.getActiveModifier());
            }
        }
    }

    public oneComparator(): java.util.Comparator<any> {
        let cc = (a: any, b: any): number => {
            return 0;
        };
        for (let index = this.headerSortingList.iterator(); index.hasNext();) {
            let comp: java.util.Comparator<any> = index.next().getActiveModifier();
            cc = thenComparingOne(cc, comp);
        }
        return cc;
    }

    public oneFilter(): any {
        return null;
    }

    public getGroupByList(): java.util.List<ColumnConfig<any, any>> {
        return <any>(this.groupByInOrder.stream().map<any>((h) => {
            return h.getActiveModifier();
        }).collect<any, any>(java.util.stream.Collectors.toList<any>()));
    }

    ensureHandlers(): HTMLElement {
        return this.table.asElement();
    }

    public getTable(): Table<any> {
        return this.table;
    }

    public addGroupByHandler(handler: GroupByHandler): HandlerRegistration {
        return handler.addTo(this.ensureHandlers());
    }

    public addSortHandler(handler: SortHandler): HandlerRegistration {
        return handler.addTo(this.ensureHandlers());
    }

    public addFilterHandler(handler: FilterHandler): HandlerRegistration {
        return handler.addTo(this.ensureHandlers());
    }

    public setMultiSorting(multiSorting: boolean) {
        this.multiSorting = multiSorting;
    }

    public isMultiSorting(): boolean {
        return this.multiSorting;
    }

    fireEvent(event: CustomEvent): void {
        this.ensureHandlers().dispatchEvent(event);
    }

}


export abstract class HeaderWithModifiers<T> {

    column: ColumnConfig<any, any>;

    //Null activeModifier means remove it

    private activeModifier: T = null;


    public constructor(column: ColumnConfig<any, any>) {
        this.column = column;
    }

    public getColumn(): ColumnConfig<any, any> {
        return this.column;
    }


    public getActiveModifier(): T {
        return this.activeModifier;
    }

    public setActiveModifier(activeModifier: T): void {
        this.activeModifier = activeModifier;
    }

    public equals(o: Object): boolean {
        if (this == o)
            return true;
        if (!(o instanceof HeaderWithModifiers))
            return false;
        let that = <HeaderWithModifiers<any>>o;
        return this.getColumn() == (that.getColumn());
    }


    public abstract copyFrom(headerWithModifiers: HeaderWithModifiers<T>): void;
}

export abstract class AbstractModifierEvent<T> extends CustomEvent<T> {

    protected modifiers: Collection<HeaderWithModifiers<any>>;

    protected constructor(type: string, modifiers: Collection<HeaderWithModifiers<any>>) {
        super(type);
        this.modifiers = modifiers;
    }


    public getModifiers(): Collection<HeaderWithModifiers<any>> {
        return this.modifiers;
    }

    public getByColumn(columnConfig: ColumnConfig<any, any>): HeaderWithModifiers<any> {
        return this.modifiers
            .stream()
            .filter(hg => hg.getColumn() == (columnConfig))
            .findFirst().orElse(null);
    }
}

export interface HasDirection {
    getSortingDirection(): SortingDirection;

    setSortingDirection(sortingDirection: SortingDirection): void;
}


//groupby event
export class GroupByEvent extends AbstractModifierEvent<GroupByHandler> {

    constructor(modifiers: LinkedHashSet<HeaderGrouping>) {
        super(GroupByHandler.TYPE, modifiers);
    }


    public getModifiers(): LinkedHashSet<HeaderGrouping> {
        return <LinkedHashSet<HeaderGrouping>>super.getModifiers();
    }


    public getByColumn(columnConfig: ColumnConfig<any, any>): HeaderGrouping {
        return <HeaderGrouping>super.getByColumn(columnConfig);
    }

}

export interface HasGroupByHandler extends HasHandlers {
    addGroupByHandler(handler: GroupByHandler): HandlerRegistration;
}

export abstract class GroupByHandler extends EventHandler<GroupByEvent> {
    public static readonly TYPE: string = 'tablegroupby';

    abstract onGroup(evt: GroupByEvent): void;

    handleEvent(evt: GroupByEvent): void {
        this.onGroup(evt);
    }

    getType(): string {
        return GroupByHandler.TYPE;
    }

    public static onGroup(c: (evt: GroupByEvent) => void): GroupByHandler {
        return new class extends GroupByHandler {
            onGroup = c;
        };
    }
}

export class HeaderGrouping extends HeaderWithModifiers<ColumnConfig<any, any>> implements HasDirection {

    private sortingDirection: SortingDirection;

    constructor(column: ColumnConfig<any, any>, sortingDirection?: SortingDirection) {
        super(column);
        if (sortingDirection == null)
            sortingDirection = SortingDirection.ASCENDING;
        this.setSortingDirection(sortingDirection);

    }


    public copyFrom(headerWithModifiers: HeaderWithModifiers<ColumnConfig<any, any>>): void {
        this.setActiveModifier(headerWithModifiers.getActiveModifier());
        this.setSortingDirection((<HeaderGrouping>headerWithModifiers).getSortingDirection());
    }


    public getSortingDirection(): SortingDirection {
        return this.sortingDirection;
    }


    public setSortingDirection(sortingDirection: SortingDirection): void {
        this.setActiveModifier(sortingDirection != null ? this.column : null);
        this.sortingDirection = sortingDirection;
    }

}

//end groupby event

//SortEvent event
export class SortEvent extends AbstractModifierEvent<SortHandler> {

    constructor(modifiers: LinkedHashSet<HeaderSorting>) {
        super(SortHandler.TYPE, modifiers);
    }


    public getModifiers(): LinkedHashSet<HeaderSorting> {
        return <LinkedHashSet<HeaderSorting>>super.getModifiers();
    }


    public getByColumn(columnConfig: ColumnConfig<any, any>): HeaderSorting {
        return <HeaderSorting>super.getByColumn(columnConfig);
    }

}

export interface HasSortHandler extends HasHandlers {
    addSortHandler(handler: SortHandler): HandlerRegistration;
}

export abstract class SortHandler extends EventHandler<SortEvent> {
    public static readonly TYPE: string = 'tablesort';

    abstract onSort(evt: SortEvent): void;

    handleEvent(evt: SortEvent): void {
        this.onSort(evt);
    }

    getType(): string {
        return SortHandler.TYPE;
    }

    public static onSort(c: (evt: SortEvent) => void): SortHandler {
        return new class extends SortHandler {
            onSort = c;
        };
    }
}

export class HeaderSorting extends HeaderWithModifiers<java.util.Comparator<any>> implements HasDirection {

    private sortingDirection: SortingDirection = SortingDirection.ASCENDING;

    constructor(column: ColumnConfig<any, any>, sortingDirection?: SortingDirection) {
        super(column);
        if (sortingDirection == null)
            sortingDirection = SortingDirection.ASCENDING;
        this.setSortingDirection(sortingDirection);

    }


    public copyFrom(headerWithModifiers: HeaderWithModifiers<java.util.Comparator<any>>): void {
        this.setActiveModifier(headerWithModifiers.getActiveModifier());
        this.setSortingDirection((<HeaderSorting>headerWithModifiers).getSortingDirection());
    }


    public getSortingDirection(): SortingDirection {
        return this.sortingDirection;
    }


    public setSortingDirection(sortingDirection: SortingDirection): void {
        this.setActiveModifier(sortingDirection != null ? sortingDirection == SortingDirection.ASCENDING ?
            this.column.getComparator() : reverseOrder(this.column.getComparator()) : null);
        this.sortingDirection = sortingDirection;
    }

}

//end SortEvent event

//FilterEvent event
export class FilterEvent extends AbstractModifierEvent<FilterHandler> {

    constructor(modifiers: Collection<HeaderFiltering>) {
        super(FilterHandler.TYPE, modifiers);
    }


    public getModifiers(): List<HeaderFiltering> {
        return <List<HeaderFiltering>>super.getModifiers();
    }


    public getByColumn(columnConfig: ColumnConfig<any, any>): HeaderFiltering {
        return <HeaderFiltering>super.getByColumn(columnConfig);
    }

}

export interface HasFilterHandler extends HasHandlers {
    addFilterHandler(handler: FilterHandler): HandlerRegistration;
}

export abstract class FilterHandler extends EventHandler<FilterEvent> {
    public static readonly TYPE: string = 'tablefilter';

    abstract onFilter(evt: FilterEvent): void;

    handleEvent(evt: FilterEvent): void {
        this.onFilter(evt);
    }

    getType(): string {
        return FilterHandler.TYPE;
    }

    public static onFilter<T>(c: (evt: FilterEvent) => void): FilterHandler {
        return new class extends FilterHandler {
            onFilter = c;
        };
    }
}


export class HeaderFiltering extends HeaderWithModifiers<Predicate<any>> {

    private userEnteredValue: Object;
    comparator: Comparator<any, any>;
    or: boolean;

    constructor(column: ColumnConfig<any, any>, userEnteredValue?: Object, comparator?: Comparator<any, any>) {
        super(column);
        this.setUserEnteredValue(userEnteredValue, comparator);
    }


    public copyFrom(headerWithModifiers: HeaderWithModifiers<Predicate<any>>): void {
        this.setActiveModifier(headerWithModifiers.getActiveModifier());
    }


    public setUserEnteredValue(userEnteredValue: Object, comparator: Comparator<any, any>): void {
        this.userEnteredValue = userEnteredValue;
        this.comparator = comparator;
        if (userEnteredValue == null && !FilterUtil.isEmptyComparator(comparator))
            this.setActiveModifier(null);
        else if (comparator != null)
            this.setActiveModifier(p1 => comparator.compare()(this.column.getFieldGetter()(p1), userEnteredValue));
    }

    public getUserEnteredValue(): Object {
        return this.userEnteredValue;
    }

    public getComparator(): Comparator<any, any> {
        return this.comparator;
    }

    public setOr(or: boolean): void {
        this.or = or;
    }

    public isOr(): boolean {
        return this.or;
    }


}

//end FilterEvent event

export class ComparatorHc<M> {
    comparator: java.util.Comparator<M>;

    public constructor(comparator: java.util.Comparator<M>) {
        if (this.comparator === undefined)
            this.comparator = null;
        this.comparator = <any>(comparator);
    }

    public compare(o1: M, o2: M): number {
        return this.comparator(o1, o2);
    }
}
