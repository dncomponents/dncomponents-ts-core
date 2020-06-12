import {HandlerRegistration} from '../corecls/events';
import {BaseComponentSingleSelection} from '../BaseComponentSingleSelection';
import {TabUi} from './view/TabUi';
import {RenderTabItem, TabItem} from './TabItem';
import {BeforeSelectionHandler, HasBeforeSelectionHandlers} from '../corecls/handlers';
import {Ui} from '../views/Ui';
import {ComponentHtmlParser, ITEM} from '../ComponentHtmlParser';
import {BaseComponent} from '../BaseComponent';
import {ItemIdTitle} from '../corecls/entities';
import {TabItemViewSlots} from './view/TabItemViewSlots';

export class Tab<T> extends BaseComponentSingleSelection<T, TabUi, TabItem<T>> implements HasBeforeSelectionHandlers<TabItem<T>> {

    tabItemRenderer: RenderTabItem<T>;

    constructor();
    constructor(ui: TabUi);
    constructor(ui?: TabUi) {
        super(ui ? ui : Ui.get().getTabUi());
    }

    public addItem(item: TabItem<T>) {
        super.addItem(item);
        this.view.getRootView().addItem(item.getTitle(), item.getContent());
        this.setSelected(this.getItems().get(0), true);
    }

    public addBeforeSelectionHandler(handler: BeforeSelectionHandler<TabItem<T>>): HandlerRegistration {
        return handler.addTo(this.asElement());
    }

    getView(): TabUi {
        return super.getView();
    }

    public setTabItemRenderer(tabItemRenderer: RenderTabItem<T>) {
        this.tabItemRenderer = tabItemRenderer;
    }
}

export class TabHtmlParser extends ComponentHtmlParser {
    private static TITLE_TAG = 'title';
    private static ICON_TAG = 'icon';
    private static CONTENT_TAG = 'content';


    private static instance: TabHtmlParser;

    private ListHtmlParser() {
    }

    public static getInstance(): TabHtmlParser {
        if (this.instance == null)
            return this.instance = new TabHtmlParser();
        return this.instance;
    }

    public parse(htmlElement: Element, elements: Map<string, any>): BaseComponent<any, any> {
        let tab: Tab<ItemIdTitle>;
        let tabUi = this.getView(this.getClazz(), htmlElement, elements);
        if (tabUi != null)
            tab = new Tab(<any>tabUi);
        else
            tab = new Tab();
        tab.setTabItemRenderer({
            render(accordionIdItem: ItemIdTitle, slots: TabItemViewSlots): void {
                slots.getTitle().innerHTML = accordionIdItem.getTitle();
                slots.getContent().innerHTML = accordionIdItem.getContent();
                Ui.get().getIconRenderer().render(slots.getIcon(), accordionIdItem.getIcon());
            }
        });
        let elementsByTagName = htmlElement.getElementsByTagName(ITEM);
        for (let i = 0; i < elementsByTagName.length; i++) {
            let tabItem = this.parseTabItem(<HTMLElement>elementsByTagName.item(i), tab);
            tab.addItem(tabItem);
        }
        this.replaceAndCopy(htmlElement, tab);
        return tab;
    }

    public parseTabItem(html: HTMLElement, tab: Tab<any>): TabItem<ItemIdTitle> {
        let item = new TabItem<ItemIdTitle>(tab);
        let idItem = new ItemIdTitle();
        idItem.setId(this.getElementId(html));
        let titles = html.getElementsByTagName(TabHtmlParser.TITLE_TAG);
        for (let i = 0; i < titles.length; i++) {
            idItem.setTitle(titles.item(i).textContent);
            break;
        }
        let icons = html.getElementsByTagName(TabHtmlParser.ICON_TAG);
        for (let i = 0; i < icons.length; i++) {
            idItem.setIcon(icons.item(i).textContent);
            break;
        }
        let contents = html.getElementsByTagName(TabHtmlParser.CONTENT_TAG);
        for (let i = 0; i < contents.length; i++) {
            idItem.setContent(contents.item(i).innerHTML);
            break;
        }
        item.setUserObject(idItem);
        return item;
    }


    public getId(): string {
        return 'dn-tab';
    }

    public getClazz(): string {
        return 'Tab';
    }

}