import {AbstractCheckBox, CheckBoxSelectionGroup} from './checkbox_radio';
import {HasValue} from '../corecls/ValueClasses';
import {CheckBoxView} from './CheckBoxView';
import {Ui} from '../views/Ui';
import {OnChangeHandler} from '../corecls/handlers';
import {BaseComponent, MainRenderer, MainRendererImpl, MainViewSlots} from '../BaseComponent';
import {ComponentHtmlParser} from '../ComponentHtmlParser';
import {ItemId} from '../corecls/entities';
import {Util} from '../corecls/Util';

export class CheckBox<T> extends AbstractCheckBox<T> implements HasValue<Boolean> {

    group: CheckBoxSelectionGroup<T>;
    groupUiField: string;

    constructor();
    constructor(view?: CheckBoxView | string) ;
    constructor(view?: any) {
        super(Util.isIsElement(view) ? view : Ui.get().getCheckBoxView());
        if (view && !Util.isIsElement(view) && (typeof view === 'string')) {
            this.setLabel(view);
        }
        this.bind();
    }


    bind(): void {
        var self = this;
        this.view.addOnChangeHandler(new class extends OnChangeHandler {
            onChange(evt: Event): void {
                if (!self.isEnabled())
                    return;
                self.fromView = true;
                self.setValue(self.view.isChecked(), true);
                if (self.group != null) {
                    self.group.setSelected(self, self.view.isChecked(), true);
                }
                self.fromView = false;
            }
        });
        this.setRenderer(new MainRendererImpl());
    }

    public setIndeterminate(b: boolean): void {
        this.value = null;
        this.view.setIndeterminate(b);
    }

    public setGroup(group: CheckBoxSelectionGroup<T>): void {
        this.group = group;
        this.view.setName(group.getGroupName());
        this.setRenderer(group.getDefaultRenderer());
    }

    public setUserObject(userObject: T): CheckBox<T> {
        super.setUserObject(userObject);
        return this;
    }

}


export class CheckBoxHtmlParser extends ComponentHtmlParser {

    private static instance: CheckBoxHtmlParser;
    //refer to ui-field of selection group
    static GROUP = 'group';
    static VALUE = 'value';
    static DISABLED = 'disabled';

    public static getInstance(): CheckBoxHtmlParser {
        if (this.instance == null)
            return this.instance = new CheckBoxHtmlParser();
        return this.instance;
    }

    public parse(htmlElement: Element, elements: Map<string, any>): BaseComponent<any, any> {
        let viewC = this.getView(this.getClazz(), htmlElement, elements);
        let checkBox: CheckBox<ItemId>;
        if (viewC != null)
            checkBox = new CheckBox(<CheckBoxView>viewC);
        else
            checkBox = new CheckBox();
        CheckBoxHtmlParser.setValueCh(htmlElement, checkBox);
        checkBox.setEnabled(!htmlElement.hasAttribute(CheckBoxHtmlParser.DISABLED));
        checkBox.setRenderer(new class implements MainRenderer<ItemId> {
            render(idItem: ItemId, slots: MainViewSlots): void {
                slots.getMainSlot().innerHTML = idItem.getContent();
            }
        });
        checkBox.setUserObject(this.getIdItem(htmlElement));
        checkBox.groupUiField = htmlElement.getAttribute(CheckBoxHtmlParser.GROUP);
        this.replaceAndCopy(htmlElement, checkBox);
        return checkBox;
    }

    static setValueCh(htmlElement: Element, checkBox: AbstractCheckBox<any>): void {
        let value = htmlElement.getAttribute(CheckBoxHtmlParser.VALUE);
        if (value != null && (value.toLowerCase() === ('true') || value.toLowerCase() === ('false'))) {
            checkBox.setValue(value.toLowerCase() === ('true') ? true : false);
        }
    }

    public getId(): string {
        return 'dn-checkbox';
    }

    public getClazz(): string {
        return 'CheckBox';
    }
}