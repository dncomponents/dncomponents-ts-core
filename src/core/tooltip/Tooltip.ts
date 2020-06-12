import { TooltipView} from './view/TooltipView';
import {BaseTooltip, Orientation, Trigger} from './BaseTooltip';
import {CloseEvent, CloseHandler, HasCloseHandlers, HasOpenHandlers, OpenEvent, OpenHandler} from '../corecls/handlers';
import {HandlerRegistration} from '../corecls/events';
import {Ui} from '../views/Ui';
import {ComponentHtmlParser} from '../ComponentHtmlParser';
import {BaseComponent, MainRenderer, MainViewSlots} from '../BaseComponent';
import {Util} from '../corecls/Util';
import {IsElement} from '../corecls/IsElement';

export class Tooltip<T> extends BaseTooltip<T, TooltipView<any>> implements HasCloseHandlers<Tooltip<T>>, HasOpenHandlers<Tooltip<T>> {

    constructor();
    constructor(view?: TooltipView<any>) ;
    constructor(view?: TooltipView<any>) {
        super(view ? view : Ui.get().getTooltipView());
    }

    public setRenderer(renderer: MainRenderer<T>): Tooltip<T> {
        super.setRendererBase(renderer);
        return this;
    }

    fireShowEvent() {
        OpenEvent.fire(this, this);
    }

    fireCloseEvent() {
        CloseEvent.fire<any>(this, this);
    }

    public addCloseHandler(handler: CloseHandler<Tooltip<T>>): HandlerRegistration {
        return this.addHandler(handler);
    }

    public addOpenHandler(handler: OpenHandler<Tooltip<T>>): HandlerRegistration {
        return this.addHandler(handler);
    }

    getViewSlots(): MainViewSlots {
        return <MainViewSlots><any>super.getViewSlots();
    }

    //chain methods
    setOwner(owner: HTMLElement): Tooltip<T> {
        super.setOwner(owner);
        return this;
    }

    setTrigger(trigger: Trigger): Tooltip<T> {
        return super.setTrigger(trigger);
        return this;
    }

    setOrientation(orientation: Orientation): Tooltip<T> {
        return super.setOrientation(orientation);
        return this;
    }

    setUserObject(t: T): Tooltip<T> {
        super.setUserObject(t);
        return this;
    }
}

export class TooltipHtmlParser extends ComponentHtmlParser {

    static ORIENTATION = 'orientation';
    static TRIGGER = 'trigger';
    static OWNER = 'owner';

    private static instance: TooltipHtmlParser;

    private constructor() {
        super();
    }

    public static getInstance(): TooltipHtmlParser {
        if (this.instance == null)
            return this.instance = new TooltipHtmlParser();
        return this.instance;
    }

    public parse(html: Element, elements: Map<string, any>): BaseComponent<any, any> {
        let orientation: Orientation = null;
        if (html.hasAttribute(TooltipHtmlParser.ORIENTATION)) {
            let or = html.getAttribute(TooltipHtmlParser.ORIENTATION);
            let orValue = or;
            if (orValue != null)
                orientation = <Orientation>orValue.toUpperCase();
        }
        let tooltip = new Tooltip().setOrientation(orientation);
        tooltip.getViewSlots().getMainSlot().innerHTML = html.innerHTML;

        Util.copyAllAttributes(html, tooltip.asElement());
        let toReplace = Util.createDiv('<dn-tooltip-2></dn-tooltip-2>'); //todo remove this
        Util.copyAllAttributes(html, toReplace);
        toReplace.setAttribute('pp', toReplace.getAttribute('ui-field'));
        toReplace.removeAttribute('ui-field');
        html.parentNode.appendChild(toReplace);
        Util.replace(tooltip.asElement(), html);
        return tooltip;
    }

    public getId(): string {
        return 'dn-tooltip';
    }

    public getClazz(): string {
        return 'Tooltip';
    }

}

export class TooltipAfterHtmlParser extends ComponentHtmlParser {

    static TRIGGER = 'trigger';


    private static instance: TooltipAfterHtmlParser;

    private constructor() {
        super();
    }

    public static getInstance(): TooltipAfterHtmlParser {
        if (this.instance == null)
            return this.instance = new TooltipAfterHtmlParser();
        return this.instance;
    }

    public parse(htmlElement1: Element, template: Map<string, any>): BaseComponent<any, any> {
        let htmlElement = <HTMLElement>htmlElement1.parentNode;
        if (htmlElement.hasAttribute('owner')) {
            let owner = htmlElement.getAttribute('owner');
            /** // @ts-ignore */
            // @ts-ignore
            let ownerObj = template.get(owner);
            let uiField = htmlElement.getAttribute('pp');
            let tooltip = <Tooltip<any>>template.get(uiField);
            tooltip.asElement().remove();
            if (Util.isIsElement(ownerObj)) {
                tooltip.setOwner((<IsElement<any>>ownerObj).asElement());
            }

            if (ownerObj instanceof HTMLElement) {
                tooltip.setOwner(<HTMLElement>ownerObj);
            }
            if (htmlElement.hasAttribute(TooltipAfterHtmlParser.TRIGGER)) {
                let or = htmlElement.getAttribute(TooltipAfterHtmlParser.TRIGGER);
                let orValue = or;
                if (orValue != null)
                    tooltip.setTrigger(<Trigger>orValue.toUpperCase());
            }
        }
        htmlElement.remove();
        return null;
    }

    public getId(): string {
        return 'dn-tooltip-2';
    }

    public getClazz(): string {
        return 'Tooltip';
    }

}
