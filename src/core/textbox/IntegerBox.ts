import {ValueBox} from './ValueBox';
import {Ui} from '../views/Ui';
import {TextBoxView} from './TextBoxView';
import {ComponentHtmlParser} from '../ComponentHtmlParser';
import {BaseComponent} from '../BaseComponent';
import {TextBoxHtmlParser} from './TextBox';

export class IntegerBox extends ValueBox<number> {

    public constructor(view?: TextBoxView) {
        super(view ? view : Ui.get().getTextBoxView());
    }

    parseString(str: string): number {
        let result;
        try {
            result = parseInt(str);
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

export class IntegerBoxHtmlParser extends ComponentHtmlParser {

    private static instance: IntegerBoxHtmlParser;

    private constructor() {
        super();
    }

    public static getInstance(): IntegerBoxHtmlParser {
        if (this.instance == null)
            return this.instance = new IntegerBoxHtmlParser();
        return this.instance;
    }


    public parse(htmlElement: Element, elements: Map<string, any>): BaseComponent<any, any> {
        let integerBox;
        let view = this.getView('TextBox', htmlElement, elements);
        if (view != null)
            integerBox = new IntegerBox(<TextBoxView>view);
        else
            integerBox = new IntegerBox();
        let value = htmlElement.getAttribute(TextBoxHtmlParser.VALUE);
        if (value != null) {
            try {
                integerBox.setValue(parseInt(value));
            } catch (ex) {
                integerBox.getView().setError(true);
                integerBox.getView().setErrorMessage('error parsing integer number');
            }
        }
        this.replaceAndCopy(htmlElement, integerBox);
        return integerBox;
    }


    public getId(): string {
        return 'dn-integer-box';
    }

    public getClazz(): string {
        return 'IntegerBox';
    }
}