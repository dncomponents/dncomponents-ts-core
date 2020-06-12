import {AbstractCellComponent, HasRowsDataList} from '../AbstractCellComponent';
import {java} from 'j4ts';
import {
    BarItemView,
    BaseBarPanelView,
    BaseBarPanelViewPresenter,
    ColumnChooseBarPanelView,
    FilterBarItemView,
    FilterBarPanelUi,
    FilterBarPanelView,
    GroupByBarPanelUi,
    GroupByBarPanelView,
    SortBarItemView,
    SortBarPanelUi,
    SortBarPanelView,
    TableBarUi,
    TableUi
} from './views/TableUi';
import {
    AbstractFooterCell,
    AbstractHeaderCell,
    ColumnConfig,
    HeaderTableFilterCell,
    HeaderTableTextCell,
    RowTable,
    RowTableBuilder,
    SortingDirection,
    TableCell,
    TableCellFactory
} from './TableUtil';
import {Pager} from './Pager';
import {
    FilterHandler,
    GroupByHandler,
    HasDirection,
    HeaderCellHolder,
    HeaderFiltering,
    HeaderGrouping,
    HeaderSorting,
    HeaderWithModifiers,
    SortHandler
} from './HeaderCellHolder';
import {BaseComponent} from '../BaseComponent';
import {ComponentUi} from '../corecls/View';
import {IsElement} from '../corecls/IsElement';
import {
    ClickHandler,
    CloseHandler,
    HasCloseHandlers,
    HasOpenHandlers,
    OpenHandler,
    SelectionHandler
} from '../corecls/handlers';
import {ValueChangeHandler} from '../corecls/ValueClasses';
import {FilterPanel} from './FilterPanel';
import {FilterUtil} from './FilterUtil';
import {CellFactory} from '../corecls/CellFactory';
import {CellContext} from '../corecls/CellContext';
import {BaseCell, RendererContext} from '../BaseCell';
import {EventHandler, HandlerRegistration} from '../corecls/events';
import {CellConfig} from '../CellConfig';
import {Ui} from '../views/Ui';
import {ComponentHtmlParser} from '../ComponentHtmlParser';
import {ItemId, RowItemId} from '../corecls/entities';
import {ListTreeMultiSelectionModel} from '../list/ListTreeMultiSelectionModel';
import {TreeTableColumnConfig} from '../treetable/TreeTableColumnConfig';
import {TreeNode} from '../tree/TreeNode';
import {getAllNodesAtLevel} from '../tree/Node';
import {TreeLogic} from '../tree/Tree';
import {TreeMultiSelectionModel} from '../tree/TreeMultiSelectionModel';
import {AbstractTableTreeCell} from './column/AbstractTableTreeCell';
import {TableTreeUi} from './TableTreeUi';
import ArrayList = java.util.ArrayList;
import IntStream = java.util.stream.IntStream;
import Collections = java.util.Collections;
import List = java.util.List;
import Comparator = java.util.Comparator;
import Collectors = java.util.stream.Collectors;

export class Table<T> extends AbstractCellComponent<T, List<any>, TableUi> implements HasRowsDataList<T> {

    public groupBy: TreeGroupBy<any>;

    public getGroupBy(): TreeGroupBy<any> {
        if (this.groupBy == null)
            this.groupBy = new TreeGroupBy(this);
        return this.groupBy;
    }

    pager: Pager<any>;
    protected columnConfigs = new ArrayList<ColumnConfig<any, any>>();
    public headerCellHolder: HeaderCellHolder = new HeaderCellHolder(this, this.groupBy);

    protected tableBar: TableBar;
    valueCellFactory: CellFactory<AbstractCellComponent<any, any, any>, any, any>;

    constructor();
    constructor(view?: TableUi) ;
    constructor(view?: TableUi) {
        super(view ? view : Ui.get().getTableUi());
        this.init();
    }

    private init(): void {
        this.setSelectionModel(new ListTreeMultiSelectionModel(<any>this, this.view.getRootView()));
        /** // @ts-ignore */
        // @ts-ignore
        this.defaultCellFactory = new class implements RowTableCellFactory<T> {
            /** // @ts-ignore */
            // @ts-ignore
            getCell(c: CellContext<T, List<any>, Table<T>>): RowTable<T> {
                return new RowTable<T>();
            }
        };
        this.valueCellFactory = {
            getCell(c: CellContext<AbstractCellComponent<any, any, any>, any, any>): BaseCell<AbstractCellComponent<any, any, any>, any> {
                /** // @ts-ignore */
                // @ts-ignore
                return new TableCell<any, any>();
            }
        };
        this.ensureRowCellConfig().setCellFactory(new class implements CellFactory<T, List<any>, any> {
            getCell(c: CellContext<T, List<any>, any>): BaseCell<T, List<any>> {
                /** // @ts-ignore */
                // @ts-ignore
                return new RowTable<any>();
            }
        });

    }

    rowExpanderList: List<T> = new ArrayList<T>();

    // popup editing
    private popupEditing: boolean;

    public drawData(): void {
        if (this.pager != null)
            this.pager.recalculate();
        this.addHeader();
        this.addFooter();
        this.setColumnWidths();
        if (this.headerCellHolder.filterData()) {
            return;
        }
        if (this.groupBy != null)
            this.groupBy.ensureVirtualScroll().setEnabled(false);
        this.ensureVirtualScroll().setEnabled(true);
        super.drawData();
    }

