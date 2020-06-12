import {CellConfig} from '../CellConfig';
import {java} from 'j4ts';
import {CellFactory} from '../corecls/CellFactory';
import {Table} from './Table';
import {BaseCell, BaseCellBuilder, CellRenderer, RendererContext} from '../BaseCell';
import {FilterPanel, HasFilterValue} from './FilterPanel';
import {CellView} from '../corecls/CellView';
import {AbstractCell} from '../AbstractCell';
import {
    HeaderTableFilterCellView,
    HeaderTableSortCellView,
    HeaderTableTextCellView,
    SortPresenter,
    TableRowView,
    TableUi
} from './views/TableUi';
import {BaseCellView} from '../corecls/BaseCellView';
import {DoubleClickHandler} from '../corecls/handlers';
import {CellContext} from '../corecls/CellContext';
import {AbstractCellComponent} from '../AbstractCellComponent';
import {FilterHandler, HeaderCellHolder, HeaderFiltering, HeaderSorting, SortHandler} from './HeaderCellHolder';
import {FilterUtil} from './FilterUtil';
import {DateBox} from '../textbox/DateBox';
import {DefaultCellEditor} from '../CellEditor';
import {getDefaultComparator} from '../corecls/corecls';
import {EditFormDialog} from '../EditFormDialog';
import Comparator = java.util.Comparator;
import List = java.util.List;
import ArrayList = java.util.ArrayList;
import Collectors = java.util.stream.Collectors;

export enum SortingDirection {
    ASCENDING = 'asc', DESCENDING = 'desc'
}

export class ColumnConfig<T, M> extends CellConfig<T, M> {

    private columnName = '';
    protected comparator: Comparator<T>;
    private columnWidth = '100px';
    private visible = true;
    private editable = false;
    private filterPanelFactory: FilterPanelFactory<T>;

// {
//     setCellFactory(c -> new TableCell<T, M>().initWithBuilder(builder));
//     builder = new TableCell.Builder<>();
// }

    private groupRowRenderer: GroupRowRenderer<T, M>;
// private  groupRowRenderer = new GroupRowRenderer<T, M>() {

// 
// public void render(M value, List<T> groupedValues, HTMLElement htmlElement) {
//         htmlElement.innerHTML = value + "";
//     }
// };

    private sortable = true;

    private headerCellFactory: TableHeaderCellFactory;
    // = () -> new HeaderTableSortCell().setText(columnName);

    private footerCellFactory: FooterCellFactory<T, M>;

    private defaultFooterCellFactory: FooterCellFactory<T, M>;
//     = FooterCell::new;
//
// public FooterCellFactory<T, M> getDefaultFooterCellFactory() {
//     return defaultFooterCellFactory;
// }

    public getDefaultFooterCellFactory(): FooterCellFactory<T, M> {
        return this.defaultFooterCellFactory;
    }

    constructor() {
        super();
        /** // @ts-ignore */
        // @ts-ignore
        this.builder = new TableCellBuilder<T, M>();
        this.headerCellFactory = {
            getCell(): AbstractHeaderCell {
                return new HeaderTableSortCell().setText(this.columnName);
            }
        };
        let bb = this.builder;
        this.cellFactory = {
            getCell(c: CellContext<T, M, any>): BaseCell<T, M> {
                /** // @ts-ignore */
                // @ts-ignore
                return new TableCell<T, M>().initWithBuilder(bb);
            }
        };
        this.defaultFooterCellFactory = {
            getCell(): AbstractFooterCell<T, M> {
                return new FooterCell();
            }
        };
    }

    /** // @ts-ignore */
    // @ts-ignore
    public setFieldGetter(fieldGetter: (p1: T) => M): ColumnConfig<T, M> {
        return <any>super.setFieldGetter(fieldGetter);
    }

    /** // @ts-ignore */
    // @ts-ignore
    setFieldSetter(fieldSetter: (p1: T, p2: M) => void): ColumnConfig<T, M> {
        return <any>super.setFieldSetter(fieldSetter);
    }

    public getFooterCellFactory(): FooterCellFactory<T, M> {
        return this.footerCellFactory;
    }

    public setFooterCellFactory(footerCellFactory: FooterCellFactory<T, M>): ColumnConfig<T, M> {
        this.footerCellFactory = footerCellFactory;
        return this;
    }

    public setHeaderCellFactory(headerCellFactory: TableHeaderCellFactory): ColumnConfig<T, M> {
        this.headerCellFactory = headerCellFactory;
        return this;
    }

