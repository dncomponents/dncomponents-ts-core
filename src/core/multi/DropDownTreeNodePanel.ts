import {java} from 'j4ts';
import {DropDownItemMultiLevel} from './DropDownItemMultiLevel';
import {TreeNode} from '../tree/TreeNode';
import {BaseHasView} from './BaseHasView';
import {DropDownTreeNodePanelView} from './view/DropDownMultiLevelUi';
import {DropDownItemMultiLevelParent} from './DropDownItemMultiLevelParent';
import {MouseEnterHandler, MouseLeaveHandler} from '../corecls/handlers';
import {IsElement} from '../corecls/IsElement';
import {DropDownMultiLevel} from './DropDownMultiLevel';
import Collectors = java.util.stream.Collectors;

export class DropDownTreeNodePanel<T> extends BaseHasView<TreeNode<T>, DropDownTreeNodePanelView> {
    dropDown: DropDownMultiLevel<T>;
    dropDownItem: DropDownItemMultiLevel<T>;
    nextDropDownPanel: DropDownTreeNodePanel<T>;
    previousDropDownPanel: DropDownTreeNodePanel<T>;
    private items: java.util.List<DropDownItemMultiLevel<T>>;
    mouseOver: boolean;
    visible: boolean;

    public constructor(dropDownItem: any, node: TreeNode<T>) {
        if (dropDownItem instanceof DropDownItemMultiLevel) {
            super(dropDownItem.owner.dropDown.getView().getDropDownTreeNodePanelView());
            this.dropDownItem = dropDownItem;
            this.dropDown = dropDownItem.owner.dropDown;
        } else if (dropDownItem instanceof DropDownMultiLevel) {
            super(dropDownItem.getView().getDropDownTreeNodePanelView());
            this.dropDown = dropDownItem;
        }
        this.mouseOver = false;
        this.visible = false;
        this.setValue(node);
        this.init();
    }

    private init(): void {
        this.items = this.value.getChildren()
            .stream()
            .map(tTreeNode => this.createItem(tTreeNode))
            .collect(Collectors.toList());
        this.items.forEach((e) => this.view.add(e));
        this.view.addMouseEnterHandler(MouseEnterHandler.onMouseEnter(e => this.mouseOver = true));
        this.view.addMouseLeaveHandler(MouseLeaveHandler.onMouseLeave(e => {
            this.mouseOver = false;
            setTimeout(p => {
                if (!((this.nextDropDownPanel != null && this.nextDropDownPanel.mouseOver)
                    || this.isDropDownItemMouseOver()
                    || this.isFirstLevel())) {
                    let pnl: DropDownTreeNodePanel<T> = this;
                    pnl.show(false);
                    while (pnl != null
                    && pnl.previousDropDownPanel != null
                    && !pnl.previousDropDownPanel.mouseOver
                    && pnl.previousDropDownPanel.visible
                    && pnl.previousDropDownPanel.getValue().getLevel() >= 0) {
                        pnl.show(false);
                        pnl = pnl.previousDropDownPanel;
                    }
                }
            }, 50);
        }));
    }

    private isFirstLevel(): boolean {
        return this.getValue().getLevel() === 0;
    }

    private createItem(item: TreeNode<T>): DropDownItemMultiLevel<T> {
        if (item.isLeaf())
            return new DropDownItemMultiLevel(this, item);
        else
            return new DropDownItemMultiLevelParent(this, item);
    }

    public show(b: boolean) {
        this.showRel(this.dropDownItem, b, 'right-start');
    }

    public showRel(relativeElement: IsElement<any>, b: boolean, orientation: string) {
        this.view.show(relativeElement, b, orientation);
        this.visible = b;
        if (!b && this.nextDropDownPanel != null && this.nextDropDownPanel.visible)
            this.nextDropDownPanel.show(false);
    }

    private isDropDownItemMouseOver(): boolean {
        if (this.dropDownItem != null && this.dropDownItem instanceof DropDownItemMultiLevelParent)
            return (<DropDownItemMultiLevelParent<T>>this.dropDownItem).mouseOver;
        else
            return false;
    }
}
