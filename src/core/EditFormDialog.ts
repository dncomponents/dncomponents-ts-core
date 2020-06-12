import {ColumnConfig, RowTable} from './table/TableUtil';
import {java} from 'j4ts';
import {Util} from './corecls/Util';
import {Dialog} from './modal/Dialog';
import {HandlerRegistration} from './corecls/events';
import {Button} from './button/Button';
import {ClickHandler} from './corecls/handlers';
import {IsElement} from './corecls/IsElement';
import {HtmlComponent} from './html/HtmlComponent';
import {HasValue, ValueChangeHandler} from './corecls/ValueClasses';

export class EditFormDialog<T> extends Dialog<T> {

    private mainPanel: HTMLElement = Util.createDiv();

    private configList: java.util.List<ColumnConfig<any, any>>;

    private model: T;

    cell: RowTable<T>;

    autocommit: boolean = false;

    public constructor(cell: RowTable<T>) {
        super();
        if (this.configList === undefined) this.configList = null;
        if (this.model === undefined) this.model = null;
        if (this.cell === undefined) this.cell = null;
        this.configList = cell.getOwner().getColumnConfigs();
        this.model = cell.getModel();
        this.cell = cell;
        this.init();
    }

    // fields: java.util.List<CommandD> = new java.util.ArrayList<CommandD>();
    fields: java.util.List<() => void> = new java.util.ArrayList<() => void>();

    handlerRegistrationList: java.util.List<HandlerRegistration> = new java.util.ArrayList<any>();


    private init() {
        let saveButton: Button<any> = new Button('Save');
        saveButton.addClickHandler(ClickHandler.onClick(evt => this.save()));
        this.setHeader({setHtml: (e) => e.textContent = this.model.toString()});
        if (!this.autocommit)
            this.setFooter({
                setHtml(e: HTMLElement) {
                    e.appendChild(saveButton.asElement());
                }
            });

        for (let i: number = 0; i < this.configList.size(); i++) {

            let cc: ColumnConfig<any, any> = this.configList.get(i);
            if (cc.isEditable()) {
                let title: IsElement<any> = new HtmlComponent('b', cc.getColumnName());
                let value: any = cc.getFieldGetter()(this.model);
                let valueElement: HasValue<any> = this.cell.getCells().get(i).getCellEditor().getHasValue();
                valueElement.setValue(value, false);
                let handlerRegistration: HandlerRegistration = valueElement.addValueChangeHandler(ValueChangeHandler.onValueChange(evt => {
                    if (this.autocommit) {
                        cc.getFieldSetter()(this.model, evt.value);
                        this.cell.draw();
                    }
                }));
                this.handlerRegistrationList.add(handlerRegistration);
                let self = this;
                this.fields.add(() => {
                    cc.getFieldSetter()(self.model, valueElement.getValue());
                });
                let element: IsElement<any> = <any>valueElement;
                let div: HTMLDivElement = Util.createDiv();
                div.appendChild(title.asElement());
                div.appendChild(element.asElement());
                this.mainPanel.appendChild(div);
            }
            this.setContent({setHtml: (e) => e.appendChild(this.mainPanel)});
        }
    }

    public save() {
        if (!this.autocommit) {
            this.fields.forEach(p => p());
            this.cell.draw();
        }
        this.hide();
    }

    private clearAll() {
        this.fields.clear();
        this.handlerRegistrationList.forEach(h => h.removeHandler());
    }

    public hide() {
        super.hide();
        this.clearAll();
    }

    public setAutocommit(autocommit: boolean) {
        this.autocommit = autocommit;
    }

    public isAutocommit(): boolean {
        return this.autocommit;
    }
}