    public getHeaderCellFactory(): TableHeaderCellFactory {
        return this.headerCellFactory;
    }


    public getColumnName(): string {
        return this.columnName;
    }

    public setColumnName(columnName: string): ColumnConfig<T, M> {
        this.columnName = columnName;
        return this;
    }

    public getComparator(): Comparator<T> {
        if (this.comparator != null) {
            return this.comparator;
        } else {
            return getDefaultComparator(this.fieldGetter);
        }
    }

    public setComparator(comparator: Comparator<T>): ColumnConfig<T, M> {
        this.comparator = comparator;
        return this;
    }

    public getColumnWidth(): string {
        return this.columnWidth;
    }

    public setColumnWidth(width: string): ColumnConfig<T, M> {
        this.columnWidth = width;
        return this;
    }

    public isSortable(): boolean {
        return this.sortable;
    }

    public getGroupRowRenderer(): GroupRowRenderer<T, M> {
        return this.groupRowRenderer;
    }

    public setGroupRowRenderer(groupRowRenderer: GroupRowRenderer<T, M>): ColumnConfig<T, M> {
        this.groupRowRenderer = groupRowRenderer;
        return this;
    }


    /** // @ts-ignore */
    // @ts-ignore
    public getCellFactory(): TableCellFactory<T, M> {
        return <any>this.cellFactory;
    }


    /** // @ts-ignore */
    // @ts-ignore
    public setCellFactory(cellFactory: TableCellFactory<T, M>): ColumnConfig<T, M> {
        /** // @ts-ignore */
        // @ts-ignore
        super.setCellFactory(cellFactory);
        return this;
    }

    public toString(): string {
        return this.columnName + '';
    }

    public isVisible(): boolean {
        return this.visible;
    }

    public setVisible(visible: boolean): ColumnConfig<T, M> {
        this.visible = visible;
        return this;
    }

    public isEditable(): boolean {
        return this.editable;
    }

    public setEditable(editable: boolean): ColumnConfig<T, M> {
        this.editable = editable;
        return this;
    }

    /** // @ts-ignore */
    // @ts-ignore
    public setClazz(clazz: string): ColumnConfig<T, M> {
        /** // @ts-ignore */
        // @ts-ignore
        return super.setClazz(clazz);
    }

    /** // @ts-ignore */
    // @ts-ignore
    public getCellBuilder(): TableCellBuilder<T, M> {
        /** // @ts-ignore */
        // @ts-ignore
        return <TableCellBuilder<T, M>>super.getCellBuilder();
    }

    public setCellBuilder(b: BuilderSet<T, M>): ColumnConfig<T, M> {
        b.setBuilder(this.getCellBuilder());
        return this;
    }

    public getFilterPanelFactory(): FilterPanelFactory<T> {
        return this.filterPanelFactory;
    }

    public setFilterPanelFactory(filterPanelFactory: FilterPanelFactory<T>): ColumnConfig<T, M> {
        this.filterPanelFactory = filterPanelFactory;
        return this;
    }

}

export interface BuilderSet<T, M> {
    setBuilder(b: TableCellBuilder<T, M>): void;
}

export interface FilterPanelFactory<T> {
    getFilterPanel(): FilterPanel<T>;
}

export interface TableHeaderCellFactory {
    getCell(): AbstractHeaderCell;
}

export interface FooterCellFactory<T, M> {
    getCell(): AbstractFooterCell<T, M>;
}

export interface GroupRowRenderer<T, M> {
    render(value: M, groupedValues: java.util.List<T>, htmlElement: HTMLElement): void;
}

/** // @ts-ignore */
// @ts-ignore
export interface TableCellFactory<T, M> extends CellFactory<T, M, any> {
    /** // @ts-ignore */
    // @ts-ignore
    getCell(c: CellContext<T, M, Table<any>>): TableCell<T, M>;
}

/** // @ts-ignore */
// @ts-ignore
export abstract class AbstractTableCellBuilder<T, M> extends BaseCellBuilder<T, M, AbstractTableCellBuilder<T, M>> {

    /** // @ts-ignore */
    // @ts-ignore
    public abstract build(): AbstractTableCell<T, M>;

    constructor() {
        super();
    }
}

export class TableCellBuilder<T, M> extends AbstractTableCellBuilder<T, M> {

    public build(): TableCell<T, M> {
        return null;
    }

    constructor() {
        super();
    }
}

export abstract class BaseTableCell<T, M, CW extends CellView> extends AbstractCell<T, M, CW> {

    constructor(baseCellView?: CW) {
        super(baseCellView);
    }

