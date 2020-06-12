import {AbstractTableCell, AbstractTableCellBuilder, TableCell, TableCellBuilder} from './TableUtil';
import {ClickHandler} from '../corecls/handlers';
import {RowDetailsCellView} from './views/TableUi';

export class TableCellRowExpander<T, M> extends TableCell<T, M> {

    public static singleExpand: boolean = true;
    toggle: boolean = false;
    insertedRow: HTMLElement;


    private rowDetailsRenderer: RowDetailsRenderer<T>;

    public constructor() {
        super();
        this.setEditable(false);
    }


    public draw(): void {
        this.toggle = this.getOwner().rowExpanderList.contains(this.getModel());
        this.getCellView().setOpened(this.toggle);
        if (this.toggle)
            this.addRowDetailsPanel();
        else
            this.removeRowDetailsPanel();
    }


    protected renderView(): void {

    }

    public bind(): void {
        super.bind();
        ClickHandler.onClick(evt => {
            this.toggle = !this.toggle;
            if (TableCellRowExpander.singleExpand)
                this.removeAllExpandedTableRows();
            if (this.toggle) {
                this.getOwner().rowExpanderList.add(this.getModel());
                this.addRowDetailsPanel();
            } else {
                this.getOwner().rowExpanderList.remove(this.getModel());
                this.removeRowDetailsPanel();
            }
        }).addTo(this.asElement());
    }

    private removeAllExpandedTableRows(): void {
        this.getOwner().getRowCells(this.getOwner().rowExpanderList).forEach(row => {
            if (row != null)
                row.cells.forEach((cell: any) => {
                    if (cell instanceof TableCellRowExpander) {
                        (<TableCellRowExpander<any, any>>cell).removeRowDetailsPanel();
                    }
                });
        });
        this.getOwner().rowExpanderList.clear();
    }

    private setOpened(b: boolean): void {
        this.toggle = b;
        this.getCellView().setOpened(b);
    }

    private addRowDetailsPanel(): void {
        this.insertedRow = this.getOwner()
            .getView()
            .getRootView()
            .insertAfter(this.getRowTable(), this.getOwner().getColumnConfigs().size());
        this.rowDetailsRenderer.render(this.model, this.insertedRow);
        this.setOpened(true);
    }

    private removeRowDetailsPanel(): void {
        if (this.insertedRow != null)
            this.insertedRow.remove();
        this.setOpened(false);
    }

    public getCellView(): RowDetailsCellView {
        return <RowDetailsCellView>super.getCellView();
    }

    protected initViewFromOwner(): void {
        this.cellView = this.getUi().getTableCellRowExpanderView();
    }

    public setRowDetailsRenderer(rowDetailsPanel: RowDetailsRenderer<T>): TableCellRowExpander<T, M> {
        this.rowDetailsRenderer = rowDetailsPanel;
        return this;
    }

    initWithBuilder(builder: AbstractTableCellBuilder<T, M>): AbstractTableCell<T, M> {
        if ((<RowExpanderBuilder<any, any>>builder).rowDetailsRenderer != null)
            this.rowDetailsRenderer = (<RowExpanderBuilder<any, any>>builder).rowDetailsRenderer;
        return super.initWithBuilder(builder);
    }

}

class RowExpanderBuilder<T, M> extends TableCellBuilder<T, M> {
    public rowDetailsRenderer: RowDetailsRenderer<T>;

    public setRowDetailsRenderer(rowDetailsRenderer: RowDetailsRenderer<T>): RowExpanderBuilder<T, M> {
        this.rowDetailsRenderer = rowDetailsRenderer;
        return this;
    }
}

export interface RowDetailsRenderer<T> {
    render(t: T, valuePanel: HTMLElement): void;
}