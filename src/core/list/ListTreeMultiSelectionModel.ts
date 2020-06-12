import {DefaultMultiSelectionModel, SelectionMode} from '../corecls/selectionmodel/selectionImpl';
import {ListView} from './ListUi';
import {AbstractCellComponent} from '../AbstractCellComponent';
import {HasNavigationHandler} from '../corecls/handlers';
import {BaseCell} from '../BaseCell';
import {BaseCellNavigator} from './BaseCellNavigator';
import {java} from 'j4ts';
import List = java.util.List;

export class ListTreeMultiSelectionModel<T> extends DefaultMultiSelectionModel<T> {

    private readonly ownerView: ListView;

    invokeType: InvokeType = InvokeType.ON_CELL_CLICKED;

    owner: AbstractCellComponent<any, any, any>;

    lastSelectedModelWithoutShiftPressed: any;

    cellNavigator: ListTreeCellNavigator;

    public constructor(owner: AbstractCellComponent<any, any, any>, view: ListView) {
        super();
        this.owner = owner;
        this.ownerView = view;
        this.setNavigator(true);
    }


    public focusCell(cell: BaseCell<any, any>) {
        this.cellNavigator.setVal(cell.getModel());
    }

    setNavigator(value?: boolean) {
        let self = this;
        if (value != null) {
            this.cellNavigator = new ListTreeCellNavigator(this.owner, this.ownerView);
            this.cellNavigator.setHandler({
                onKeyFocused(model: any, lastFocusedModel: any, event: KeyboardEvent): void {
                    if (self.invokeType === InvokeType.ON_FOCUS && self.selectionMode === SelectionMode.SINGLE) {//                    if (lastFocusedModel != null)
                        self.setSelected(model, true, true);
                    } else if (this.selectionMode === SelectionMode.MULTI && event.shiftKey) {
                        self.selectRegion(model);
                    }
                },
                onClickEvent(currentFocusedCell: any, lastFocusedModel: any, event: MouseEvent): void {
                    if (!event.shiftKey)
                        self.lastSelectedModelWithoutShiftPressed = currentFocusedCell;
                    self.cellClicked(currentFocusedCell, event);
                },
                onClickEventEquals(model: any): void {
                    self.selectAll(false, false);
                    self.setSelected(model, !self.isSelected(model), true);
                }
            });
        } else {
            this.removeNavigator();
        }
    }

    removeNavigator() {
        if (this.cellNavigator != null) {
            this.cellNavigator.removeHandlers();
            this.cellNavigator = null;
        }
    }

    cellClicked(model: any, mouseEvent: MouseEvent) {
        if (mouseEvent != null && (mouseEvent.metaKey || !this.useMataKeyForSelection)) {
            this.setSelected(<T><any>model, !this.isSelected(<T><any>model), true);
        } else if (mouseEvent != null && mouseEvent.shiftKey) {
            this.selectRegion(model);
        } else {
            this.selectAll(false, false);
            this.setSelected(<T><any>model, !this.isSelected(<T><any>model), true);
        }
    }

    selectRegion(model: any) {
        if (this.lastSelectedModelWithoutShiftPressed != null) {
            let lastSelectedRow: number = this.owner.getRowsFiltered().indexOf(this.lastSelectedModelWithoutShiftPressed);
            let selectedRow: number = this.owner.getRowsFiltered().indexOf(model);
            for (let i: number = Math.min(lastSelectedRow, selectedRow); i <= Math.max(lastSelectedRow, selectedRow); i++) {
                this.setSelected(<T><any>this.owner.getRowCell(i).getModel(), true, true);
            }
        }
    }

    public getItems(): List<T> {
        return this.owner.getRowsData();
    }

    public getOwner(): AbstractCellComponent<any, any, any> {
        return this.owner;
    }

    public getCellNavigator(): ListTreeCellNavigator {
        return this.cellNavigator;
    }

    /**
     *
     * @param {core.selectionmodel.DefaultMultiSelectionModel.SelectionMode} selectionMode
     */
    public setSelectionMode(selectionMode: SelectionMode) {
        if (selectionMode === SelectionMode.MULTI) {
            this.setInvokeType(InvokeType.ON_CELL_CLICKED);
        }
        super.setSelectionMode(selectionMode);
    }

    public getInvokeType(): InvokeType {
        return this.invokeType;
    }

    public setInvokeType(invokeType: InvokeType) {
        if (this.selectionMode === SelectionMode.MULTI) return;
        this.invokeType = invokeType;
    }

    useMataKeyForSelection: boolean = true;

    /**
     * Use meta key when selecting multiple items. Default to true.
     *
     * @param {boolean} b
     */
    public useMetaKeyForSelection(b: boolean) {
        this.useMataKeyForSelection = b;
    }
}

export enum InvokeType {
    ON_CELL_CLICKED, ON_FOCUS
}

export class ListTreeCellNavigator extends BaseCellNavigator {
    public constructor(owner: AbstractCellComponent<any, any, any>, view: HasNavigationHandler) {
        super(owner, view);
    }

    moveCellUp(keyboardEvent: KeyboardEvent) {
        let obj: any = this.owner.getRowsFiltered().get(this.owner.getRowsFiltered().indexOf(this.currentFocusedModel) + 1);
        this.selectCell(obj, keyboardEvent);
    }

    moveCellDown(keyboardEvent: KeyboardEvent) {
        let obj: any = this.owner.getRowsFiltered().get(this.owner.getRowsFiltered().indexOf(this.currentFocusedModel) - 1);
        this.selectCell(obj, keyboardEvent);
    }

    public working: boolean = false;

    timerFn = () => {
        this.working = false;
    };

    private selectCell(obj: any, keyboardEvent: KeyboardEvent) {
        this.working = true;
        this.setVal(obj, true, keyboardEvent);
        setTimeout(this.timerFn, 500);
    }

    public focusCurrentCell() {
        this.selectCell(this.currentFocusedModel, null);
    }

    moveCellLeft(keyboardEvent: KeyboardEvent) {
        this.moveCellDown(keyboardEvent);
    }

    moveCellRight(keyboardEvent: KeyboardEvent) {
        this.moveCellUp(keyboardEvent);
    }
}

