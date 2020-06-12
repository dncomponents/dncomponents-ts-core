import {ValueBox} from './ValueBox';
import {Ui} from '../views/Ui';
import {TextBoxView} from './TextBoxView';
import {ComponentHtmlParser} from '../ComponentHtmlParser';
import {BaseComponent} from '../BaseComponent';
import {TextBoxHtmlParser} from './TextBox';

export class DateBox extends ValueBox<Date> {

    public constructor(view?: TextBoxView) {
        super(view ? view : Ui.get().getTextBoxView());
    }

    parseString(str: string): Date {
        let result: number;
        try {
            result = Date.parse(str);
        } catch (ex) {
            result = null;
        }
        return new Date(result);
    }

    renderThis(value: Date): string {
        return value == null ? '' : new Date(value.getTime()).toLocaleDateString();
    }

    public getView(): TextBoxView {
        return super.getView();
    }

}

export class DateBoxHtmlParser extends ComponentHtmlParser {

    private static instance: DateBoxHtmlParser;

    private constructor() {
        super();
    }

    public static getInstance(): DateBoxHtmlParser {
        if (this.instance == null)
            return this.instance = new DateBoxHtmlParser();
        return this.instance;
    }


    public parse(htmlElement: Element, elements: Map<string, any>): BaseComponent<any, any> {
        let dateBox;
        let view = this.getView('TextBox', htmlElement, elements);
        if (view != null)
            dateBox = new DateBox(<TextBoxView>view);
        else
            dateBox = new DateBox();
        let value = htmlElement.getAttribute(TextBoxHtmlParser.VALUE);
        if (value != null) {
            try {
                dateBox.setValue(new Date(value));
            } catch (ex) {
                dateBox.getView().setError(true);
                dateBox.getView().setErrorMessage('error parsing date');
            }
        }
        this.replaceAndCopy(htmlElement, dateBox);
        return dateBox;
    }


    public getId(): string {
        return 'dn-date-box';
    }

    public getClazz(): string {
        return 'DateBox';
    }
}