import {BaseCellView} from './corecls/BaseCellView';
import {AbstractCell} from './AbstractCell';
import {CellEditing} from './CellEditing';
import {CellEditor} from './CellEditor';
import {CellConfig} from './CellConfig';
import {ClickHandler, DoubleClickHandler, KeyDownHandler} from './corecls/handlers';
import {ComponentUi} from './corecls/View';
import {FilterUtil} from './table/FilterUtil';

export abstract class BaseCell<P, M> extends AbstractCell<P, M, BaseCellView> {

    cellEditing: CellEditing<P, M>;
    cellRenderer: CellRenderer<P, M>;
    cellEditor: CellEditor<M>;
    editable: boolean = true;
    selectable: boolean = true;
    focusable: boolean;
    enabled: boolean = true;
    selected: boolean;

    constructor(baseCellView?: any) {
        super(baseCellView);
    }

    public draw() {
        this.initCellValue();
        this.renderView();
        this.setSelection();
    }

    protected renderView() {
        this.cellView.getValuePanel().innerHTML = '';
        this.getCellRenderer().setValue(<any>(new RendererContext<any, any>(this.getValue(), this.cellView.getValuePanel(), this)));
    }

    public setCellConfig(cellConfig: CellConfig<P, M>) {
        super.setCellConfig(cellConfig);
    }

    public initCellValue() {
        this.value = this.cellConfig.getFieldGetter()(this.model);
    }

    public isSelected(): boolean {
        return this.selected;
    }

    setSelected(b: boolean) {
        if (this.isSelectable()) {
            this.cellView.setSelected(this.selected = b);
        }
    }

    setSelection() {
        if (this.getOwner().getSelectionModel() != null)
            this.setSelected(this.getOwner().getSelectionModel().isSelected(this.getModel()));
    }


    bind() {
        this.cellView.addClickHandler(ClickHandler.onClick(evt => this.onClick1(evt)));
        this.cellView.addDoubleClickHandler(DoubleClickHandler.onDoubleClick(evt => {
            if (this.isEditable()) {
                if (!this.ensureEditor().isEditing())
                    this.ensureEditor().editCell();
            }
        }));

        this.cellView.addKeyDownHandler(KeyDownHandler.onKeyDown(evt => {
            if (evt.code === 'Enter') {
                if (this.isEditable()) {
                    if (!this.ensureEditor().isEditing())
                        this.ensureEditor().editCell();
                }
            }
        }));
    }

    onClick1(event: MouseEvent) {
    }

    public setSelectable<C extends BaseCell<P, M>>(selectable: boolean): C {
        this.selectable = selectable;
        return <C><any>this;
    }

    public setFocusable<C extends BaseCell<P, M>>(focusable: boolean): C {
        this.focusable = focusable;
        return <C><any>this;
    }

    public isSelectable(): boolean {
        return this.selectable;
    }

    public isFocusable(): boolean {
        return this.focusable;
    }

    public setFocus(b: boolean) {
        if (this.isFocusable()) {
            this.cellView.setFocus(b);
        }
    }

    public isEditable(): boolean {
        return this.editable && this.getOwner().isEditable();
    }

    public isEnabled(): boolean {
        return this.enabled;
    }

    public setEnabled<C extends BaseCell<P, M>>(b: boolean): C {
        this.enabled = b;
        return <C><any>this;
    }

    public scrollInView() {
        this.getCellView().asElement().scrollIntoView();
    }

    getCellView(): BaseCellView {
        return super.getCellView();
    }

    public asElement(): HTMLElement {
        return this.cellView.asElement();
    }

    /**
     * programmatically starts editing cell
     */
    public startEditing() {
        if (this.isEditable()) this.ensureEditor().editCell();
    }

    ensureEditor(): CellEditing<any, any> {
        if (this.cellEditing == null)
            this.cellEditing = new CellEditing<any, any>(this);
        return this.cellEditing;
    }

    protected getCellRenderer(): CellRenderer<P, M> {
        if (this.cellRenderer == null) {
            this.cellRenderer = this.getDefaultCellRenderer();
        }
        return this.cellRenderer;
    }

    public setCellEditor<C extends BaseCell<P, M>>(cellEditor: CellEditor<M>): C {
        this.cellEditor = cellEditor;
        return <C><any>this;
    }

