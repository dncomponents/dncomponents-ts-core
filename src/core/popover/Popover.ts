import {BaseTooltip, Orientation, Trigger} from '../tooltip/BaseTooltip';
import {CloseEvent, CloseHandler, HasCloseHandlers, HasOpenHandlers, OpenEvent, OpenHandler} from '../corecls/handlers';
import {PopoverRenderer, PopoverView, PopoverViewSlots} from './view/PopoverView';
import {HandlerRegistration} from '../corecls/events';
import {Ui} from '../views/Ui';
import {ComponentHtmlParser} from '../ComponentHtmlParser';
import {BaseComponent} from '../BaseComponent';
import {java} from 'j4ts';
import {Util} from '../corecls/Util';
import {IsElement} from '../corecls/IsElement';
import RuntimeException = java.lang.RuntimeException;

export class Popover<T> extends BaseTooltip<T, PopoverView> implements HasCloseHandlers<Popover<T>>, HasOpenHandlers<Popover<T>> {

    constructor();
    constructor(view: PopoverView);
    constructor(view?: PopoverView) {
        super(view ? view : Ui.get().getPopoverView());
    }

    public setTitle(title: string) {
        this.view.setPopoverTitle(title);
    }

    public addCloseHandler(handler: CloseHandler<Popover<T>>): HandlerRegistration {
        return handler.addTo(this.asElement());
    }

    public addOpenHandler(handler: OpenHandler<Popover<T>>): HandlerRegistration {
        return handler.addTo(this.asElement());
    }

    public fireShowEvent() {
        OpenEvent.fire(this, this);
    }

    public fireCloseEvent() {
        CloseEvent.fire<any>(this, this);
    }

    public setRenderer(renderer: PopoverRenderer<T>) {
        super.setRendererBase(renderer);
    }


    public getViewSlots(): PopoverViewSlots {
        return <PopoverViewSlots>super.getViewSlots();
    }

    //chain methods
    setOwner(owner: HTMLElement): Popover<T> {
        super.setOwner(owner);
        return this;
    }

    setTrigger(trigger: Trigger): Popover<T> {
        return super.setTrigger(trigger);
        return this;
    }

    setOrientation(orientation: Orientation): Popover<T> {
        return super.setOrientation(orientation);
        return this;
    }
}

export class PopoverBuilder<T> {
    private readonly popover: Popover<T>;

    constructor() {
        this.popover = new Popover<T>();
    }

    setOrientation(orientation: Orientation): PopoverBuilder<T> {
        this.popover.setOrientation(orientation);
        return this;
    }

    setOwner(owner: HTMLElement): PopoverBuilder<T> {
        this.popover.setOwner(owner);
        return this;
    }

    setTrigger(trigger: Trigger): PopoverBuilder<T> {
        this.popover.setTrigger(trigger);
        return this;
    }

    build(): Popover<T> {
        return this.popover;
    }

}

export class PopoverHtmlParser extends ComponentHtmlParser {

    static ORIENTATION = 'orientation';
    static TRIGGER = 'trigger';
    static OWNER = 'owner';

    private static instance: PopoverHtmlParser;


    public static getInstance(): PopoverHtmlParser {
        if (this.instance == null)
            return this.instance = new PopoverHtmlParser();
        return this.instance;
    }

    public parse(html: Element, elements: Map<string, any>): BaseComponent<any, any> {
        if (!html.hasAttribute('ui-field'))
            throw new RuntimeException('popover should have ui-field argument');

        let orientation = Orientation.BOTTOM;
        if (html.hasAttribute(PopoverHtmlParser.ORIENTATION)) {
            let or = html.getAttribute(PopoverHtmlParser.ORIENTATION);
            let orValue = or;
            if (orValue != null)
                orientation = <Orientation>orValue.toUpperCase();
        }
        let popover = new Popover().setOrientation(orientation);
        let titles = html.getElementsByTagName('title');
        for (let i = 0; i < titles.length; i++) {
            popover.getViewSlots().getTitle().innerHTML = titles.item(i).textContent;
            break;
        }
        let contents = html.getElementsByTagName('content');
        for (let i = 0; i < contents.length; i++) {
            popover.getViewSlots().getMainSlot().innerHTML = contents.item(i).innerHTML;
            break;
        }
        Util.copyAllAttributes(html, popover.asElement());
        let toReplace = Util.createDiv('<dn-popover-after></dn-popover-after>');
        Util.copyAllAttributes(html, toReplace);
        toReplace.setAttribute('pp', toReplace.getAttribute('ui-field'));
        toReplace.removeAttribute('ui-field');
        html.parentNode.appendChild(toReplace);
        this.replaceAndCopy(html, popover);
        return popover;
    }

    public getId(): string {
        return 'dn-popover';
    }

    public getClazz(): string {
        return 'Popover';
    }

}

export class PopoverAfterHtmlParser extends ComponentHtmlParser {

    static TRIGGER = 'trigger';

    private static instance: PopoverAfterHtmlParser;


    public static getInstance(): PopoverAfterHtmlParser {
        if (this.instance == null)
            return this.instance = new PopoverAfterHtmlParser();
        return this.instance;
    }

    public parse(htmlElement1: Element, template: Map<string, any>): BaseComponent<any, any> {
        let htmlElement = <HTMLElement>htmlElement1.parentNode;
        if (htmlElement.hasAttribute('owner')) {
            let owner = htmlElement.getAttribute('owner');
            let ownerObj = template.get(owner);
            let uiField = htmlElement.getAttribute('pp');
            let popover = <Popover<any>>template.get(uiField);
            popover.asElement().remove();
            if (Util.isIsElement(ownerObj)) {
                popover.setOwner((<IsElement<any>>ownerObj).asElement());
            }
            if (ownerObj instanceof HTMLElement) {
                popover.setOwner(<HTMLElement>ownerObj);
            }
            if (htmlElement.hasAttribute(PopoverAfterHtmlParser.TRIGGER)) {
                let or = htmlElement.getAttribute(PopoverAfterHtmlParser.TRIGGER);
                let orValue = or;
                if (orValue != null)
                    popover.setTrigger(<Trigger>orValue);
            }
        }
        htmlElement.remove();
        return null;
    }

    public getId(): string {
        return 'dn-popover-after';
    }

    public getClazz(): string {
        return 'Popover';
    }

}