    /** // @ts-ignore */
    // @ts-ignore
    public getOwner(): Table<T> {
        return <Table<T>><unknown>super.getOwner();
    }

    /** // @ts-ignore */
    // @ts-ignore
    public getCellConfig(): ColumnConfig<T, M> {
        return <ColumnConfig<T, M>><unknown>super.getCellConfig();
    }


    protected getUi(): TableUi {
        return <TableUi>super.getUi();
    }
}

export abstract class AbstractHeaderCell extends BaseTableCell<any, any, CellView> {

    protected headerCellHolder: HeaderCellHolder;

    constructor(baseCellView?: CellView) {
        super(baseCellView);
    }


    public getColumn(): number {
        return this.getOwner().getColumnConfigs().indexOf(this.cellConfig);
    }

    public setHeaderCellHolder(cellHolder: HeaderCellHolder): void {
        this.headerCellHolder = cellHolder;
    }

}

export abstract class AbstractTableCell<T, M> extends BaseCell<T, M> {

    constructor(baseCellView?: BaseCellView) {
        super(baseCellView);
    }

    public getCellView(): BaseCellView {
        return super.getCellView();
    }

    /** // @ts-ignore */
    // @ts-ignore
    public getOwner(): Table<T> {
        return <any>super.getOwner();
    }

    /** // @ts-ignore */
    // @ts-ignore
    public getCellConfig(): ColumnConfig<T, M> {
        return <any>super.getCellConfig();
    }


    protected getUi(): TableUi {
        return <TableUi>super.getUi();
    }

    /** // @ts-ignore */
    // @ts-ignore
    initWithBuilder(builder: AbstractTableCellBuilder<T, M>): AbstractTableCell<T, M> {
        /** // @ts-ignore */
        // @ts-ignore
        return super.initWithBuilder(builder);
    }

    protected isPopupEditing(): boolean {
        return this.getOwner().isEditable() && this.getOwner().isPopupEditing();
    }
}


export class TableCell<T, M> extends AbstractTableCell<T, M> {

    rowTable: RowTable<any>;

    constructor(baseCellView?: BaseCellView) {
        super(baseCellView);
    }


    public setSelection(): void {
        //We don't need selection cause RowTable has selection style
    }

    protected setSelectionBase(): void {
        super.setSelection();
    }

    public getRowTable(): RowTable<any> {
        return this.rowTable;
    }

    public setRowTable(rowTable: RowTable<any>): void {
        this.rowTable = rowTable;
    }

//row is same as RowTable
    public getRow(): number {
        return this.rowTable.getRow();
    }

    public getOwner(): Table<T> {
        return super.getOwner();
    }


    protected initViewFromOwner(): void {
        this.cellView = this.getUi().getTableCellView();
    }

    public isEditable(): boolean {
        return super.isEditable() && this.getCellConfig().isEditable() && !this.isPopupEditing();
    }
}

export class TableCellDate<T> extends TableCell<T, Date> {
    public constructor() {
        super();
        this.init();
    }

    private init() {
        this.setRenderer<any>({
            setValue: (r) => {
                if (r.value == null)
                    r.valuePanel.innerHTML = 'N/D';
                else {
                    r.valuePanel.innerHTML = this.value.toLocaleDateString();
                }
            }
        });
        let dateBox: DateBox = new DateBox();
        this.setCellEditor<any>(<any>(new DefaultCellEditor(dateBox)));
    }
}

export class HeaderTableTextCell extends AbstractHeaderCell {
    private text: string;

    constructor();
    constructor(view: HeaderTableTextCellView);
    public constructor(view?: HeaderTableTextCellView) {
        super(view);
    }

    public draw() {
        this.getCellView().setText(this.text == null ? this.getCellConfig().getColumnName() : this.text);
    }

    public setText(columnName: string): HeaderTableTextCell {
        this.text = columnName;
        return this;
    }

    public getText(): string {
        return this.text;
    }

    /**
     *
     */
    initViewFromOwner() {
        this.cellView = this.getUi().getHeaderTableTextCellView();
    }

    getCellView(): HeaderTableTextCellView {
        return <HeaderTableTextCellView><any>super.getCellView();
    }
}

export class HeaderTableSortCell extends HeaderTableTextCell implements SortPresenter {

    private headerSorting: HeaderSorting;

    public constructor() ;
    public constructor(headerCellView?: HeaderTableSortCellView) {
        super(headerCellView);
    }