    getCellEditor(): CellEditor<any> {
        if (this.cellEditor == null)
            this.cellEditor = FilterUtil.getComponent<any>(this.getCellConfig().getClazz());
        return this.cellEditor;
    }

    public setEditable<C extends BaseCell<P, M>>(editable: boolean): C {
        this.editable = editable;
        return <C><any>this;
    }

    public setRenderer<C extends BaseCell<P, M>>(cellRenderer: CellRenderer<P, M>): C {
        this.cellRenderer = cellRenderer;
        return <C><any>this;
    }

    public setCellView<C extends BaseCell<P, M>>(cellView: BaseCellView): C {
        this.cellView = cellView;
        return <C><any>this;
    }

    getDefaultCellRenderer(): CellRenderer<P, M> {
        return CellRendererDefault.getInstance();
    }

    protected getUi(): ComponentUi<any> {
        return this.getOwner().getView();
    }

    public initWithBuilder<C extends BaseCell<P, M>>(builder: BaseCellBuilder<any, any, any>): C {
        if (builder.editable != null) this.editable = builder.editable;
        if (builder.cellRenderer != null) this.cellRenderer = builder.cellRenderer;
        if (builder.cellEditor != null) this.cellEditor = builder.cellEditor;
        if (builder.selected != null) this.selected = builder.selected;
        if (builder.baseCellView != null) this.cellView = builder.baseCellView;
        return <C><any>this;
    }
}

export abstract class BaseCellBuilder<P, M, C extends BaseCellBuilder<P, M, C>> {

    cellRenderer: CellRenderer<P, M>;
    cellEditor: CellEditor<M>;
    editable: boolean;
    selected: boolean;
    baseCellView: BaseCellView;

    initWithBuilder(builder: BaseCellBuilder<any, any, any>) {
        this.editable = builder.editable;
        this.cellRenderer = builder.cellRenderer;
        this.cellEditor = builder.cellEditor;
        this.selected = builder.selected;
        this.baseCellView = builder.baseCellView;
    }

    public setCellRenderer(cellRenderer: CellRenderer<P, M>): C {
        this.cellRenderer = cellRenderer;
        return <C><any>this;
    }

    public setCellEditor(cellEditor: CellEditor<M>): C {
        this.cellEditor = cellEditor;
        return <C><any>this;
    }

    public setEditable(editable: boolean): C {
        this.editable = editable;
        return <C><any>this;
    }

    public setSelected(selected: boolean): C {
        this.selected = selected;
        return <C><any>this;
    }

    public setBaseCellView(baseCellView: BaseCellView): C {
        this.baseCellView = baseCellView;
        return <C><any>this;
    }

    public abstract build(): BaseCell<P, M>;

    public static create(): BaseCellBuilder<any, any, any> {
        return null;
    }

    constructor() {
        if (this.cellRenderer === undefined) this.cellRenderer = null;
        if (this.cellEditor === undefined) this.cellEditor = null;
        if (this.editable === undefined) this.editable = null;
        if (this.selected === undefined) this.selected = null;
        if (this.baseCellView === undefined) this.baseCellView = null;
    }
}

export interface CellRenderer<T, M> {
    setValue(r: RendererContext<T, M>): void;
}

export class RendererContext<T, M> {
    public constructor(value: M, valuePanel: HTMLElement, cell: BaseCell<T, M>) {
        this.value = value;
        this.valuePanel = valuePanel;
        this.cell = cell;
    }

    public value: M;

    public valuePanel: HTMLElement;

    public cell: BaseCell<T, M>;
}

export class CellRendererDefault<P, M> implements CellRenderer<P, M> {
    /**
     *
     * @param {RendererContext} r
     */
    public setValue(r: RendererContext<P, M>) {
        r.valuePanel.innerHTML = r.value == null ? '' : r.value + '';
    }

    static instance: CellRendererDefault<any, any> = null;

    public static getInstance(): CellRendererDefault<any, any> {
        if (CellRendererDefault.instance == null)
            CellRendererDefault.instance = <any>(new CellRendererDefault());
        return CellRendererDefault.instance;
    }

    constructor() {
    }
}