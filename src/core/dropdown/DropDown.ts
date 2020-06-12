import {
    ClickHandler,
    CloseEvent,
    CloseHandler,
    HasCloseHandlers,
    HasOpenHandlers,
    OpenEvent,
    OpenHandler,
    SelectionEvent
} from '../corecls/handlers';
import {BaseComponentMultiSelection, CanSelect} from '../BaseComponentMultiSelection';
import {BaseComponent, MainRenderer, MainRendererImpl} from '../BaseComponent';
import {DropDownItemView, DropDownUi} from './DropDownUi';
import {Ui} from '../views/Ui';
import {SelectionMode} from '../corecls/selectionmodel/selectionImpl';
import {HandlerRegistration} from '../corecls/events';
import {ComponentHtmlParser} from '../ComponentHtmlParser';
import {ItemId} from '../corecls/entities';
import {Util} from '../corecls/Util';

export class DropDown<T> extends BaseComponentMultiSelection<T, DropDownUi, DropDownItem<T>> implements HasOpenHandlers<any>, HasCloseHandlers<any> {

    renderer: MainRenderer<T> = new MainRendererImpl<T>();
    menuVisible: boolean = false;
    clickOutHandlerRegistration: HandlerRegistration;

    constructor();
    constructor(view?: DropDownUi) ;
    constructor(view?: DropDownUi) {
        super(view ? view : Ui.get().getDropDownUi());
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
        this.selectionGroup.setSelectionMode(SelectionMode.SINGLE);
    }

    fireOpenCloseEvent() {
        if (this.menuVisible)
            OpenEvent.fire(this, this);
        else
            CloseEvent.fire<any>(this, this);
    }

    public setSelected(item: DropDownItem<T>, b: boolean, fireEvent?: boolean): boolean {
        SelectionEvent.fire(this, item);
        return super.setSelected(item, b, fireEvent);
    }

    public setButtonContent(content: string) {
        this.view.getRootView().setButtonContent(content);
    }

    public showMenu(b: boolean) {
        this.view.getRootView().showList(b);
        this.menuVisible = b;
    }

    public addItem(item: DropDownItem<T>) {
        super.addItem(item);
        this.view.getRootView().addItem(item);
    }

    public removeItem(item: DropDownItem<T>) {
        super.removeItem(item);
        this.view.getRootView().removeItem(item);
    }

    public createItem(t: T): DropDownItem<T> {
        return <any>(new DropDownItem<any>(this, t));
    }

    public addOpenHandler(handler: OpenHandler<any>): HandlerRegistration {
        return handler.addTo(this.asElement());
    }

    public addCloseHandler(handler: CloseHandler<any>): HandlerRegistration {
        return handler.addTo(this.asElement());
    }

    public setItemRenderer(renderer: MainRenderer<T>) {
        this.renderer = renderer;
    }

    getView(): DropDownUi {
        return super.getView();
    }
}

export class DropDownItem<T> extends BaseComponent<T, DropDownItemView> implements CanSelect {
    dropDown: DropDown<T>;

    private selected: boolean;

    constructor(dropDown: DropDown<T>, userObject: T) {
        super(dropDown.getView().getDropDownItemView());
        this.dropDown = dropDown;
        this.setRenderer(dropDown.renderer);
        this.setUserObject(userObject);
        this.init();
    }

    init() {
        this.view.addClickHandler(ClickHandler.onClick(evt => {
            this.dropDown.setSelected(this, !this.isSelected(), true);
        }));
    }

    public setContent(content: string | HTMLElement) {
        if (typeof content === 'string')
            this.view.setContent(content);
        else
            this.view.setHtmlContent(content);
    }

    public isActive(): boolean {
        return this.selected;
    }

    public setActive(active: boolean) {
        this.selected = active;
        this.view.setActive(active);
    }

    public static is(): string {
        return 'dropdown-item-dn';
    }

    public setSelected(b: boolean) {
        this.selected = b;
        this.view.setActive(this.selected);
    }

    public isSelected(): boolean {
        return this.selected;
    }

    public setRenderer(renderer: MainRenderer<T>) {
        super.setRendererBase(renderer);
    }
}

export class DropDownHtmlParser extends ComponentHtmlParser {

    private static instance: DropDownHtmlParser;

    private constructor() {
        super();
    }

    public static getInstance(): DropDownHtmlParser {
        if (this.instance == null)
            return this.instance = new DropDownHtmlParser();
        return this.instance;
    }

    public parse(htmlElement: Element, elements: Map<string, any>): BaseComponent<any, any> {
        let dropDown: DropDown<ItemId>;
        let view = this.getView(this.getClazz(), htmlElement, elements);
        if (view != null)
            dropDown = new DropDown<ItemId>(<any>view);
        else
            dropDown = new DropDown<ItemId>();

        if (htmlElement.hasAttribute(ComponentHtmlParser.CONTENT)) {
            dropDown.setButtonContent(htmlElement.getAttribute(ComponentHtmlParser.CONTENT));
        }

        let elementsByTagName = htmlElement.getElementsByTagName(ComponentHtmlParser.ITEM);
        for (let i = 0; i < elementsByTagName.length; i++) {
            let dropDownItem = this.parseItem(<HTMLElement>elementsByTagName.item(i), dropDown);
            dropDown.addItem(dropDownItem);
        }
        this.replaceAndCopy(htmlElement, dropDown);
        return dropDown;
    }

    public parseItem(node: HTMLElement, dropDown: DropDown<any>): DropDownItem<ItemId> {
        return new DropDownItem(dropDown, this.getIdItem(node));
    }

    public getId(): string {
        return 'dn-dropdown';
    }

    public getClazz(): string {
        return 'DropDown';
    }

}