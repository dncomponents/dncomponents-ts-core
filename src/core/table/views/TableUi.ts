import {ComponentUi, View} from '../../corecls/View';
import {BaseCellView} from '../../corecls/BaseCellView';
import {CellView} from '../../corecls/CellView';
import {IsElement} from '../../corecls/IsElement';
import {ListView} from '../../list/ListUi';
import {HasValue, ValueChangeHandler} from '../../corecls/ValueClasses';
import {ClickHandler, HasOpenHandlers, SelectionHandler} from '../../corecls/handlers';
import {HasRowsDataList} from '../../AbstractCellComponent';
import {CellEditor} from '../../CellEditor';
import {Comparator} from '../FilterUtil';
import {HeaderFiltering, HeaderGrouping, HeaderSorting, HeaderWithModifiers} from '../HeaderCellHolder';
import {java} from 'j4ts';
import {DefaultMultiSelectionModel} from '../../corecls/selectionmodel/selectionImpl';
import {FilterValueHandler, HasFilterValue} from '../FilterPanel';
import {ColumnConfig, SortingDirection} from '../TableUtil';
import {TreeUi} from '../../tree/view/TreeUi';

// import Comparator = java.util.Comparator;

export interface TableUi extends ComponentUi<TableView> {
    getRowTableCellView(): TableRowView;

    getTableCellView(): BaseCellView;

    getTableCellRowExpanderView(): BaseCellView;

    getHeaderTableSortCellView(): HeaderTableSortCellView;

    getHeaderTableTextCellView(): HeaderTableTextCellView;

    getHeaderTableMenuCellView(): HeaderTableMenuCellView;

    getFooterCellView(): CellView;

    getTableBarUi(): TableBarUi;

    getCheckBoxHeaderCellView(): CheckBoxHeaderTableCellView;

    getGTreeGroupByUi(): TreeUi;

    getTableCellCheckBoxView(): TableCellCheckBoxView;

    getHeaderTableMenuFilterView(): HeaderTableFilterCellView;

    getFilterPanelView(): FilterPanelView<any>;
}

export interface TableView extends TreeView {
    setColumnWidth(column: number, width: string): void;

    setHeaderColumnWidth(column: number, width: string): void;

    clearHeaders(): void;

    addHeaderItem(headerCell?: Element): void;

    setHeaderBar(bar: IsElement<any>, size: number): void;

    insertAfter(rowTable: IsElement<any>, size: number): HTMLElement;

    addItemToRowColSpan(toAdd: IsElement<any>, colSize: number): HTMLElement;

    setPager(pager: IsElement<any>): void;

    addFooterItem(element: IsElement<any>): void;

    clearFooter(): void;

    setFooterColumnWidth(j: number, columnWidth: string): void;

    getHeaderRow(): HTMLElement;

    getFooterRow(): HTMLElement;

    initFilteringHeader(): void;
}

export interface TreeView extends ListView {
}

export interface RowDetailsCellView extends BaseCellView {
    setOpened(b: boolean): void;
}

export interface TableRowView extends BaseCellView {
    addRow(widget: Element, columnSize: number): void;

    addColumn(element: Element): void;

    clearCells(): void;
}

export interface HeaderTableSortCellView extends HeaderTableTextCellView, HasText {
    setSorted(direction: SortingDirection): void;

    isActive(): boolean;

    setActive(b: boolean): void;

    setSortPresenter(presenter: SortPresenter): void;

    setSortIconText(iconText: string): void;

    setGroupOrder(order: number): void;
}

export interface HeaderTableTextCellView extends CellView {
    setText(text: string): void;
}

export interface HeaderTableMenuCellView extends HeaderTableSortCellView {
    setColumn(column: ColumnConfig<any, any>): void;

    setGroupedBy(direction: SortingDirection): void;

    setFiltered(b: HeaderFiltering): void;

    setPresenter(presenter: HeaderTableMenuCellViewPresenter): void;
}

export interface HeaderTableMenuCellViewPresenter extends SortPresenter, FilterValueHandler<any> {
    groupBy(direction: SortingDirection): void;
}

export interface TableBarView extends View {
    add(element: HTMLElement | IsElement<any>): void;
}


export interface TableBarUi extends ComponentUi<TableBarView> {
    getGroupByBarPanelUi(): GroupByBarPanelUi;

    getSortBarPanelUi(): SortBarPanelUi;

    getFilterBarPanelUi(): FilterBarPanelUi;

    getColumnChooseBarPanelView(): ColumnChooseBarPanelView;
}

