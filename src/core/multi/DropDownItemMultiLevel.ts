import {MainRenderer, ViewSlots} from '../BaseComponent';
import {TreeNode} from '../tree/TreeNode';
import {BaseHasView} from './BaseHasView';
import {DropDownItemView} from '../dropdown/DropDownUi';
import {DropDownTreeNodePanel} from './DropDownTreeNodePanel';
import {ClickHandler} from '../corecls/handlers';

export class DropDownItemMultiLevel<T> extends BaseHasView<TreeNode<T>, DropDownItemView> {

    owner: DropDownTreeNodePanel<T>;
    selected: boolean;

    public constructor(owner: DropDownTreeNodePanel<T>, node: TreeNode<T>, view?: DropDownItemView) {
        super(view ? view : owner.dropDown.getView().getDropDownItemView());
        this.init(owner, node);
    }

    public init(panel: DropDownTreeNodePanel<T>, node: TreeNode<T>) {
        this.owner = panel;
        this.setRenderer(panel.dropDown.itemRenderer);
        this.setValue(node);
        this.view.addClickHandler(ClickHandler.onClick(evt => {
            this.owner.dropDown.setSelected(this,
                !this.selected, true);
        }));
    }


    public setContent(content: string) {
        this.view.setContent(content);
    }

    public setContentHTMLElement(content: HTMLElement) {
        this.view.setHtmlContent(content);
    }

    public isActive(): boolean {
        return this.selected;
    }

    public setActive(active: boolean) {
        this.selected = active;
        this.view.setActive(active);
    }

    public setRenderer(renderer: MainRenderer<TreeNode<T>>) {
        super.setRendererBase(renderer);
    }

    getViewSlots(): ViewSlots {
        return super.getViewSlots();
    }
}