    public drawHeader(): void {
        this.addheader = false;
    }

    //header
    headerItems: List<AbstractHeaderCell> = new ArrayList<AbstractHeaderCell>();

    //header is added only once. For situation where we need to update header call it explicitly.
    protected addheader: boolean;

    protected addHeader(): void {
        if (this.addheader)
            return;
        this.addheader = true;
        this.headerItems.clear();
        this.view.getRootView().clearHeaders();
        for (let i = 0; i < this.columnConfigs.size(); i++) {
            let config = this.columnConfigs.get(i);
            if (!config.isVisible()) continue;
            this.initHeader(config);
        }
        if (this.headerRenderer != null) {
            this.view.getRootView().getHeaderRow().innerHTML = '';
            this.headerRenderer.render(this.view.getRootView().getHeaderRow(), this.headerItems, this);
        }
    }

    private initHeader(config: ColumnConfig<any, any>): void {
        let headerCell = config.getHeaderCellFactory().getCell();
        this.headerCellHolder.addCell(headerCell);
        /** // @ts-ignore */
        // @ts-ignore
        AbstractCellComponent.initCell(headerCell, new Object(), config, this);
        this.headerItems.add(headerCell);
        this.view.getRootView().addHeaderItem(headerCell.asElement());
        if (headerCell instanceof HeaderTableFilterCell) {
            this.view.getRootView().initFilteringHeader();
        }
        headerCell.draw();
    }

    protected addFooter(): void {
        let footerCells = new ArrayList<AbstractFooterCell<any, any>>();
        this.view.getRootView().clearFooter();
        if (this.columnConfigs.stream().anyMatch(cc => cc.getFooterCellFactory() != null))
            for (let index = this.columnConfigs.iterator(); index.hasNext();) {
                let config = index.next();
                if (!config.isVisible()) continue;
                let footerCellFactory = config.getFooterCellFactory();
                if (footerCellFactory == null)
                    footerCellFactory = config.getDefaultFooterCellFactory();
                let tableFooterCell = footerCellFactory.getCell();
                footerCells.add(tableFooterCell);
                /** // @ts-ignore */
                // @ts-ignore
                AbstractCellComponent.initCell(tableFooterCell, new Object(), config, this);
                this.view.getRootView().addFooterItem(tableFooterCell);
                tableFooterCell.draw();
            }
        if (this.footerRenderer != null) {
            this.view.getRootView().getFooterRow().innerHTML = '';
            this.footerRenderer.render(this.view.getRootView().getFooterRow(), footerCells, this);
        }
    }

    public isPopupEditing(): boolean {
        return this.popupEditing;
    }

    public setPopupEditing(popupEditing: boolean): void {
        this.popupEditing = popupEditing;
    }

    filterBar: boolean;

    public setControlBar(): void {
        if (this.filterBar)
            return;
        this.filterBar = true;
        if (this.tableBar == null)
            this.tableBar = new TableBar(this.headerCellHolder, this.getView().getTableBarUi(), this.getView());
        this.view.getRootView().setHeaderBar(this.tableBar, this.getColumnConfigs().size());
    }

    private getVisibleColumnsSize(): number {
        return this.columnConfigs.stream().filter(e => e.isVisible()).count();
    }

    private setColumnWidths(): void {
        for (let i = 0; i < this.getVisibleColumnsSize(); i++) {
            this.view.getRootView().setColumnWidth(i, this.columnConfigs.get(i).getColumnWidth());
            this.view.getRootView().setHeaderColumnWidth(i, this.columnConfigs.get(i).getColumnWidth());
            this.view.getRootView().setFooterColumnWidth(i, this.columnConfigs.get(i).getColumnWidth());
        }
    }

    protected displayFilteredData(): void {
        if (this.pager != null)//if pager is on
            IntStream.range(this.pager.getFrom(), this.pager.getTo())
                .limit(this.rowsFiltered.size())
                .forEach(i => this.createAndInitModelRowCell(this.rowsFiltered.get(i)));
        else
            this.displayFilteredDataInVirtualScroll();
    }

    public addColumn(...columns: ColumnConfig<T, any>[]) {
        Collections.addAll<any>(this.columnConfigs, ...columns);
    }

    public getColumnConfigs(): List<ColumnConfig<any, any>> {
        return this.columnConfigs;
    }

    public setMultiSorting(multiSorting: boolean) {
        this.headerCellHolder.setMultiSorting(multiSorting);
    }

    public isMultiSorting(): boolean {
        return this.headerCellHolder.isMultiSorting();
    }

    /** // @ts-ignore */
    // @ts-ignore
    public getRowCell(row: T | number): RowTable<T> {
        return <RowTable<T>><unknown>super.getRowCell(row);
    }

    public getComparators(): List<java.util.Comparator<any>> {
        return super.getComparators();
    }

    public addComparator(comparator: java.util.Comparator<T>) {
        super.addComparator(comparator);
    }

    /** // @ts-ignore */
    // @ts-ignore
    public getCells(): List<RowTable<T>> {
        return <List<RowTable<T>>><unknown>super.getCells();
    }

