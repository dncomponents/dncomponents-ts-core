import {DropDownTreeNodePanel} from './DropDownTreeNodePanel';
import {java} from 'j4ts';
import {TreeNode} from '../tree/TreeNode';
import {DropDownItemMultiLevel} from './DropDownItemMultiLevel';
import {BaseComponent, MainRenderer, MainRendererImpl, MainViewSlots} from '../BaseComponent';
import {DropDownMultiLevelUi} from './view/DropDownMultiLevelUi';
import {
    ClickHandler,
    CloseEvent,
    CloseHandler,
    HasCloseHandlers,
    HasOpenHandlers,
    OpenEvent,
    OpenHandler
} from '../corecls/handlers';
import {SingleSelectionModel} from '../corecls/selectionmodel/selection';
import {Ui} from '../views/Ui';
import {Util} from '../corecls/Util';
import {HandlerRegistration} from '../corecls/events';
import {IsElement} from '../corecls/IsElement';
import {ComponentHtmlParser} from '../ComponentHtmlParser';
import {DefaultSingleSelectionModel} from '../corecls/selectionmodel/selectionImpl';
import {ItemId} from '../corecls/entities';
import {TreeHtmlParser} from '../tree/Tree';

export class DropDownMultiLevel<T> extends BaseComponent<TreeNode<T>, DropDownMultiLevelUi> implements HasOpenHandlers<any>, HasCloseHandlers<any> {

    singleSelectionModel: SingleSelectionModel<TreeNode<T>>;
    itemRenderer: MainRenderer<TreeNode<T>>;
    rows: java.util.List<TreeNode<T>>;
    menuVisible: boolean=false;
    private triggerType: DropDownMultiLevel.TriggerType = DropDownMultiLevel.TriggerType.HOVER;
    dropDownPanel: DropDownTreeNodePanel<T>;
    clickOutHandlerRegistration: HandlerRegistration;

    public constructor(ui?: DropDownMultiLevelUi) {
        super(ui ? ui : Ui.get().getDropDownMultiLevelUi());
        this.view.getRootView().addClickOnButton(ClickHandler.onClick(evt => {
            this.showMenu(!this.menuVisible);
            this.fireOpenCloseEvent();
            if (this.menuVisible) {
                this.clickOutHandlerRegistration = this.view.getRootView().addClickOutOfButton(ClickHandler.onClick(evt => {
                    if (!Util.isDescendant(this.asElement(), <Element>evt.target)) {
                        this.clickOutHandlerRegistration.removeHandler();
                        this.clickOutHandlerRegistration = null;
                        this.showMenu(false);
                    }
                }));
            }
        }));
        let self = this;
        this.singleSelectionModel = new class extends DefaultSingleSelectionModel<TreeNode<T>> {
            getItems(): java.util.List<TreeNode<T>> {
                return self.rows;
            }
        };
        this.itemRenderer = new MainRendererImpl<any>();
    }

    fireOpenCloseEvent() {
        if (this.menuVisible)
            OpenEvent.fire(this, this);
        else
            CloseEvent.fire(this, this);
    }

    public setRoot(root: TreeNode<T>) {
        this.setUserObject(root);
        this.rows = root.getAllChildNodesInOrder();
    }

    public setSelected(item: DropDownItemMultiLevel<T>, b: boolean, fireEvent: boolean) {
        this.singleSelectionModel.setSelected(item.getValue(), b, fireEvent);
    }

    public setButtonContent(content: string | HTMLElement): void {
        if (Util.isString(content)) {
            this.view.getRootView().setButtonContent(content);
        } else if (content instanceof HTMLElement) {
            this.view.getRootView().setButtonHtmlContent(content);

        }
    }

    public showMenu(b: boolean) {
        if (this.dropDownPanel == null) {
            this.dropDownPanel = new DropDownTreeNodePanel<T>(this, this.userObject);
            this.view.getRootView().addDropDownPanel(this.dropDownPanel);
        }
        this.menuVisible = b;
        this.dropDownPanel.showRel(this.view.getRootView().getRelativeElement(), b, 'bottom');
    }

    public addOpenHandler(handler: OpenHandler<any>): HandlerRegistration {
        return handler.addTo(this.asElement());
    }


    public addCloseHandler(handler: CloseHandler<any>): HandlerRegistration {
        return handler.addTo(this.asElement());
    }

    public setItemRenderer(renderer: MainRenderer<TreeNode<T>>) {
        this.itemRenderer = renderer;
    }

    getView(): DropDownMultiLevelUi {
        return super.getView();
    }

    public setTriggerType(triggerType: DropDownMultiLevel.TriggerType) {
        this.triggerType = triggerType;
    }

    public getTriggerType(): DropDownMultiLevel.TriggerType {
        return this.triggerType;
    }

    getRelativeElement(): IsElement<any> {
        return this.view.getRootView().getRelativeElement();
    }

    public getSingleSelectionModel(): SingleSelectionModel<TreeNode<T>> {
        return this.singleSelectionModel;
    }
}

export namespace DropDownMultiLevel {

    export enum TriggerType {
        CLICK, HOVER
    }
}


export class DropDownMultiLevelHtmlParser extends ComponentHtmlParser {


    private static instance: DropDownMultiLevelHtmlParser;

    private DropDownMultiLevelHtmlParser() {
    }

    public static getInstance(): DropDownMultiLevelHtmlParser {
        if (this.instance == null)
            return this.instance = new DropDownMultiLevelHtmlParser();
        return this.instance;
    }

    public parse(htmlElement: Element, elements: Map<string, any>): BaseComponent<any, any> {
        let dropDown: DropDownMultiLevel<ItemId>;
        let ui = this.getView(this.getClazz(), htmlElement, elements);
        if (ui != null)
            dropDown = new DropDownMultiLevel<ItemId>(<any>ui);
        else
            dropDown = new DropDownMultiLevel<ItemId>();

        if (htmlElement.hasChildNodes()) {
            dropDown.setItemRenderer({
                render(idItemTreeNode: TreeNode<ItemId>, slots: MainViewSlots): void {
                    slots.getMainSlot().innerHTML = idItemTreeNode.getUserObject().getContent();
                }
            });
            let root = new TreeNode<ItemId>(new ItemId('root', 'root'));
            TreeHtmlParser.parseItem(<HTMLElement>htmlElement, root, this);
            dropDown.setRoot(root);
        }

        if (htmlElement.hasAttribute(ComponentHtmlParser.CONTENT)) {
            dropDown.setButtonContent(htmlElement.getAttribute(ComponentHtmlParser.CONTENT));
        }

        this.replaceAndCopy(htmlElement, dropDown);
        return dropDown;
    }

    public getId(): string {
        return 'dn-dropdown-multilevel';
    }

    public getClazz(): string {
        return 'DropDownMultiLevel';
    }

}