    bind() {
        this.getCellView().setSortPresenter(this);
        this.headerCellHolder.addSortHandler(SortHandler.onSort(event => {
            this.updateView(event.getByColumn(this.getCellConfig()));
            let index: number = new java.util.ArrayList<any>(event.getModifiers()).indexOf(this.headerSorting);
            this.getCellView().setSortIconText((event.getModifiers().size() > 1) && index !== -1 ? index + 1 + '' : '');
        }));
    }

    public setHeaderCellHolder(headerCellHolder: HeaderCellHolder) {
        this.headerCellHolder = headerCellHolder;
    }

    public getCellView(): HeaderTableSortCellView {
        return <HeaderTableSortCellView><any>super.getCellView();
    }

    /**
     * Sorts ascending {@link SortingDirection#ASCENDING}<p>
     * Sorts descending {@link SortingDirection#DESCENDING}<p>
     * Removes sorting {@code null}
     *
     * @param {SortingDirection} direction
     */
    public sort(direction: SortingDirection) {
        if (this.headerSorting == null)
            this.headerSorting = new HeaderSorting(this.getCellConfig(), direction);
        else
            this.headerSorting.setSortingDirection(direction);
        this.headerCellHolder.sorted(this.headerSorting);
    }

    /**
     * Updates cell view if HeaderSorting is present in event's headers sorting list.
     * Otherwise set activity to false.
     *
     * @param {HeaderSorting} header
     * @private
     */
    private updateView(header: HeaderSorting) {
        this.headerSorting = header;
        this.getCellView().setSorted(header == null ? null : header.getSortingDirection());
        this.getCellView().setActive(header != null);
    }

    /**
     *
     */
    initViewFromOwner() {
        this.cellView = this.getUi().getHeaderTableSortCellView();
    }

    /**
     *
     * @param {string} columnName
     * @return {HeaderTableSortCell}
     */
    public setText(columnName: string): HeaderTableSortCell {
        return <HeaderTableSortCell>super.setText(columnName);
    }
}

export class HeaderTableFilterCell extends HeaderTableSortCell {
    headerFiltering: HeaderFiltering;

    filterPanel: HasFilterValue<any>;

    filterFactory: FilterFactory<any>;

    public constructor(filterFactory?: FilterFactory<any>) {
        super();
        this.filterFactory = filterFactory;
        let self = this;
        this.filterFactory = new class implements FilterFactory<any> {
            getHasFilterValue(): HasFilterValue<any> {
                return FilterUtil.getFilterValue(self.getCellConfig(), self.getUi().getFilterPanelView());
            }
        };

    }

    public setFilterPanel(filterPanel: HasFilterValue<any>): HeaderTableFilterCell {
        this.filterPanel = filterPanel;
        return this;
    }

    public setText(columnName: string): HeaderTableFilterCell {
        return <HeaderTableFilterCell>super.setText(columnName);
    }


    bind() {
        super.bind();
        if (this.filterPanel == null)
            this.filterPanel = this.filterFactory.getHasFilterValue();
        this.filterPanel.setFilterValueHandler({
            selected: (userEnteredValue, comparator) => {
                if (this.headerFiltering == null) this.headerFiltering = new HeaderFiltering(this.getCellConfig());
                this.headerFiltering.setUserEnteredValue(userEnteredValue, comparator);
                this.headerCellHolder.filtered(this.headerFiltering);
            }
        });
        this.getCellView().setFilterPanel(this.filterPanel);
        this.headerCellHolder.addFilterHandler(FilterHandler.onFilter(event => {
            let contains: boolean = false;
            for (let index = event.getModifiers().iterator(); index.hasNext();) {
                let filtering = index.next();
                if (filtering.equals(this.headerFiltering)) {
                    this.headerFiltering = filtering;
                    contains = true;
                    break;
                }
            }
            if (contains)
                this.setFiltered(this.headerFiltering);
            else {
                this.headerFiltering = null;
                this.setFiltered(null);
            }
        }));
    }

    private setFiltered(header: HeaderFiltering) {
        if (header != null) {
            this.filterPanel.setValue(header.getUserEnteredValue(), header.getComparator());
        } else {
            this.filterPanel.setValue(null, null);
        }
        this.getCellView().setFilterIconVisible(header != null);
    }

    public getCellView(): HeaderTableFilterCellView {
        return <HeaderTableFilterCellView><any>super.getCellView();
    }

    initViewFromOwner() {
        this.cellView = this.getUi().getHeaderTableMenuFilterView();
    }

    public setFilterFactory(filterFactory: FilterFactory<any>) {
        this.filterFactory = filterFactory;
    }
}