    public addRowHandler(handler: EventHandler<any>): HandlerRegistration {
        // let listener: EventListener = (evt) => {
        //     console.log(evt.target);
        //     for (let i = 0; i < this.getCells().size(); i++) {
        //         let rowTable = this.getCells().get(i);
        //         if ((rowTable.asElement() == evt.target) || rowTable.asElement().contains((<Node>evt.target))) {
        //             handler.handleEvent(evt);
        //         }
        //     }
        // };
        let self = this;
        // this.asElement().addEventListener('mouseenter',ev => {
        //     console.log(ev.target);
        // });
        this.asElement().addEventListener(handler.getType(), function (evt) {
            for (let i = 0; i < self.getCells().size(); i++) {
                let rowTable = self.getCells().get(i);
                if ((rowTable.asElement() === evt.target) || rowTable.asElement().contains((<Node>evt.target))) {
                    console.log(evt.target);
                    handler.handleEvent(evt);
                }
            }
        }, false);
        // return new class implements HandlerRegistration {
        //     removeHandler(): void {
        //         self.asElement().removeEventListener(handler.getType(), listener);
        //     }
        // };
        return null;
    }

    public addCellHandler(handler: EventHandler<any>): HandlerRegistration {
        let listener: EventListener = (evt) => {
            if (this.getCell(evt) != null) {
                handler.handleEvent(evt);
            }
        };
        let self = this;
        this.asElement().addEventListener(handler.getType(), listener);
        return new class implements HandlerRegistration {
            removeHandler(): void {
                self.asElement().removeEventListener(handler.getType(), listener);
            }
        };
    }

    public setSingleExpandRow(b: boolean) {
        // TableCellRowExpander.singleExpand = b;
        let last: T = null;
        if (!this.rowExpanderList.isEmpty())
            last = this.rowExpanderList.get(this.rowExpanderList.size() - 1);
        if (b) {
            this.rowExpanderList.clear();
            this.rowExpanderList.add(last);
        }
        this.drawData();
    }

    public getRowCellEvent(evt: Event): RowTable<T> {
        for (let index1 = this.getCells().iterator(); index1.hasNext();) {
            let rowTable = index1.next();
            if ((rowTable.asElement() === evt.target) || rowTable.asElement().contains((<Node>evt.target))) {
                return <any>rowTable;
            }
        }
        return null;
    }

    public getCellEvent(evt: Event): BaseCell<T, any> {
        let cell;
        this.getCells().forEach(tRowTable => {
            /** // @ts-ignore */
            // @ts-ignore
            tRowTable.getCells().forEach(tableCell => {
                if (tableCell.asElement().contains(<Node>evt.target)) {
                    cell = tableCell;
                }
            });
        });
        return cell;
    }


    private headerRenderer: HeaderRenderer<any>;

    private footerRenderer: FooterRenderer<any>;

    public setHeaderRenderer(headerRenderer: HeaderRenderer<T>) {
        this.headerRenderer = headerRenderer;
    }

    public setFooterRenderer(footerRenderer: FooterRenderer<T>) {
        this.footerRenderer = footerRenderer;
    }

    public setPager(pager: Pager<any>) {
        this.pager = pager;
        /** // @ts-ignore */
        // @ts-ignore
        pager.setOwner(this);
        this.view.getRootView().setPager(pager);
    }

    getView(): TableUi {
        return super.getView();
    }

    /** // @ts-ignore */
    // @ts-ignore
    public getRowCellConfig(): TableRowCellConfig<T, List<any>> {
        return <TableRowCellConfig<T, List<any>>><unknown>super.getRowCellConfig();
    }

