import {DropDownItemMultiLevel} from './DropDownItemMultiLevel';
import {TreeNode} from '../tree/TreeNode';
import {ClickHandler, MouseEnterHandler, MouseLeaveHandler} from '../corecls/handlers';
import {DropDownItemMultiLevelParentView} from './view/DropDownMultiLevelUi';
import {DropDownTreeNodePanel} from './DropDownTreeNodePanel';
import {DropDownMultiLevel} from './DropDownMultiLevel';

export class DropDownItemMultiLevelParent<T> extends DropDownItemMultiLevel<T> {
    menuVisible: boolean;

    nextDropDownPanel: DropDownTreeNodePanel<T>;

    mouseOver: boolean;

    public constructor(panel: DropDownTreeNodePanel<T>, node: TreeNode<T>) {
        super(panel, node, panel.dropDown.getView().getDropDownItemMultiLevelParentView());
        this.initT();
    }

    private initT() {
        this.getView().addClickHandler(ClickHandler.onClick(evt => {
            if (this.owner.dropDown.getTriggerType() === (DropDownMultiLevel.TriggerType.CLICK)) {
                this.showMenuItems(this.menuVisible = !this.menuVisible);
            }
        }));
        this.getView().addMouseLeaveHandler(MouseLeaveHandler.onMouseLeave(evt => {
            if (this.owner.dropDown.getTriggerType() === (DropDownMultiLevel.TriggerType.HOVER)) {
                this.mouseOver = false;
                setTimeout(e => {
                    if (this.nextDropDownPanel != null && !this.nextDropDownPanel.mouseOver)
                        this.showMenuItems(false);
                }, 50);
            }
        }));
        this.getView().addMouseEnterHandler(MouseEnterHandler.onMouseEnter(evt => {
            this.mouseOver = true;
            if (this.owner.dropDown.getTriggerType() === (DropDownMultiLevel.TriggerType.HOVER)) {
                this.showMenuItems(true);
            }
        }));
    }

    private showMenuItems(b: boolean) {
        if (b) {
            if (this.nextDropDownPanel == null) {
                this.nextDropDownPanel = new DropDownTreeNodePanel(this, this.value);
                this.nextDropDownPanel.dropDown.getView().getRootView().addDropDownPanel(this.nextDropDownPanel);
            }
            this.owner.nextDropDownPanel = this.nextDropDownPanel;
            this.nextDropDownPanel.previousDropDownPanel = this.owner;
            this.nextDropDownPanel.show(b);
        } else {
            this.nextDropDownPanel.asElement().remove();
            this.nextDropDownPanel = null;
        }
    }

    private onMouseLeave(event: MouseEvent) {
        if (this.owner.dropDown.getTriggerType() === (DropDownMultiLevel.TriggerType.HOVER)) {
            this.mouseOver = false;
            setTimeout(e => {
                if (this.nextDropDownPanel != null && !this.nextDropDownPanel.mouseOver)
                    this.showMenuItems(false);
            }, 50);
        }
    }

    private onMouseEnter(mouseEvent: MouseEvent) {
        this.mouseOver = true;
        if (this.owner.dropDown.getTriggerType() === (DropDownMultiLevel.TriggerType.HOVER)) {
            this.showMenuItems(true);
        }
    }

    private onClick(mouseEvent: MouseEvent) {
        if (this.owner.dropDown.getTriggerType() === (DropDownMultiLevel.TriggerType.CLICK)) {
            this.showMenuItems(this.menuVisible = !this.menuVisible);
        }
    }

    getView(): DropDownItemMultiLevelParentView {
        return <DropDownItemMultiLevelParentView><any>super.getView();
    }
}