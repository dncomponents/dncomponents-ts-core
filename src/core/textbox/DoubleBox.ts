import {ValueBox} from './ValueBox';
import {Ui} from '../views/Ui';
import {TextBoxView} from './TextBoxView';
import {ComponentHtmlParser} from '../ComponentHtmlParser';
import {BaseComponent} from '../BaseComponent';
import {TextBoxHtmlParser} from './TextBox';

export class DoubleBox extends ValueBox<number> {

    public constructor(view?: TextBoxView) {
        super(view ? view : Ui.get().getTextBoxView());
    }

    parseString(str: string): number {
        let result;
        try {
            result = parseFloat(str);
        } catch (ex) {
            result = null;
        }
        return isNaN(result) ? null : result;
    }

    renderThis(value: number): string {
        return value == null ? '' : value.toString();
    }

    public getView(): TextBoxView {
        return super.getView();
    }

}

export class DoubleBoxHtmlParser extends ComponentHtmlParser {

    private static instance: DoubleBoxHtmlParser;

    private constructor() {
        super();
    }

    public static getInstance(): DoubleBoxHtmlParser {
        if (this.instance == null)
            return this.instance = new DoubleBoxHtmlParser();
        return this.instance;
    }

    public parse(htmlElement: Element, elements: Map<string, any>): BaseComponent<any, any> {
        let doubleBox;
        let view = this.getView('TextBox', htmlElement, elements);
        if (view != null)
            doubleBox = new DoubleBox(<TextBoxView>view);
        else
            doubleBox = new DoubleBox();
        let value = htmlElement.getAttribute(TextBoxHtmlParser.VALUE);
        if (value != null) {
            try {
                doubleBox.setValue(parseFloat(value));
            } catch (ex) {
                doubleBox.getView().setError(true);
                doubleBox.getView().setErrorMessage('error parsing number');
            }
        }
        this.replaceAndCopy(htmlElement, doubleBox);
        return doubleBox;
    }

    public getId(): string {
        return 'dn-double-box';
    }

    public getClazz(): string {
        return 'DoubleBox';
    }
}