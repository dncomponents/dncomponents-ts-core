import {TableCell} from '../TableUtil';
import {TreeNode} from '../../tree/TreeNode';
import {
    BaseTreeCellView,
    ParentTreeCellView,
    TreeCellCheckboxParentView,
    TreeCellCheckboxSimpleView
} from '../../tree/view/TreeUi';
import {TableTree} from '../Table';
import {RendererContext} from '../../BaseCell';
import {ClickHandler, CloseEvent, OpenEvent, SelectionHandler} from '../../corecls/handlers';
import {ValueChangeHandler} from '../../corecls/ValueClasses';
import {SelectionState, TreeMultiSelectionModel} from '../../tree/TreeMultiSelectionModel';
import {TableTreeUi} from "../TableTreeUi";

export abstract class AbstractTableTreeCell<M> extends TableCell<TreeNode<M>, Object> {

    public constructor(cellView?: BaseTreeCellView) {
        super(cellView);
    }

    public static getCell(treeNode: TreeNode<any>, checkBox: boolean): AbstractTableTreeCell<any> {
        if (checkBox)
            return this.getCellCheckBox(treeNode);
        else
            return this.getCellTn(treeNode);
    }

    private static getCellCheckBox(treeNode: TreeNode<any>): AbstractTableTreeCell<any> {
        if (treeNode.isLeaf()) {
            return new TableTreeCellCheckboxSimple();
        } else {
            return new TableTreeCellCheckboxParent();
        }
    }

    public static getCellTn(treeNode: TreeNode<any>): AbstractTableTreeCell<any> {
        if (treeNode.isLeaf()) {
            return new TableTreeCellSimple();
        } else {
            return new TableTreeCellParent();
        }
    }

    public draw(): void {
        super.draw();
        this.getCellView().setPadding(this.getModel().getLevel() * 10 + 5);
    }

    protected getUi(): TableTreeUi {
        return <TableTreeUi>super.getUi();
    }

    public getOwner(): TableTree<M> {
        return <TableTree<M>>super.getOwner();
    }

    public getCellView(): BaseTreeCellView {
        return <BaseTreeCellView>super.getCellView();
    }

    public setVisible(b: boolean): void { //TODO
        this.cellView.asElement().setAttribute('style', 'display: none;');
    }
}

export class TableTreeCellSimple<M> extends AbstractTableTreeCell<M> {

    constructor(treeCellView?: BaseTreeCellView) {
        super(treeCellView);
    }

    protected initViewFromOwner(): void {
        this.cellView = this.getUi().getTreeUi().getTreeCellView(null);
    }

}

export class TableTreeCellParent<M> extends AbstractTableTreeCell<M> {

    constructor(cellView?: ParentTreeCellView) {
        super(cellView);
        this.setRenderer({
            setValue(r: RendererContext<TreeNode<M>, Object>): void {
                r.valuePanel.innerHTML =
                    r.cell.getModel().getUserObject() == null ? 'empty' :
                        r.cell.getModel().getUserObject().toString();
            }
        });

    }

    public setExpanded(b: boolean): void {
        this.getModel().setExpanded(b);
        this.getOwner().drawData();
        if (b)
            OpenEvent.fire(this.getOwner(), this.getModel());
        else
            CloseEvent.fire(this.getOwner(), this.getModel());
    }

    public bind(): void {
        super.bind();
        this.getCellView().addOpenCloseHandler(ClickHandler.onClick(evt =>
            this.setExpanded(!this.getModel().isExpanded())
        ));
    }

    public draw(): void {
        super.draw();
        this.getCellView().setOpened(this.getModel().isExpanded());
    }

    public getCellView(): ParentTreeCellView {
        return <ParentTreeCellView>super.getCellView();
    }

    protected initViewFromOwner(): void {
        this.cellView = this.getUi().getTreeUi().getParentTreeCellView(null);
    }

}

export class TableTreeCellCheckboxSimple<M> extends TableTreeCellSimple<M> {

    constructor(treeCellView?: TreeCellCheckboxSimpleView) {
        super(treeCellView);
    }

    bind(): void {
        super.bind();
        this.getCellView().getCheckBox().addValueChangeHandler(ValueChangeHandler.onValueChange(evt =>
            this.getOwner().getSelectionModel().setSelected(this.getModel(), evt.value, true)
        ));
        this.getOwner().getSelectionModel().addSelectionHandler(SelectionHandler.onSelection(evt =>
            this.draw()
        ));
    }

    public draw(): void {
        super.draw();
        this.setSelectionBase();
    }

    public getCellView(): TreeCellCheckboxSimpleView {
        return <TreeCellCheckboxSimpleView>super.getCellView();
    }

    protected initViewFromOwner(): void {
        this.cellView = this.getUi().getTreeUi().getTreeCellCheckBoxView(null);
    }
}

export class TableTreeCellCheckboxParent<M> extends TableTreeCellParent<M> {

    public constructor(cellView?: TreeCellCheckboxParentView) {
        super(cellView);
    }

    bind(): void {
        super.bind();
        this.getCellView().getCheckBox().addValueChangeHandler(ValueChangeHandler.onValueChange(evt =>
            this.getOwner().getSelectionModel().setSelected(this.getModel(), evt.value, true))
        );

        this.getOwner().getSelectionModel().addSelectionHandler(SelectionHandler.onSelection(evt =>
            this.draw()
        ));
    }

    setSelection(): void {
        let state = this.getSelectionModel().getNodeState(this.getModel());
        if (state == SelectionState.INDETERMINATE) {
            this.getCellView().setIndeterminate(true);
        } else {
            this.getCellView().setIndeterminate(false);
            this.setSelected(state == SelectionState.CHECKED);
        }
    }

    public draw(): void {
        super.draw();
        this.setSelection();
    }

    protected initViewFromOwner(): void {
        this.cellView = this.getUi().getTreeUi().getParentTreeCellCheckboxView(null);
    }

    getSelectionModel(): TreeMultiSelectionModel {
        return <TreeMultiSelectionModel>this.getOwner().getSelectionModel();
    }

    public getCellView(): TreeCellCheckboxParentView {
        return <TreeCellCheckboxParentView>super.getCellView();
    }
}