export interface CheckBoxHeaderTableCellView extends HeaderTableTextCellView {
    getCheckBox(): HasValue<boolean>;
}


export interface TableCellCheckBoxView extends BaseCellView {
    getCheckbox(): HasValue<boolean>;
}

export interface HeaderTableFilterCellView extends HeaderTableSortCellView {
    setFilterPanel(filterPanel: IsElement<any>): void;

    setFilterIconVisible(b: boolean): void;
}

export interface FilterPanelView<T> extends View {
    getComparatorHasValue(): HasValue<Comparator<any, any>>;

    getComparatorHasRowsData(): HasRowsDataList<Comparator<any, any>>;

    addClearClickHandler(clickHandler: ClickHandler): void;

    showClearElement(b: boolean): void;

    getValueComponent(): CellEditor<T>;

    setValueComponent<T>(clazz?: any): any;
}

export interface HasText {
    getText(): string;

    setText(text: string): void;
}

export interface SortPresenter {
    sort(currentDirection: SortingDirection): void;
}

export interface PagerView extends View {
    setText(s: string): void;

    setPresenter(presenter: PagerViewPresenter): void;

    setPageNumber(pageNumber: number): void;

    enablePrevious(b: boolean): void;

    enableNext(b: boolean): void;
}

export interface PagerViewPresenter {
    previous(): void;

    next(): void;

    first(): void;

    last(): void;

    setCurrentPage(page: number): void;
}

export interface PagerItemView extends View {
    setText(str: string): void;

    setActive(b: boolean): void;
}

export interface PagerUi<V extends PagerView> extends ComponentUi<V> {
    getPagerItemView(): PagerItemView;
}

export interface PagerWithListView extends PagerView {
    setNumberOfPages(numberOfPages: number): void;

    update(itemsList: java.util.ArrayList<number>): void;

    addItem(element: IsElement<any>): void;

    clear(): void;
}

export interface PagerListUi extends PagerUi<PagerWithListView> {
}

export interface BaseBarPanelView<T extends HeaderWithModifiers<any>> extends View {
    setColor(barColor: string): void;

    setDropDownTitle(dropDownTitle: string): void;

    addBarItem(barItem: IsElement<any>): void;

    initColumns(columns: java.util.List<ColumnConfig<any, any>>): void;

    clear(): void;

    setPresenter(sortBarPanel: BaseBarPanelViewPresenter<T>): void;

    update(size: number): void;

    getLabel(): IsElement<any>;
}


export interface BaseBarPanelViewPresenter<T extends HeaderWithModifiers<any>> {
    modify(modifier: T): void;

    loadColumnsDropDown(): void;

    addItemToBarPanel(column: ColumnConfig<any, any>): void;
}

export interface SortBarPanelView extends BaseBarPanelView<HeaderSorting> {
}

export interface SortBarPanelUi extends ComponentUi<SortBarPanelView> {
    getSortBarItemView(): SortBarItemView;
}

export interface SortBarItemView extends BarItemView {
    addSelectionHandler(handler: SelectionHandler<SortingDirection>): void;

    setDirection(ascending: SortingDirection): void;
}

export interface BarItemView extends View {
    addToPanel(element: IsElement<any>): void;

    addDeleteHandler(clickHandler: ClickHandler): void;

    setActionLabel(text: string): void;

    setActionAndOr(): void;

    setColumnName(columnName: string): void;

    clear(): void;
}

export interface GroupByBarPanelUi extends ComponentUi<GroupByBarPanelView> {
    getSortBarItemView(): SortBarItemView;
}

export interface GroupByBarPanelView extends BaseBarPanelView<HeaderGrouping> {
    addExpandAllHandler(handler: ValueChangeHandler<boolean>): void;
}

export interface ColumnChooseBarPanelView extends View {
    getLabel(): IsElement<any>;

    getSelectionModel(): DefaultMultiSelectionModel<any>;

    getHasRows(): HasRowsDataList<ColumnConfig<any, any>>;

    getPopupShowHandler(): HasOpenHandlers<any>;

    update(diff: number): void;
}

export interface FilterBarPanelView extends BaseBarPanelView<HeaderFiltering> {

}

export interface FilterBarPanelUi extends ComponentUi<FilterBarPanelView> {
    getFilterBarItemView(): FilterBarItemView;
}

export interface FilterBarItemView extends BarItemView {
    setFilterComponent(element: HasFilterValue<any>): void;

    getFilterComponent(): HasFilterValue<any>;

    getOrHandler(): HasValue<boolean>;
}