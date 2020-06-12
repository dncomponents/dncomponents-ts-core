import {BaseComponent, MainRenderer, MainViewSlots} from '../BaseComponent';
import {ButtonView} from './view/ButtonView';
import {Ui} from '../views/Ui';
import {ClickHandler, HasClickHandlers} from '../corecls/handlers';
import {HandlerRegistration} from '../corecls/events';
import {ComponentHtmlParser} from '../ComponentHtmlParser';


export class Button<T> extends BaseComponent<T, ButtonView> implements HasClickHandlers {

    private enabled: boolean;

    constructor();
    constructor(view?: ButtonView) ;
    constructor(text?: string) ;
    constructor(view?: ButtonView | string) {
        if (typeof view === 'string') {
            super(Ui.get().getButtonView());
            this.setText(view);
        } else {
            super(view ? view : Ui.get().getButtonView());
        }
    }

    setText(txt: string): Button<T> {
        this.view.setText(txt);
        return this;
    }

    addClickHandler(handler: ClickHandler): HandlerRegistration {
        return super.addHandler(handler);
    }

    public setEnabled(enabled: boolean): void {
        this.enabled = enabled;
        this.view.setEnabled(this.enabled);
    }

    public isEnabled(): boolean {
        return this.enabled;
    }

    getViewSlots(): MainViewSlots {
        return <MainViewSlots>super.getViewSlots();
    }

    public setRenderer(renderer: MainRenderer<T>): void {
        super.setRendererBase(renderer);
    }

}

export class ButtonHtmlParser extends ComponentHtmlParser {

    DISABLED = 'disabled';

    private static instance: ButtonHtmlParser;

    private ButtonHtmlParser() {
        this.arguments.set(this.DISABLED, new Array<string>());
    }

    public static getInstance(): ButtonHtmlParser {
        if (this.instance == null)
            return this.instance = new ButtonHtmlParser();
        return this.instance;
    }

    public parse(htmlElement: Element, elements: Map<string, any>): BaseComponent<any, any> {
        let button;
        let view = this.getView(this.getClazz(), htmlElement, elements);
        if (view != null)
            button = new Button(<ButtonView>view);
        else
            button = new Button();
        button.setEnabled(!htmlElement.hasAttribute(this.DISABLED));
        button.getViewSlots().getMainSlot().innerHTML = htmlElement.innerHTML;
        this.replaceAndCopy(htmlElement, button);
        return button;
    }

    public getId(): string {
        return 'dn-button';
    }

    public getClazz(): string {
        return 'Button';
    }

}
