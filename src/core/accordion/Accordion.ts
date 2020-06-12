import {BaseComponentMultiSelection} from '../BaseComponentMultiSelection';
import {AccordionUi} from './accrodion_views';
import {AccordionItem, RenderAccordionItem} from './AccordionItem';
import {Ui} from '../views/Ui';
import {SelectionMode} from '../corecls/selectionmodel/selectionImpl';
import {ComponentHtmlParser, ITEM} from '../ComponentHtmlParser';
import {ItemIdTitle} from '../corecls/entities';

export class Accordion<T> extends BaseComponentMultiSelection<T, AccordionUi, AccordionItem<T>> {
    multiExpand: boolean = true;
    allClosed: boolean = true;
    singleSelectionChanged: boolean;

    accordionItemRenderer: RenderAccordionItem<T>;

    constructor();
    constructor(ui: AccordionUi) ;
    constructor(ui?: AccordionUi) {
        super(ui ? ui : Ui.get().getAccordionUi());
    }


    addItem(item: AccordionItem<T>): void {
        super.addItem(item);
        this.view.getRootView().addItem(item);
        if (!this.allClosed && this.getItems().size() == 1)
            this.setSelected(this.getItems().get(0), true);
    }

    removeItem(item: AccordionItem<T>): void {
        super.removeItem(item);
        this.view.getRootView().removeItem(item);
    }

    removeAllItems(): void {
        super.removeAllItems();
        this.view.getRootView().clearAll();
    }

    protected createItem(t: T): AccordionItem<T> {
        return new AccordionItem<T>(this, t);
    }

    setSelected(model: AccordionItem<T>, b: boolean, fireEvent: boolean): boolean;
    setSelected(model: AccordionItem<T>, b: boolean): boolean;
    setSelected(model: AccordionItem<T>, b: boolean, fireEvent?: boolean): boolean {
        if (this.singleSelectionChanged)
            this.clearSelection(model);
        if (!this.allClosed && this.getSelection().size() == 1 && ((this.getSelection().get(0)) === model) && !b) {
            return false;
        } else
            return super.setSelected(model, b, fireEvent);
    }

    private clearSelection(item: AccordionItem<T>): void {
        if (this.selectionGroup.getSelectionMode() == SelectionMode.SINGLE) {
            this.singleSelectionChanged = false;
            for (let index = this.getItems().iterator(); index.hasNext();) {
                let item = index.next();
                this.setSelected(item, false, false);
            }
        }
    }

    public setItemRenderer(accordionItemRenderer: RenderAccordionItem<T>): void {
        this.accordionItemRenderer = accordionItemRenderer;
    }

    public isMultiExpand(): boolean {
        return this.multiExpand;
    }

    public setMultiExpand(multiExpand: boolean): void {
        this.multiExpand = multiExpand;
        this.singleSelectionChanged = !multiExpand;
        if (multiExpand)
            this.selectionGroup.setSelectionMode(SelectionMode.MULTI);
        else
            this.selectionGroup.setSelectionMode(SelectionMode.SINGLE);
    }

    public isAllClosed(): boolean {
        return this.allClosed;
    }

    public setAllClosed(allClosed: boolean): void {
        this.allClosed = allClosed;
    }

    getView(): AccordionUi {
        return super.getView();
    }

}

export class AccordionHtmlParser extends ComponentHtmlParser {

    TITLE_TAG = 'title';
    CONTENT_TAG = 'content';

    private static instance: AccordionHtmlParser;


    public static getInstance(): AccordionHtmlParser {
        if (this.instance == null)
            return this.instance = new AccordionHtmlParser();
        return this.instance;
    }


    public parse(htmlElement: Element, templateElement: Map<String, any>): Accordion<any> {
        let accordion = new Accordion<ItemIdTitle>();
        let elementsByTagName = htmlElement.getElementsByTagName(ITEM);
        for (let j = 0; j < elementsByTagName.length; j++) {
            let at = elementsByTagName[j];
            let accordionItem = this.parseAccordionItem(at, accordion);
            accordion.addItem(accordionItem);
        }
        this.replaceAndCopy(htmlElement, accordion);
        return accordion;
    }


    public getId(): string {
        return 'dn-accordion';
    }

    public getClazz(): string {
        return 'Accordion';
    }


    public parseAccordionItem(node: Element, accordion: Accordion<any>): AccordionItem<ItemIdTitle> {
        let item = new AccordionItem(accordion);
        let idItem = new ItemIdTitle();
        item.setUserObject(idItem);
        idItem.setId(this.getElementId(node));
        let titles = node.getElementsByTagName(this.TITLE_TAG);
        for (let i = 0; i < titles.length; i++) {
            idItem.setTitle(titles[i].textContent);
            item.getViewSlots().getTitle().innerHTML = titles[i].textContent;
            titles[i].remove();
            break;
        }
        let contents = node.getElementsByTagName(this.CONTENT_TAG);
        for (let i = 0; i < contents.length; i++) {
            idItem.setContent(contents[i].innerHTML);
            item.getViewSlots().getContent().innerHTML = contents[i].innerHTML;
            break;
        }
        return item;
    }
}