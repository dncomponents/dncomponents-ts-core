import {BaseFocusComponent} from '../textbox/BaseFocusComponent';
import {HasValue, ValueChangeEvent, ValueChangeHandler} from '../corecls/ValueClasses';
import {CheckBoxView} from './CheckBoxView';
import {SetElement} from '../corecls/corecls';
import {HandlerRegistration} from '../corecls/events';
import {AbstractMultiSelectionGroup, SelectionMode} from '../corecls/selectionmodel/selectionImpl';
import {CheckBox} from './CheckBox';
import {HtmlParser} from '../ComponentHtmlParser';
import {KEY} from '../TemplateParser';
import {Util} from '../corecls/Util';
import {BaseComponent, MainRenderer, MainRendererImpl} from '../BaseComponent';
import {java} from 'j4ts';
import List = java.util.List;

export abstract class AbstractCheckBox<T> extends BaseFocusComponent<T, CheckBoxView> implements HasValue<boolean> {
    value: boolean;

    protected fromView: boolean;

    constructor(view: CheckBoxView) {
        super(view);
    }


    isValueTrue(): boolean {
        return this.value != null && this.value;
    }


    setIndeterminate(b: boolean): void {
        this.value = null;
        this.view.setIndeterminate(b);
    }


    setLabel(se: string): void;
    setLabel(se: SetElement): void;
    setLabel(se: SetElement | string): void {
        if (typeof se === 'string') {
            this.view.setLabel(se);
        } else {
            se.setHtml(this.view.getViewSlots().getMainSlot());
        }
    }

    public getLabel(): string {
        return this.view.getLabel();
    }

    public setName(nameOfGroup: string): void {
        this.view.setName(nameOfGroup);
    }

    public addValueChangeHandler(handler: ValueChangeHandler<boolean>): HandlerRegistration {
        return handler.addTo(this.asElement());
    }

    getValue(): boolean {
        return this.value;
    }

    setValue(value: boolean): void;
    setValue(value: boolean, fireEvents: boolean): void;
    setValue(newValue: boolean, fireEvents?: boolean): void {
        let oldValue = this.getValue();
        this.value = newValue;
        if (!this.fromView)
            this.view.setChecked(this.value);
        if (fireEvents) {
            ValueChangeEvent.fireIfNotEqual(this, oldValue, this.value);
        }
    }

    public setRenderer(renderer: MainRenderer<T>): void {
        super.setRendererBase(renderer);
    }

}

export class CheckBoxSelectionGroup<T> extends AbstractMultiSelectionGroup<T, CheckBox<T>> {

    private static id: number = 0;
    private groupName: string;
    public uiField: string;
    defaultRenderer: MainRenderer<T> = new MainRendererImpl<T>();

    constructor();
    constructor(groupName: string);
    constructor(groupName?: string) {
        super();
        this.setGroupName(groupName == null ? ('checkboxGroup-' + CheckBoxSelectionGroup.id++) : groupName);
        this.setSelectionMode(SelectionMode.MULTI);
    }


    public setGroupName(groupName: string): void {
        this.groupName = groupName;
    }

    public getGroupName(): string {
        return this.groupName;
    }

    addItem(value: CheckBox<T>): void {
        super.addItem(value);
        value.setGroup(this);
    }

    public addEntityItems(items: List<T>): void {
        items.forEach(p1 => {
            let ch = new CheckBox<T>().setUserObject(p1);
            ch.setGroup(this);
            this.addItem(ch);
        });
    }

    setSelectionMode(selectionMode: SelectionMode): void {
        this.selectionMode = selectionMode;
    }

    setSelectedInView(model: CheckBox<T>, b: boolean): void {
        model.setValue(b);
    }

    public setDefaultRenderer(defaultRenderer: MainRenderer<T>): void {
        this.defaultRenderer = defaultRenderer;
    }

    public getDefaultRenderer(): MainRenderer<T> {
        return this.defaultRenderer;
    }


}

export class CheckBoxSelectionGroupHtmlParser implements HtmlParser<CheckBoxSelectionGroup<any>> {

    private static instance: CheckBoxSelectionGroupHtmlParser;

    private CheckBoxSelectionGroupHtmlParser() {
    }

    public static getInstance(): CheckBoxSelectionGroupHtmlParser {
        if (this.instance == null)
            return this.instance = new CheckBoxSelectionGroupHtmlParser();
        return this.instance;
    }

    public parse(htmlElement: Element, elements: Map<String, any>): CheckBoxSelectionGroup<any> {
        let uiField = htmlElement.getAttribute(KEY);
        let checkBoxSelectionGroup = new CheckBoxSelectionGroup();
        checkBoxSelectionGroup.uiField = uiField;
        for (let element of elements) {
            if (element instanceof CheckBox) {
                if (element.groupUiField != null && element.groupUiField === (uiField))
                    checkBoxSelectionGroup.addItem(element);
            }
        }
        let elements2 = htmlElement.querySelectorAll('*');
        for (let i = 0; i < elements2.length; i++) {
            let at = elements2[i];
            let chBox = BaseComponent.allComponents.get(at);
            if (chBox instanceof CheckBox) {
                if (Util.isDescendant(htmlElement, chBox.asElement()))
                    checkBoxSelectionGroup.addItem(chBox);
            }
        }
        Util.unwrap(htmlElement);
        return checkBoxSelectionGroup;
    }


    public getId(): string {
        return 'dn-checkbox-selection-group';
    }

    public getClazz(): string {
        return 'CheckBoxSelectionGroup';
    }

}