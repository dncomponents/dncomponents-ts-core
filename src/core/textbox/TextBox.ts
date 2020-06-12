import {Ui} from '../views/Ui';
import {ValueBox} from './ValueBox';
import {TextBoxView} from './TextBoxView';
import {ComponentHtmlParser} from '../ComponentHtmlParser';
import {BaseComponent} from '../BaseComponent';

export class TextBox extends ValueBox<string> {

    constructor();
    constructor(view?: TextBoxView);
    constructor(view?: TextBoxView) {
        super(view ? view : Ui.get().getTextBoxView());
    }

    parseString(str: string): string {
        return str == '' ? null : str;
    }

    renderThis(s: string): string {
        return s == null ? '' : s;
    }

    public getValueFromView(): string {
        let result: string;
        try {
            result = this.getValueOrThrow();
        } catch (ex) {
            result = null;
        }
        return result;
    }

}

export class TextBoxHtmlParser extends ComponentHtmlParser {

    private static instance: TextBoxHtmlParser;
    public static VALUE = 'val';

    public static getInstance(): TextBoxHtmlParser {
        if (this.instance == null)
            return this.instance = new TextBoxHtmlParser();
        return this.instance;
    }

    public parse(htmlElement: Element, elements: Map<string, any>): BaseComponent<any, any> {
        let textBox: TextBox;
        let view = this.getView(this.getClazz(), htmlElement, elements);
        if (view != null)
            textBox = new TextBox(<TextBoxView>view);
        else
            textBox = new TextBox();
        let value = htmlElement.getAttribute(TextBoxHtmlParser.VALUE);
        if (value != null) {
            textBox.setValue(value);
        }
        this.replaceAndCopy(htmlElement, textBox);
        return textBox;
    }

    public getId(): string {
        return 'dn-text-box';
    }

    public getClazz(): string {
        return 'TextBox';
    }
}