export class RowTable<T> extends AbstractTableCell<T, List<any>> {

    cells = new ArrayList<TableCell<any, any>>();

    constructor(baseCellView?: TableRowView) {
        super(baseCellView);
    }


    bind(): void {
        // new MouseCustomEvents(this.asElement());
        this.getCellView().addDoubleClickHandler(DoubleClickHandler.onDoubleClick(e => {
            if (this.isPopupEditing()) {
                let editFormDialog = new EditFormDialog(this);
                editFormDialog.show();
            }
        }));
    }


    public initCellValue(): void {
        this.cells.clear();
        this.getCellView().clearCells();
        this.value = new ArrayList();
        for (let index = this.getOwner().getColumnConfigs().iterator(); index.hasNext();) {
            let columnConfig = index.next();
            let cellValue = columnConfig.getFieldGetter()(this.getModel());
            if (cellValue === 'undefined')
                cellValue = null;
            this.value.add(cellValue);
            /** // @ts-ignore */
            // @ts-ignore
            this.initCell(columnConfig.getCellFactory().getCell(new CellContext(columnConfig, this.getOwner().valueCellFactory, <any>this.getModel(), this.getOwner())), columnConfig);
        }
    }


    public getCells(): ArrayList<TableCell<any, any>> {
        return this.cells;
    }


    public getRow(): number {
        return this.getOwner().getCells().indexOf(this);
    }

    private initCell(tableCell: AbstractTableCell<any, any>, columnConfig: ColumnConfig<any, any>): void {
        (<TableCell<any, any>>tableCell).setRowTable(this);
        /** // @ts-ignore */
        // @ts-ignore
        AbstractCellComponent.initCellListDraw(tableCell, this.model, columnConfig, this.cells, this.getOwner());
    }


    public getCellView(): TableRowView {
        return <TableRowView>super.getCellView();
    }


    protected initViewFromOwner(): void {
        this.cellView = this.getUi().getRowTableCellView();
    }


    protected getCellRenderer(): CellRenderer<T, List<any>> {
        let self = this;
        if (this.cellRenderer == null) {
            this.cellRenderer = new class implements CellRenderer<T, List<any>> {
                setValue(r: RendererContext<T, java.util.List<any>>): void {
                    let rowTable = <RowTable<T>><unknown>r.cell;
                    for (let index = rowTable.getCells().iterator(); index.hasNext();) {
                        let tableCell = index.next();
                        if (tableCell.getCellConfig().isVisible())
                            self.getCellView().addColumn(tableCell.getCellView().asElement());
                    }
                }
            };
            return this.cellRenderer;
        }
    }

    // public initWithBuilder(builder: BaseCellBuilder<any, any, any>): RowTable<T> {
    //     return super.initWithBuilder(builder);
    // }

    isEditable(): boolean {
        return super.isEditable() && !this.isPopupEditing();
    }
}

export class RowTableBuilder<T, M> extends AbstractTableCellBuilder<T, M> {

    /** // @ts-ignore */
    // @ts-ignore
    public build(): RowTable<any> {
        /** // @ts-ignore */
        // @ts-ignore
        return new RowTable().initWithBuilder(this);
    }
}

export abstract class AbstractFooterCell<T, M> extends BaseTableCell<T, M, CellView> {


    protected cellRenderer: FooterCellRenderer<T, M>;

    public draw(): void {
        if (this.cellRenderer != null)
            this.cellRenderer.setValue(this.cellView.asElement(), this);
    }

    public setCellRenderer(cellRenderer: FooterCellRenderer<T, M>): AbstractFooterCell<T, M> {
        this.cellRenderer = cellRenderer;
        return this;
    }

    public getColumnItems(): List<M> {
        return this.getOwner().getRowsData()
            .stream()
            .map(t => this.getCellConfig()
                .getFieldGetter()(t))
            .collect(Collectors.toList());
    }


    protected initViewFromOwner(): void {
        this.cellView = this.getUi().getFooterCellView();
    }

}

export interface FooterCellRenderer<T, M> {
    setValue(valuePanel: HTMLElement, cell: AbstractFooterCell<T, M>): void;
}

export class FooterCell<T, N> extends AbstractFooterCell<T, N> {

    public FooterCell() {
    }

    public setCellRenderer(cellRenderer: FooterCellRenderer<T, N>): FooterCell<T, N> {
        super.setCellRenderer(cellRenderer);
        return this;
    }

}

export interface FilterFactory<T> {
    getHasFilterValue(): HasFilterValue<T>;
}

