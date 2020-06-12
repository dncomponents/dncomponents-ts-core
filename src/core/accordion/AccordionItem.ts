import {BaseComponent, Renderer} from '../BaseComponent';
import {AccordionItemView, AccordionItemViewSlots} from './accrodion_views';
import {CanSelect} from '../BaseComponentMultiSelection';
import {Accordion} from './Accordion';
import {SelectionEvent} from '../corecls/handlers';

export class AccordionItem<T> extends BaseComponent<T, AccordionItemView> implements CanSelect {

    readonly accordion: Accordion<T>;
    selected: boolean;

    constructor(accordion: Accordion<T>);
    constructor(accordion: Accordion<T>, item: T);
    constructor(accordion: Accordion<T>, item?: T) {
        super(accordion.getView().getAccordionItemView());
        this.accordion = accordion;
        this.setRenderer(accordion.accordionItemRenderer);
        if (item != null)
            this.setUserObject(item);
        this.bind();
    }

    private bind(): void {
        this.view.addItemSelectedHandler(evt => {
            this.onItemSelected();
        });
    }

    onItemSelected(): void {
        // BeforeSelectionEvent.fire(accordion, this);
        this.accordion.setSelected(this, !this.isSelected(), true);
        SelectionEvent.fire(this.accordion, this);
    }

    isSelected(): boolean {
        return this.selected;
    }

    setSelected(b: boolean): void {
        this.selected = b;
        this.view.select(b);
    }

    public setTitleStr(html: string): void {
        this.getView().setItemTitle(html);
    }

    public setTitle(se: (e: HTMLElement) => void): void {
        se(this.getView().getViewSlots().getTitle());
    }

    public setContentStr(html: string): void {
        this.getView().setItemContent(html);
    }

    public setContent(se: (e: HTMLElement) => void): void {
        se(this.getView().getViewSlots().getContent());
    }

    public setRenderer(renderer: RenderAccordionItem<T>): void {
        super.setRendererBase(renderer);
    }

    public getViewSlots(): AccordionItemViewSlots {
        return <AccordionItemViewSlots>super.getViewSlots();
    }
}

export interface RenderAccordionItem<T> extends Renderer<T, AccordionItemViewSlots> {
}