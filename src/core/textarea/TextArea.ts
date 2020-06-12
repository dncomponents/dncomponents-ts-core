import {TextBox, TextBoxHtmlParser} from '../textbox/TextBox';
import {TextBoxView} from '../textbox/TextBoxView';
import {Ui} from '../views/Ui';
import {ComponentHtmlParser} from '../ComponentHtmlParser';
import {BaseComponent} from '../BaseComponent';

export class TextArea extends TextBox {
    constructor();
    constructor(view?: TextBoxView);
    constructor(view?: TextBoxView) {
        super(view ? view : Ui.get().getTextAreaView());
    }

    public append(text: string) {
        this.view.setValue(text + (this.getValueFromView() == null ? '' : this.getValueFromView()));
    }
}

export class TextAreaHtmlParser extends ComponentHtmlParser {

    DISABLED = 'disabled';

    private static instance: TextAreaHtmlParser;


    public static getInstance(): TextAreaHtmlParser {
        if (this.instance == null)
            return this.instance = new TextAreaHtmlParser();
        return this.instance;
    }

    public parse(htmlElement: Element, elements: Map<string, any>): BaseComponent<any, any> {
        let textArea;
        let view = this.getView(this.getClazz(), htmlElement, elements);
        if (view != null)
            textArea = new TextArea(<TextBoxView>view);
        else
            textArea = new TextArea();

        let value = htmlElement.getAttribute(TextBoxHtmlParser.VALUE);
        if (value != null) {
            textArea.setValue(value);
        }
        this.replaceAndCopy(htmlElement, textArea);
        return textArea;

    }

    public getId(): string {
        return 'dn-text-area';
    }

    public getClazz(): string {
        return 'TextArea';
    }

}