    protected ensureRowCellConfig(): CellConfig<T, List<any>> {
        if (this.rowCellConfig == null) {
            /** // @ts-ignore */
            // @ts-ignore
            this.rowCellConfig = new TableRowCellConfig<T, any>();
        }
        return this.rowCellConfig;
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

export class TableBar extends BaseComponent<Object, TableBarUi> {

    public sortBarPanel: SortBarPanel;
    public groupByBarPanel: GroupByBarPanel;
    public columnChoosePanel: ColumnChooseBarPanel;
    public filterBarPanel: FilterBarPanel;
    headerCellHolder: HeaderCellHolder;

    public constructor(h: HeaderCellHolder, ui: TableBarUi, filterPanelView: TableUi) {
        super(ui);
        this.headerCellHolder = h;
        this.columnChoosePanel = new ColumnChooseBarPanel(h.getTable(), this.getView().getColumnChooseBarPanelView());
        this.sortBarPanel = new SortBarPanel(this.headerCellHolder, this.getView().getSortBarPanelUi());
        this.groupByBarPanel = new GroupByBarPanel(this.headerCellHolder, this.getView().getGroupByBarPanelUi());
        this.filterBarPanel = new FilterBarPanel(this.headerCellHolder, this.getView().getFilterBarPanelUi(), filterPanelView);
        this.view.getRootView().add(this.sortBarPanel.getLabel());
        this.view.getRootView().add(this.groupByBarPanel.getLabel());
        this.view.getRootView().add(this.filterBarPanel.getLabel());
        this.view.getRootView().add(this.columnChoosePanel.getLabel());
    }
}

export abstract class BaseBarPanel<M extends HeaderWithModifiers<any>, T extends BaseBarPanelView<M>>
    extends BaseComponent<Object, ComponentUi<T>> implements BaseBarPanelViewPresenter<M> {
    protected headerCellHolder: HeaderCellHolder;

    public constructor(ui: ComponentUi<T>, cellHolder: HeaderCellHolder) {
        super(ui);
        this.headerCellHolder = cellHolder;
        this.view.getRootView().setPresenter(this);
    }


    private getColumnsName(): List<ColumnConfig<any, any>> {
        return this.headerCellHolder.getTable().getColumnConfigs();
    }


    public loadColumnsDropDown(): void {
        this.view.getRootView().initColumns(this.getColumnsName());
    }

    public getLabel(): IsElement<any> {
        return this.view.getRootView().getLabel();
    }

    public setHeaderCellHolder(headerCellHolder: HeaderCellHolder): void {
        this.headerCellHolder = headerCellHolder;
    }

    abstract addItemToBarPanel(column: ColumnConfig<any, any>): void ;

    abstract modify(modifier: M): void ;
}


export class SortBarPanel extends BaseBarPanel<HeaderSorting, SortBarPanelView> {

    private static DROP_DOWN_TITLE = 'Columns to sort';

    public constructor(cellHolder: HeaderCellHolder, pui: SortBarPanelUi) {
        super(pui, cellHolder);
        this.init();
    }

    private init(): void {
        this.view.getRootView().setDropDownTitle(SortBarPanel.DROP_DOWN_TITLE);
        this.headerCellHolder.addSortHandler(SortHandler.onSort(event => {
            this.view.getRootView().clear();
            this.view.getRootView().update(event.getModifiers().size());
            let first = true;
            for (let index = event.getModifiers().iterator(); index.hasNext();) {
                let headerSorting = index.next();
                let directionBarItem = new DirectionBarItem(this.getUi().getSortBarItemView(), headerSorting, this, first ? 'Sorted by' : 'then by');
                this.view.getRootView().addBarItem(directionBarItem);
                first = false;
            }
        }));
    }

    public modify(modifier: HeaderSorting): void {
        this.headerCellHolder.sorted(modifier);
    }

    public addItemToBarPanel(column: ColumnConfig<any, any>): void {
        this.headerCellHolder.sorted(new HeaderSorting(column));
    }

    protected getUi(): SortBarPanelUi {
        return <SortBarPanelUi>super.getView();
    }
}

export class BarItem<T extends HeaderWithModifiers<any>, V extends BarItemView> extends BaseComponent<T, V> {

    protected baseBarPanel: BaseBarPanel<any, any>;

    public constructor(view: V, header: T, baseBarPanel: BaseBarPanel<any, any>) {
        super(view);
        this.baseBarPanel = baseBarPanel;
        this.userObject = header;
        view.setColumnName(header.getColumn().getColumnName());
        view.addDeleteHandler(ClickHandler.onClick(evt => this.delete()));
    }

    protected modified(): void {
        this.baseBarPanel.modify(this.userObject);
    }

    protected delete(): void {
        this.userObject.setActiveModifier(null);
        this.baseBarPanel.modify(this.userObject);
    }

    protected getBarPanel(): BaseBarPanel<any, any> {
        return this.baseBarPanel;
    }
}

export class DirectionBarItem<T extends HeaderWithModifiers<any> & HasDirection> extends BarItem<T, SortBarItemView> {

    public constructor(barItemView: SortBarItemView, header: T, baseBarPanel: BaseBarPanel<any, any>, text: string) {
        super(barItemView, header, baseBarPanel);
        this.view.setActionLabel(text);
        this.view.addSelectionHandler(SelectionHandler.onSelection(evt => {
            header.setSortingDirection(evt.selection);
            this.modified();
        }));
        this.view.setDirection(header.getSortingDirection());
    }

}


export class GroupByBarPanel extends BaseBarPanel<HeaderGrouping, GroupByBarPanelView> {

    private static DROP_DOWN_TITLE = 'Columns to group';

    public constructor(cellHolder: HeaderCellHolder, pui: GroupByBarPanelUi) {
        super(pui, cellHolder);
        this.init();
    }

    private init(): void {
        this.view.getRootView().setDropDownTitle(GroupByBarPanel.DROP_DOWN_TITLE);
        this.headerCellHolder.addGroupByHandler(GroupByHandler.onGroup(event => {
            this.view.getRootView().clear();
            this.view.getRootView().update(event.getModifiers().size());
            let first = true;
            for (let index = event.getModifiers().iterator(); index.hasNext();) {
                let headerGrouping = index.next();
                let directionBarItem = new DirectionBarItem(this.getUi().getSortBarItemView(), headerGrouping, this, first ? 'Group by' : 'then by');
                this.view.getRootView().addBarItem(directionBarItem);
                first = false;
            }
        }));
        this.view.getRootView().addExpandAllHandler(ValueChangeHandler.onValueChange(event => {
            this.headerCellHolder.getTable().groupBy.expandAll(event.value);
            this.headerCellHolder.getTable().groupBy.drawData();
        }));
    }

    public modify(modifier: HeaderGrouping): void {
        this.headerCellHolder.group(modifier);
    }

    public addItemToBarPanel(column: ColumnConfig<any, any>): void {
        this.headerCellHolder.group(new HeaderGrouping(column));
    }

    protected getUi(): GroupByBarPanelUi {
        return <GroupByBarPanelUi>super.getView();
    }
}

export class ColumnChooseBarPanel extends BaseComponent<Object, ColumnChooseBarPanelView> {

    table: Table<Object>;

    public constructor(table: Table<Object>, view: ColumnChooseBarPanelView) {
        super(view);
        this.table = table;
        this.bind();
    }

    private bind(): void {
        this.view.getSelectionModel().addSelectionHandler(SelectionHandler.onSelection<List<any>>(evt => {
            this.table.getColumnConfigs()
                .forEach(p1 => {
                    p1.setVisible(evt.selection.contains(p1));
                });
            this.table.drawHeader();
            this.table.drawData();
            this.view.update(this.table.getColumnConfigs().size() - evt.selection.size());
        }));
        this.view.getPopupShowHandler().addOpenHandler(OpenHandler.onOpen(evt => {
            this.view.getHasRows().setRowsData(this.table.getColumnConfigs());
            for (let i = 0; i < this.table.getColumnConfigs().size(); i++) {
                let c = this.table.getColumnConfigs().get(i);
                this.view.getSelectionModel().setSelected(c, c.isVisible(), false);
            }
            this.view.getHasRows().drawData();
        }));

    }


    public getLabel(): IsElement<any> {
        return this.view.getLabel();
    }
}

export class FilterBarPanel extends BaseBarPanel<HeaderFiltering, FilterBarPanelView> {
    static DROP_DOWN_TITLE: string = 'Columns to filter';

    sender: FilterBarItem;

    barItems: List<FilterBarItem> = new ArrayList<FilterBarItem>();

    tableUi: TableUi;

    public constructor(cellHolder: HeaderCellHolder, pui: FilterBarPanelUi, tableUi: TableUi) {
        super(pui, cellHolder);
        this.tableUi = tableUi;
        this.init();
    }


    private init() {
        this.view.getRootView().setDropDownTitle(FilterBarPanel.DROP_DOWN_TITLE);
        this.headerCellHolder.addFilterHandler(FilterHandler.onFilter(evt => {
            this.view.getRootView().update(evt.getModifiers().size());
            for (let i = 0; i < evt.getModifiers().size(); i++) {
                let headerFiltering = evt.getModifiers().get(i);
                let contains: boolean = false;
                for (let j = 0; j < this.barItems.size(); j++) {
                    let barItem = this.barItems.get(j);
                    if (barItem.getUserObject().equals(headerFiltering)) {
                        barItem.setUserObject(headerFiltering);
                        contains = true;
                        break;
                    }
                    if (barItem === this.sender) {
                        contains = true;
                        break;
                    }
                }
                if (contains)
                    continue;
                this.addFilterBarItem(headerFiltering);
            }
            this.checkIfFirstBarItem();
        }));
    }


    private checkIfFirstBarItem() {
        for (let i: number = 0; i < this.barItems.size(); i++) {
            this.barItems.get(i).setFirst(i === 0);
        }
    }


    private addFilterBarItem(headerFiltering: HeaderFiltering) {
        let filterBarItem: FilterBarItem = new FilterBarItem(headerFiltering, this);
        this.barItems.add(filterBarItem);
        this.view.getRootView().addBarItem(filterBarItem);
        this.checkIfFirstBarItem();
    }

    public modify(modifier: HeaderFiltering): void {
        this.headerCellHolder.filtered(modifier);
    }

    public addItemToBarPanel(column: ColumnConfig<any, any>) {
        this.addFilterBarItem(new HeaderFiltering(column));
    }

    getUi(): FilterBarPanelUi {
        return <FilterBarPanelUi><any>super.getView();
    }

    public removeBarItem(filterBarItem: FilterBarItem) {
        this.barItems.remove(filterBarItem);
    }
}

export class FilterBarItem extends BarItem<HeaderFiltering, FilterBarItemView> {
    public constructor(header: HeaderFiltering, filterBarPanel: FilterBarPanel) {
        super(filterBarPanel.getUi().getFilterBarItemView(), header, filterBarPanel);
        let filterValue: FilterPanel<any>;
        if (header.getColumn().getFilterPanelFactory() != null)
            filterValue = header.getColumn().getFilterPanelFactory().getFilterPanel();
        else
            filterValue = <FilterPanel<any>><any>FilterUtil.getFilterValue(header.getColumn(), filterBarPanel.tableUi.getFilterPanelView());
        filterValue.hideClearButton();
        this.view.setFilterComponent(filterValue);
        this.view.getFilterComponent().setValue(header.getUserEnteredValue(), header.getComparator());
        this.view.getFilterComponent().setFilterValueHandler({
            selected: (userEnteredValue, comparator) => {
                this.userObject.setUserEnteredValue(userEnteredValue, comparator);
                filterBarPanel.sender = this;
                this.modified();
            }
        });
        this.view.getOrHandler().setValue(this.userObject.isOr());
        this.view.getOrHandler().addValueChangeHandler(ValueChangeHandler.onValueChange(evt => {
            this.userObject.setOr(evt.value);
            filterBarPanel.sender = this;
            this.modified();
        }));
    }

    public setFirst(first: boolean) {
        if (first)
            this.view.setActionLabel('Where');
        else {
            this.view.setActionAndOr();
        }
    }

    public setUserObject(userObject: HeaderFiltering) {
        super.setUserObject(userObject);
        this.view.getFilterComponent().setValue(userObject.getUserEnteredValue(), userObject.getComparator());
    }

    delete() {
        this.remove();
        super.delete();
    }

    public remove() {
        this.getBarPanel().removeBarItem(this);
        this.asElement().remove();
    }

    getBarPanel(): FilterBarPanel {
        return <FilterBarPanel>super.getBarPanel();
    }
}


/** // @ts-ignore */
// @ts-ignore
export interface RowTableCellFactory<T> extends CellFactory<T, List<any>, Table<T>> {
    /** // @ts-ignore */
    // @ts-ignore
    getCell(c: CellContext<T, List<any>, Table<T>>): RowTable<T>;
}

export interface HeaderRenderer<T> {
    render(headerRow: HTMLElement, headerCells: List<AbstractHeaderCell>, table: Table<T>): void;
}

export interface FooterRenderer<T> {
    render(headerRow: HTMLElement, footerCells: List<AbstractFooterCell<any, any>>, table: Table<T>): void;
}

class TableRowCellConfig<T, M> extends CellConfig<T, M> {

    public constructor() {
        super();
        /** // @ts-ignore */
        // @ts-ignore
        this.builder = new RowTableBuilder<T, M>();
        let self = this;
        /** // @ts-ignore */
        // @ts-ignore
        this.setCellFactory(new class implements RowTableCellFactory<any> {
            /** // @ts-ignore */
            // @ts-ignore
            getCell(c: CellContext<any, List<any>, Table<T>>): RowTable<T> {
                /** // @ts-ignore */
                // @ts-ignore
                return new RowTable<T>().initWithBuilder(self.builder);
            }
        });
    }

    /** // @ts-ignore */
    // @ts-ignore
    public setCellFactory(cellFactory: RowTableCellFactory<T>): TableRowCellConfig<T, M> {
        /** // @ts-ignore */
        // @ts-ignore
        this.cellFactory = cellFactory;
        return this;
    }
}

export class TableHtmlParser extends ComponentHtmlParser {

    static instance: TableHtmlParser = null;
    private static ROW_TAG = 'row';
    private static CELL_TAG = 'cell';

    private static HEADER_TAG = 'header';
    private static FOOTER_TAG = 'footer';

    public static getInstance(): TableHtmlParser {
        if (TableHtmlParser.instance == null)
            return TableHtmlParser.instance = new TableHtmlParser();
        return TableHtmlParser.instance;
    }

    public parse(htmlElement: Element, elements: Map<string, any>): BaseComponent<any, any> {
        let table: Table<RowItemId> = new Table<RowItemId>();
        if (htmlElement.hasChildNodes()) {
            let headerItems: List<ItemId> = new ArrayList<ItemId>();
            let rowItems: List<RowItemId> = new ArrayList<RowItemId>();
            let header_tags = htmlElement.getElementsByTagName(TableHtmlParser.HEADER_TAG);
            for (let i = 0; i < header_tags.length; i++) {
                this.parseHeader(<HTMLElement>header_tags.item(i), headerItems);
                break; //we expect only one row.
            }

            let tags = htmlElement.getElementsByTagName(TableHtmlParser.ROW_TAG);
            for (let i = 0; i < tags.length; i++)
                this.parseRow(<HTMLElement>tags.item(i), rowItems);

            for (let i = 0; i < headerItems.size(); i++) {
                let cellConfig = new ColumnConfig<RowItemId, ItemId>()
                    .setFieldGetter(p1 => p1.cells.get(i))
                    .setCellFactory(new class implements TableCellFactory<RowItemId, ItemId> {
                        /** // @ts-ignore */
                        // @ts-ignore
                        getCell(c: CellContext<RowItemId, ItemId, Table<any>>): TableCell<RowItemId, ItemId> {
                            /** // @ts-ignore */
                            // @ts-ignore
                            return new TableCell<RowItemId, ItemId>()
                                .setRenderer({
                                    setValue(r: RendererContext<RowItemId, ItemId>): void {
                                        r.valuePanel.innerHTML = r.value.getContent();
                                    }
                                });
                        }
                    })
                    .setHeaderCellFactory({
                        getCell(): AbstractHeaderCell {
                            return new HeaderTableTextCell().setText(headerItems.get(i).getContent());
                        }
                    });
                table.addColumn(cellConfig);
            }
            table.setRowsData(rowItems);
            table.drawData();
        }
        this.replaceAndCopy(htmlElement, table);
        return table;
    }

    private parseHeader(html: HTMLElement, headerItems: List<ItemId>): void {
        let tags = html.getElementsByTagName(TableHtmlParser.CELL_TAG);
        for (let i = 0; i < tags.length; i++)
            headerItems.add(this.getIdItem(tags.item(i)));
    }

    private parseRow(html: HTMLElement, rowIdItems: List<RowItemId>): void {
        let rowItem: RowItemId = new RowItemId();
        rowItem.setId(this.getElementId(html));
        let tags = html.getElementsByTagName(TableHtmlParser.CELL_TAG);
        let list = new ArrayList<ItemId>();
        for (let i = 0; i < tags.length; i++)
            list.add(this.getIdItem(tags.item(i)));
        rowItem.cells = (list);
        rowIdItems.add(rowItem);
    }

    public getId(): string {
        return 'dn-table';
    }

    public getClazz(): string {
        return 'Table';
    }

}


export class TableTree<T> extends Table<TreeNode<T>> implements HasOpenHandlers<TreeNode<T>>, HasCloseHandlers<TreeNode<T>> {

    public constructor(ui?: TableTreeUi) {
        super(ui ? ui : Ui.get().getTableTreeUi());
        this.ensureRowCellConfig().setFieldGetter(t => this.columnConfigs.stream().map(columnConfig =>
            columnConfig.getFieldGetter()(t)).collect(Collectors.toList()));
        this.ensureRowCellConfig().setCellFactory({
            getCell(c: CellContext<TreeNode<T>, java.util.List<any>, any>): any {
                return new RowTable();
            }
        });
        this.setSelectionModel(new ListTreeMultiSelectionModel<T>(<any>this, this.view.getRootView()));
        this.treeLogic = new TreeLogic<T>(<any>this);
    }

    treeLogic: TreeLogic<T>;

    checkable: boolean;

    public isCheckable(): boolean {
        return this.checkable;
    }

    public setCheckable(checkable: boolean) {
        this.checkable = checkable;
        this.setSelectionModel(new TreeMultiSelectionModel(<any>this, this.view.getRootView()));
        // this.getSelectionModel().setNavigator(false);
    }

    public getSelectionModel(): ListTreeMultiSelectionModel<any> {
        return <ListTreeMultiSelectionModel<any>>super.getSelectionModel();
    }

    public setRoot(root: TreeNode<T>) {
        this.treeLogic.setRoot(root);
    }

    public getRoot(): TreeNode<T> {
        return this.treeLogic.root;
    }

    public isShowRoot(): boolean {
        return this.treeLogic.isShowRoot();
    }

    public showRoot(b: boolean) {
        this.treeLogic.setShowRoot(b);
    }

    public isAllCollapsed(): boolean {
        return this.treeLogic.allNodesCollapsed();
    }

    public isAllExpanded(): boolean {
        return this.treeLogic.allNodesExpanded();
    }

    public expandAll(b: boolean) {
        this.treeLogic.setExpandAll(b);
    }

    filterAndSort() {
        super.filterAndSort();
        this.rowsFiltered = this.treeLogic.root.getAllChildNodesInOrderSorted(this.oneComparator(), this.rowsFiltered);
        this.rowsFiltered.add(0, this.treeLogic.root);
        this.treeLogic.filterAndSort();
    }

    public createAndInitModelRowCell(model: TreeNode<any>): BaseCell<any, any> {
        return super.createAndInitModelRowCell(model);
    }

    public addCloseHandler(handler: CloseHandler<TreeNode<T>>): HandlerRegistration {
        return this.addHandler(handler);
    }

    public addOpenHandler(handler: OpenHandler<TreeNode<T>>): HandlerRegistration {
        return this.addHandler(handler);
    }
}

export class TreeGroupBy<T> extends TableTree<T> {
    table: Table<T>;

    addHeader() {
    }

    addFooter() {
    }

    public constructor(table: Table<T>) {
        super(Ui.get().getTreeGroupBy(table.getView().getRootView()));
        this.table = table;
        for (let index132 = table.getColumnConfigs().iterator(); index132.hasNext();) {
            let columnConfig = index132.next();
            this.addColumn(new TreeTableColumnConfig<T, any>().setColumnConfigTn(columnConfig));
        }
        this.getColumnConfigs().get(0).setCellFactory({
            getCell(c: any): any {
                return AbstractTableTreeCell.getCell(<TreeNode<any>>c.model, this.checkable);
            }
        });
        this.showRoot(false);
    }

    public static groupBy(headerGrouping: HeaderGrouping, rows: java.util.List<any>): java.util.Map<any, any> {
        let comparator: Comparator<any> = headerGrouping.getSortingDirection() === SortingDirection.DESCENDING ? Collections.reverseOrder<any>() : null;
        let collect: List<any> = rows.stream()
            .filter(o => headerGrouping.getColumn().getFieldGetter()(o) != null)
            .collect(Collectors.toList());

        rows.sort(headerGrouping.getColumn().getComparator());

        let array: Array<any> = rows.toArray();
        let resultMap: java.util.LinkedHashMap<any, any> = new java.util.LinkedHashMap();

        // array.sort((a, b) => (a.curentColor > b.curentColor) ? 1 : -1)

        let result = array.reduce(function (r, a) {
            let field = headerGrouping.getColumn().getFieldGetter()(a);
            r[field] = r[field] || [];
            r[field].push(a);
            return r;
        }, Object.create(null));
        for (let resultKey in result) {
            let value = result[resultKey];
            resultMap.put(resultKey, java.util.Arrays.asList(value));
        }
        // if (true) throw new Error('stop and test here!');
        // if (headerGrouping.getSortingDirection() !== SortingDirection.DESCENDING) {
        //     resultMap.putAll(<java.util.Map<any, any>><any>collect);
        // } else {
        //     resultMap.putAll(<java.util.Map<any, any>><any>collect);
        // }
        return resultMap;
    }

    /*private*/
    static putNulls(resultMap: java.util.LinkedHashMap<any, any>, headerGrouping: HeaderGrouping, rows: java.util.List<any>) {
        resultMap.put(null, <any>(rows.stream().filter((o) => (target => (typeof target === 'function') ? target(o) : (<any>target).apply(o))(headerGrouping.getColumn().getFieldGetter()) == null).collect<any, any>(java.util.stream.Collectors.toList<any>())));
    }

    static group(node: TreeNode<any>, columnsForGrouping: java.util.Collection<HeaderGrouping>, rows: java.util.List<any>, expandAll: boolean) {
        let listGrouping: java.util.List<HeaderGrouping> = <any>(new java.util.ArrayList<any>(columnsForGrouping));
        let headerGrouping: HeaderGrouping = listGrouping.remove(0);
        let map = TreeGroupBy.groupBy(headerGrouping, rows);
        map.entrySet().forEach(p1 => {
            let groupNode = new TreeNode(p1.key);
            groupNode.setExpanded(expandAll);
            node.add(groupNode);
            let list: List<any> = p1.value;
            if (listGrouping.isEmpty()) {
                list.forEach(o => groupNode.add(new TreeNode(o)));
            } else
                this.group(groupNode, listGrouping, list, expandAll);
        });
    }

    groupByInOrder: java.util.LinkedHashSet<HeaderGrouping> = new java.util.LinkedHashSet<any>();

    getRetain(headerGroupings: java.util.Collection<HeaderGrouping>): java.util.Collection<HeaderGrouping> {
        let retain: java.util.List<HeaderGrouping> = new java.util.ArrayList<any>(headerGroupings);
        retain.retainAll(this.groupByInOrder);
        let commonsAreEqual: boolean = /* equals */(<any>((o1: any, o2: any) => {
            if (o1 && o1.equals) {
                return o1.equals(o2);
            } else {
                return o1 === o2;
            }
        })(retain, new java.util.ArrayList<any>(this.groupByInOrder).subList(0, retain.size())));

        if (!retain.isEmpty() && commonsAreEqual)
            return retain;
        else
            return new java.util.ArrayList<any>();
    }

    groupings: java.util.List<HeaderGrouping>;

    public groupBy2(columnsForGrouping: java.util.Collection<HeaderGrouping>) {
        this.groupings = <any>(new java.util.ArrayList<any>(columnsForGrouping));
        this.table.getView().getRootView().clear();
        this.table.getCells().clear();
        this.table.filterAndSort();
        let root: TreeNode<any> = new TreeNode('root ');
        TreeGroupBy.group(root, columnsForGrouping, this.table.rowsFiltered, this.isAllExpanded());
        let retain: java.util.Collection<HeaderGrouping> = this.getRetain(columnsForGrouping);
        if (!retain.isEmpty()) {
            this.copyExpended(retain.size(), root);
        }
        this.setRoot(root);
        this.table.ensureVirtualScroll().setEnabled(false);
        this.ensureVirtualScroll().setEnabled(true);
        this.drawData();
        this.groupByInOrder.removeIf((e) => e.getActiveModifier() == null);
        this.groupByInOrder.addAll(columnsForGrouping);
    }

    /*private*/
    copyExpended(level: number, root: TreeNode<any>) {
        this.getRoot().getAllLeafs().forEach((node: TreeNode<any>) => {
            if (!this.table.rowsFiltered.contains(node.getUserObject())) {
                let parent: TreeNode<any> = node.getParent();
                node.removeFromParent();
                if (parent != null) {
                    if (parent.getChildren().isEmpty()) {
                        parent.removeFromParent();
                    }
                }
            }
        });
        for (let i: number = 1; i <= level; i++) {
            {
                let nodes: java.util.List<any> = <any>(getAllNodesAtLevel(i, this.getRoot()).stream().filter((node) => (<TreeNode<any>><any>node).isExpanded() === !this.isAllExpanded()).collect<any, any>(java.util.stream.Collectors.toList<any>()));
                let nodesToCopy: java.util.List<any> = getAllNodesAtLevel(i, root);
                for (let index133 = nodes.iterator(); index133.hasNext();) {
                    let oo = index133.next();
                    {
                        for (let index134 = nodesToCopy.iterator(); index134.hasNext();) {
                            let o = index134.next();
                            {
                                let node: TreeNode<any> = <TreeNode<any>>o;
                                let node1: TreeNode<any> = <TreeNode<any>>oo;
                                if (TreeGroupBy.isEqual(node, node1)) {
                                    node.setExpanded(node1.isExpanded());
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            ;
        }
    }

    public static isEqual(node1: TreeNode<any>, node2: TreeNode<any>): boolean {
        let list1: java.util.List<any> = <any>(node1.getAllLeafs().stream().map<any>((o: any) => {
            return (<TreeNode<any>>o).getUserObject();
        }).collect<any, any>(java.util.stream.Collectors.toList<any>()));
        let list2: java.util.List<any> = <any>(node2.getAllLeafs().stream().map<any>((o: any) => {
            return (<TreeNode<any>>o).getUserObject();
        }).collect<any, any>(java.util.stream.Collectors.toList<any>()));
        let leafsEqual: boolean = list1.containsAll(list2) && list1.size() === list2.size();
        let levelsEqual: boolean = node1.getLevel() === node2.getLevel();
        return leafsEqual && levelsEqual;
    }

    public clear() {
        this.groupByInOrder.clear();
        this.table.getView().getRootView().clear();
        this.table.getCells().clear();
        this.rows.clear();
        this.rowsFiltered.clear();
    }


    public drawData() {
        super.drawData();
    }

    public setExpandAll(expandAll: boolean) {
        this.treeLogic.setExpandAll(expandAll);
    }
}
