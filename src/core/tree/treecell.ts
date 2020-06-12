import {CellFactory} from '../corecls/CellFactory';
import {TreeNode} from './TreeNode';
import {Tree} from './Tree';
import {BaseCell, BaseCellBuilder} from '../BaseCell';
import {
    BaseTreeCellView,
    HasTreeUi,
    ParentTreeCellView,
    TreeCellCheckboxParentView,
    TreeCellCheckboxSimpleView,
    TreeUi
} from './view/TreeUi';
import {ClickHandler, CloseEvent, OpenEvent} from '../corecls/handlers';
import {ValueChangeHandler} from '../corecls/ValueClasses';
import {SelectionState, TreeMultiSelectionModel} from './TreeMultiSelectionModel';
import {HasIcon, isHasIconInterface} from './HasIcon';


export abstract class AbstractTreeCell<T, M> extends BaseCell<TreeNode<T>, M> {

    protected icon: string;

    constructor(cellView: BaseTreeCellView) {
        super(cellView);
    }

    public static getCell<T, M>(treeNode: TreeNode<T>, checkBox: boolean): AbstractTreeCell<T, M> {
        let tree: AbstractTreeCell<any, any>;
        if (checkBox)
            tree = AbstractTreeCell.getCellCheckBox<T, M>(treeNode);
        else
            tree = AbstractTreeCell.getCelll(treeNode);
        if (isHasIconInterface(treeNode.getUserObject()))
            tree.icon = (<HasIcon>treeNode.getUserObject()).getIcon();
        return tree;
    }


    static getCellCheckBox<T, M>(treeNode: TreeNode<any>): AbstractTreeCell<T, M> {
        if (treeNode.isLeaf()) {
            return new TreeCellCheckboxSimple<any, any>();
        } else {
            return new TreeCellCheckboxParent<any, any>();
        }
    }

    public static getCelll<T, M>(treeNode: TreeNode<any>): AbstractTreeCell<T, M> {
        if (treeNode.isLeaf()) {
            return new TreeCellSimple();
        } else {
            return new TreeCellParent();
        }
    }

    public draw() {
        super.draw();
        this.getCellView().setPadding(this.getModel().getLevel() * 10 + 5);
    }

    /** // @ts-ignore */
    // @ts-ignore
    public getOwner(): Tree<T> {
        return <Tree<any>>super.getOwner();
    }

    getUi(): TreeUi {
        return (<HasTreeUi><any>super.getUi()).getTreeUi();
    }

    public getCellView(): BaseTreeCellView {
        return <BaseTreeCellView><any>super.getCellView();
    }

    public setVisible(b: boolean) {
        this.cellView.asElement().setAttribute('style', 'display: none;');
    }
}


/** // @ts-ignore */
// @ts-ignore
export interface TreeCellFactory<T, M> extends CellFactory<TreeNode<T>, M, Tree<T>> {

    getCell(c?: any): AbstractTreeCell<T, M>;
}


export class TreeCellSimple<T, M> extends AbstractTreeCell<T, M> {
    constructor()
    constructor(treeCellView?: BaseTreeCellView)
    constructor(treeCellView?: BaseTreeCellView) {
        super(treeCellView);
    }

    initViewFromOwner() {
        this.cellView = this.getUi().getTreeCellView(this.icon);
    }
}

export class TreeCellParent<T, M> extends AbstractTreeCell<T, M> {
    constructor()
    constructor(treeCellView?: ParentTreeCellView)
    constructor(treeCellView?: ParentTreeCellView) {
        super(treeCellView);
    }

    public setExpanded(b: boolean) {
        this.getModel().setExpanded(b);
        this.getOwner().drawData();
        if (b)
            OpenEvent.fire(this.getOwner(), this.getModel());
        else
            CloseEvent.fire(this.getOwner(), this.getModel());
    }

    bind() {
        super.bind();
        this.getCellView().addOpenCloseHandler(ClickHandler.onClick(evt =>
            this.setExpanded(!this.getModel().isExpanded())));
    }

    public draw() {
        super.draw();
        this.getCellView().setOpened(this.getModel().isExpanded());
    }

    public getCellView(): ParentTreeCellView {
        return <ParentTreeCellView><any>super.getCellView();
    }

    initViewFromOwner() {
        this.cellView = this.getUi().getParentTreeCellView(this.icon);
    }
}

export class TreeCellCheckboxSimple<T, M> extends TreeCellSimple<T, M> {

    constructor()
    constructor(treeCellView?: TreeCellCheckboxSimpleView)
    constructor(treeCellView?: TreeCellCheckboxSimpleView) {
        super(treeCellView);
    }

    bind() {
        super.bind();
        this.getCellView().getCheckBox()
            .addValueChangeHandler(ValueChangeHandler.onValueChange(evt =>
                this.getOwner().getSelectionModel().setSelected(this.getModel(), evt.value, true)));
    }

    public getCellView(): TreeCellCheckboxSimpleView {
        return <TreeCellCheckboxSimpleView>super.getCellView();
    }

    initViewFromOwner() {
        this.cellView = this.getUi().getTreeCellCheckBoxView(this.icon);
    }
}

export class TreeCellCheckboxParent<T, M> extends TreeCellParent<T, M> {

    constructor()
    constructor(treeCellView?: TreeCellCheckboxParentView)
    constructor(treeCellView?: TreeCellCheckboxParentView) {
        super(treeCellView);
    }

    bind() {
        super.bind();
        this.getCellView().getCheckBox().addValueChangeHandler(ValueChangeHandler.onValueChange(evt =>
            this.getOwner().getSelectionModel().setSelected(this.getModel(), evt.value, true)));
    }


    setSelection() {
        let state: SelectionState = this.getSelectionModel().getNodeState(this.getModel());
        if (state === SelectionState.INDETERMINATE) {
            this.getCellView().setIndeterminate(true);
        } else {
            this.getCellView().setIndeterminate(false);
            this.setSelected(state === SelectionState.CHECKED);
        }
    }

    initViewFromOwner() {
        this.cellView = this.getUi().getParentTreeCellCheckboxView(this.icon);
    }

    getSelectionModel(): TreeMultiSelectionModel {
        return <TreeMultiSelectionModel>this.getOwner().getSelectionModel();
    }

    public getCellView(): TreeCellCheckboxParentView {
        return <TreeCellCheckboxParentView><any>super.getCellView();
    }
}

/** // @ts-ignore */
// @ts-ignore
export abstract class AbstractTreeCellBuilder<T, M> extends BaseCellBuilder<TreeNode<T>, M, AbstractTreeCellBuilder<T, M>> {

    /** // @ts-ignore */
    // @ts-ignore
    public abstract build(): AbstractTreeCell<T, M>;
}