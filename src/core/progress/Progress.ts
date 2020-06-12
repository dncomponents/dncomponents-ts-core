import {HasValue, ValueChangeEvent, ValueChangeHandler} from '../corecls/ValueClasses';
import {BaseComponent, ViewSlots} from '../BaseComponent';
import {ProgressView} from './view/ProgressView';
import {Ui} from '../views/Ui';
import {HandlerRegistration} from '../corecls/events';
import {ComponentHtmlParser} from '../ComponentHtmlParser';

export class Progress extends BaseComponent<any, ProgressView> implements HasValue<number> {

    private percent: number;

    private __showPercentText: boolean;

    private percentTextFunction: (p1: number) => string;

    constructor();
    constructor(view: ProgressView);
    constructor(view?: ProgressView) {
        super(view ? view : Ui.get().getProgressView());
        this.percentTextFunction = p1 => p1 + '';
    }


    private draw(): void {
        this.view.setBarWidth(this.percent);
        if (this.__showPercentText)
            this.view.setBarText(this.percentTextFunction(this.percent));
    }

    /**
     * Defines how percent text is displayed on progress bar.
     *
     * @param {*} percentTextFunction function
     */
    public setPercentText(percentTextFunction: (p1: number) => string) {
        this.percentTextFunction = percentTextFunction;
    }

    /**
     * Toggles display of percent on progress bar. By default it shows only percent text in form e.g 20%
     * To changes content of text being displayed define your own text with {@link #setPercentText(Function)}
     *
     * @param {boolean} b <code>true</code> to show given text, <code>false</code> to hide it
     */
    public showPercentText(b: boolean) {
        this.__showPercentText = b;
        this.draw();
    }

    /**
     * To ensure that the label text remains legible even for low percentages,
     * consider adding a min-width to the progress bar.
     *
     * @param {number} minimumWidth minimum width in em
     */
    public setMinimumWidth(minimumWidth: number) {
        this.view.setMinimumWidth(minimumWidth);
    }

    public getValue(): number {
        return this.percent;
    }

    setValue(value: number): void;
    setValue(value: number, fireEvents: boolean): void;
    setValue(value: number, fireEvents?: boolean): void {
        let oldValue: number = this.getValue();
        this.percent = value;
        if (value < 0) this.percent = 0;
        if (value > 100) this.percent = 100;
        if (fireEvents) {
            ValueChangeEvent.fireIfNotEqual<any>(this, oldValue, this.percent);
        }
        this.draw();
    }

    public addValueChangeHandler(handler: ValueChangeHandler<number>): HandlerRegistration {
        return handler.addTo(this.asElement());
    }

    public getViewSlots(): ViewSlots {
        return super.getViewSlots();
    }
}

export class ProgressHtmlParser extends ComponentHtmlParser {

    static VALUE = 'value';

    private static instance: ProgressHtmlParser;


    public static getInstance(): ProgressHtmlParser {
        if (this.instance == null)
            return this.instance = new ProgressHtmlParser();
        return this.instance;
    }

    public parse(htmlElement: Element, templateElement: Map<string, any>): BaseComponent<any, any> {
        let progress: Progress;
        let view = this.getView(this.getClazz(), htmlElement, templateElement);
        if (view != null)
            progress = new Progress(<any>view);
        else
            progress = new Progress();
        if (htmlElement.hasAttribute(ProgressHtmlParser.VALUE)) {
            progress.setValue(parseInt(htmlElement.getAttribute(ProgressHtmlParser.VALUE)));
        }
        this.replaceAndCopy(htmlElement, progress);
        return progress;
    }

    public getId(): string {
        return 'dn-progress';
    }

    public getClazz(): string {
        return 'Progress';
    }

}
