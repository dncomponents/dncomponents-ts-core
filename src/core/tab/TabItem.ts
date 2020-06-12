import {BaseComponent, Renderer} from '../BaseComponent';
import {CanSelect} from '../BaseComponentMultiSelection';
import {TabItemView} from './view/TabItemView';
import {Tab} from './Tab';
import {TabItemViewSlots} from './view/TabItemViewSlots';
import {IsElement} from '../corecls/IsElement';
import {Util} from '../corecls/Util';
import {
    BeforeSelectionEvent,
    BeforeSelectionHandler,
    HasBeforeSelectionHandlers,
    SelectionEvent
} from '../corecls/handlers';
import {HandlerRegistration} from '../corecls/events';

export class TabItem<T> extends BaseComponent<T, TabItemView> implements CanSelect, HasBeforeSelectionHandlers<any> {

    tab: Tab<T>;

    selected: boolean;

    constructor(tab: Tab<any>) {
        super(tab.getView().getTabItemView());
        this.tab = tab;
        this.setRenderer(tab.tabItemRenderer);
        this.bind();
    }

    bind() {
        this.view.addItemSelectedHandler(evt => {
            BeforeSelectionEvent.fire(this.tab, this);
            this.tab.setSelected(this, !this.isSelected(), true);
            SelectionEvent.fire(this.tab, this);
        });
    }

    getTitle(): HTMLElement {
        return this.view.getTabItemNav();
    }

    getContent(): HTMLElement {
        return this.view.getTabItemContent();
    }

    getView(): TabItemView {
        return super.getView();
    }

    public isSelected(): boolean {
        return this.selected;
    }

    public setSelected(b: boolean) {
        this.selected = b;
        this.view.select(b);
    }

    public setTitle$java_lang_String(html: string) {
        this.view.setItemTitleHtml(html);
    }


    public setTitle(title: HTMLElement | IsElement<any>) {
        this.view.setItemTitle(Util.getEl(title));
    }


    public setContent(content: HTMLElement | IsElement<any>) {
        this.view.setItemContent(Util.getEl(content));
    }

    public getOrder(): number {
        return this.tab.getItems().indexOf(this);
    }

    public addBeforeSelectionHandler(handler: BeforeSelectionHandler<any>): HandlerRegistration {
        return handler.addTo(this.asElement());
    }

    public setRenderer(renderer: RenderTabItem<T>) {
        super.setRendererBase(renderer);
    }

    public getViewSlots(): TabItemViewSlots {
        return <TabItemViewSlots><any>super.getViewSlots();
    }

    //chain methods
    setUserObject(t: T): TabItem<T> {
        super.setUserObject(t);
        return this;
    }
}

export interface RenderTabItem<T> extends Renderer<T, TabItemViewSlots> {
}
