import {AbstractCheckBox} from './checkbox_radio';
import {Ui} from '../views/Ui';
import {OnChangeHandler} from '../corecls/handlers';
import {BaseComponent, MainRenderer, MainRendererImpl, MainViewSlots} from '../BaseComponent';
import {ComponentHtmlParser, HtmlParser} from '../ComponentHtmlParser';
import {ItemId} from '../corecls/entities';
import {RadioView} from './RadioView';
import {CheckBoxHtmlParser} from './CheckBox';
import {AbstractSingleSelectionGroup} from '../corecls/selectionmodel/selectionImpl';
import {KEY} from '../TemplateParser';
import {Util} from '../corecls/Util';
import {java} from 'j4ts';
import List = java.util.List;

export class Radio<T> extends AbstractCheckBox<T> {

    group: RadioSelectionGroup<T>;
    groupUiField: string;

    constructor();
    constructor(view?: RadioView | T) ;
    constructor(view?: RadioView) {
        super(Util.isIsElement(view) ? view : Ui.get().getRadioView());
        if (view && !Util.isIsElement(view)) {
            this.setUserObject(<T><any>view);
            this.setLabel((<T><any>view) + '');
        }
        this.bind();
    }

    bind(): void {
        this.view.addOnChangeHandler(OnChangeHandler.onChange(evt => {
            if (!this.isEnabled())
                return;
            this.fromView = true;
            this.setValue(this.view.isChecked(), true);
            if (this.group != null) {
                this.group.setSelected(this, this.view.isChecked(), true);
            }
            this.fromView = false;
        }));
    }

    public setGroup(group: RadioSelectionGroup<T>): void {
        this.group = group;
        this.view.setName(group.getGroupName());
        this.setRenderer(group.getDefaultRenderer());
    }

    public setUserObject(userObject: T): Radio<T> {
        super.setUserObject(userObject);
        super.setLabel(userObject.toString());
        return this;
    }
}

export class RadioHtmlParser extends ComponentHtmlParser {

    private static instance: RadioHtmlParser;
    //refer to ui-field of selection group
    static GROUP = 'group';
    static VALUE = 'value';
    static DISABLED = 'disabled';

    public static getInstance(): RadioHtmlParser {
        if (this.instance == null)
            return this.instance = new RadioHtmlParser();
        return this.instance;
    }

    public parse(htmlElement: Element, elements: Map<string, any>): BaseComponent<any, any> {
        let view = this.getView(this.getClazz(), htmlElement, elements);
        let radio: Radio<ItemId>;
        if (view != null)
            radio = new Radio<ItemId>(<RadioView>view);
        else
            radio = new Radio();
        CheckBoxHtmlParser.setValueCh(htmlElement, radio);
        radio.setEnabled(!htmlElement.hasAttribute(CheckBoxHtmlParser.DISABLED));
        radio.setRenderer(new class implements MainRenderer<ItemId> {
            render(idItem: ItemId, slots: MainViewSlots): void {
                slots.getMainSlot().innerHTML = idItem.getContent();
            }
        });
        radio.setUserObject(this.getIdItem(htmlElement));
        radio.groupUiField = htmlElement.getAttribute(CheckBoxHtmlParser.GROUP);
        this.replaceAndCopy(htmlElement, radio);
        return radio;
    }

    public getId(): string {
        return 'dn-radio';
    }

    public getClazz(): string {
        return 'Radio';
    }

}

//radio

export class RadioSelectionGroup<T> extends AbstractSingleSelectionGroup<T, Radio<T>> {

    private static id: number = 0;
    private groupName: string;
    public uiField: string;

    constructor();
    constructor(groupName: string);
    constructor(groupName?: string) {
        super();
        this.setGroupName(groupName == null ? ('radioGroup-' + RadioSelectionGroup.id++) : groupName);
    }

    public setGroupName(groupName: string): void {
        this.groupName = groupName;
    }

    public getGroupName(): string {
        return this.groupName;
    }

    addItem(value: Radio<T>): void {
        super.addItem(value);
        value.setGroup(this);
    }

    public addEntityItems(items: List<T>): void {
        items.forEach(p1 => {
            let ch = new Radio<T>().setUserObject(p1);
            ch.setGroup(this);
            this.addItem(ch);
        });
    }


    setSelectedInView(model: Radio<T>, b: boolean): void {
        model.setValue(b);
    }

    private defaultRenderer: MainRenderer<T> = new MainRendererImpl();


    getDefaultRenderer(): MainRenderer<T> {
        return this.defaultRenderer;
    }
}

export class RadioSelectionGroupHtmlParser implements HtmlParser<RadioSelectionGroup<any>> {

    private static instance: RadioSelectionGroupHtmlParser;

    private constructor() {
    }

    public static getInstance(): RadioSelectionGroupHtmlParser {
        if (this.instance == null)
            return this.instance = new RadioSelectionGroupHtmlParser();
        return this.instance;
    }

    public parse(htmlElement: Element, elements: Map<String, any>): RadioSelectionGroup<any> {
        let uiField = htmlElement.getAttribute(KEY);
        let radioSelectionGroup = new RadioSelectionGroup();
        radioSelectionGroup.uiField = uiField;
        for (let element of elements) {
            if (element instanceof Radio) {
                if (element.groupUiField != null && element.groupUiField === (uiField))
                    radioSelectionGroup.addItem(element);
            }
        }
        let elements2 = htmlElement.querySelectorAll('*');
        for (let i = 0; i < elements2.length; i++) {
            let at = elements2[i];
            let radio = BaseComponent.allComponents.get(at);
            if (radio instanceof Radio) {
                if (Util.isDescendant(htmlElement, radio.asElement()))
                    radioSelectionGroup.addItem(radio);
            }
        }
        Util.unwrap(htmlElement);
        return radioSelectionGroup;
    }

    public getId(): string {
        return 'dn-radio-selection-group';
    }

    public getClazz(): string {
        return 'RadioSelectionGroup';
    }

}