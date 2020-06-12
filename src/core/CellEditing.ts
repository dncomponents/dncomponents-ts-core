import {CellValidator} from './CellValidator';
import {BaseCellView} from './corecls/BaseCellView';
import {CellEditor} from './CellEditor';
import {BaseCell} from './BaseCell';
import {HandlerRegistration} from './corecls/events';
import {ValueChangeHandler} from './corecls/ValueClasses';
import {
    CellEditEvent,
    ClickHandler,
    DoubleClickHandler,
    HasBlurHandlers,
    KeyDownHandler,
    KeyUpHandler,
    OnBlurHandler
} from './corecls/handlers';
import {Util} from './corecls/Util';
import {HasValueParser} from './textbox/HasValueParser';

export class CellEditing<T, M> {
    validator: CellValidator<T, M>;

    /*private*/
    autoCommit: boolean = true;

    cellView: BaseCellView;

    cellEditor: CellEditor<M>;

    /*private*/
    stopBlur: boolean;

    /*private*/
    cell: BaseCell<T, M>;

    /*private*/
    __isEditing: boolean = false;

    valuChangeRegistration: HandlerRegistration;

    constructor(c: BaseCell<T, M>) {
        this.cell = c;
        this.cellView = c.getCellView();
    }


    editCell() {
        this.startEditing();
        this.addToValuePanel();
        this.stopPropagation();
        this.focus();
        this.addKeyUpHandlerToEditComponent(KeyUpHandler.onKeyUp(evt => this.onKeyUpEvent(evt)));
        this.addBlurHandlerToEditComponent(OnBlurHandler.onBlur(() => this.onBlurEvent()));
        this.cellEditor.setEndEditingHandler({execute: () => this.stopEditing()});
    }

    /*private*/
    onBlurEvent() {
        this.asElement(this.cellEditor).remove();
        this.valuChangeRegistration.removeHandler();
        this.cellEditor.getHasValue().setValue(null);
        this.stopEditing();
    }

    stopEditing() {
        this.cell.draw();
        this.__isEditing = false;
    }

    private startEditing() {
        this.__isEditing = true;
        let cellValue: M = this.cell.getCellConfig().getFieldGetter()(this.cell.getModel());
        this.cellEditor = this.cell.getCellEditor();
        if (this.cellEditor == null) {
            throw new DOMException('Define edit component for the type.');
        }
        this.cellEditor.getHasValue().setValue(cellValue, false);
        this.valuChangeRegistration = this.cellEditor.getHasValue()
            .addValueChangeHandler(ValueChangeHandler.onValueChange(evt => this.onValueChangedEvent()));
        this.cellEditor.startEditing();
    }

    /*private*/
    originalValue: M = null;

    /*private*/
    onValueChangedEvent() {
        this.stopBlur = true;
        try {
            this.validateEnteredValue();
            if (this.autoCommit) {
                this.originalValue = this.cell.getCellConfig().getFieldGetter()(this.cell.getModel());
                this.cell.getCellConfig().getFieldSetter()(this.cell.getModel(), this.cellEditor.getHasValue().getValue());
                CellEditEvent.fire(this.cell.getOwner(),this.cell);
                // this.cell.getOwner().fireEvent({cell: this.cell} as CellEditEvent<T>);
            }
            this.stopEditing();
        } catch (ex) {
            this.cellView.setErrorStyle(true);
        }
        this.stopBlur = false;
    }


    /*private*/
    private onKeyUpEvent(event: KeyboardEvent) {
        this.stopBlur = true;
        if (event.code === 'Escape') {
            this.onBlurEvent();
        } else {
            try {
                this.validateAsYouType();
                this.cellView.setErrorStyle(false);
            } catch (e) {
                this.cellView.setErrorStyle(true);
            }
        }
        this.stopBlur = false;
    }

    addToValuePanel() {
        this.cellView.setToValuePanel(this.asElement(this.cellEditor));
    }

    addBlurHandlerToEditComponent(handler: OnBlurHandler) {
        if ((this.cellEditor.getIsElement() as unknown as HasBlurHandlers).addBlurHandler) {
            (<HasBlurHandlers><unknown>this.cellEditor.getIsElement()).addBlurHandler(handler);
        } else {
            Util.addHandler(this.cellEditor.getIsElement().asElement(), handler);
        }
    }

    addKeyUpHandlerToEditComponent(handler: KeyUpHandler) {
        handler.addTo(this.asElement(this.cellEditor));
    }

    focus() {
        this.cellEditor.getFocusable().setFocus(true);
    }

    stopPropagation() {
        this.asElement(this.cellEditor).addEventListener(ClickHandler.TYPE, (e) => {
            return e.stopPropagation();
        });
        this.asElement(this.cellEditor).addEventListener(DoubleClickHandler.TYPE, (e) => {
            return e.stopPropagation();
        });
        this.asElement(this.cellEditor).addEventListener(KeyDownHandler.TYPE, (e) => {
            return e.stopPropagation();
        });
    }

    /*private*/
    asElement(cellEdit: CellEditor<any>): HTMLElement {
        return cellEdit.getIsElement().asElement();
    }

    /*private*/
    asValueParser(obj: any): HasValueParser<any> {
        if ((obj as HasValueParser<any>).getValueOrThrow) {
            return obj;
        }
        return null;
    }

    /*private*/
    validateAsYouType() {
        if (this.validator != null) {
            if (this.asValueParser(this.cellEditor) != null) {
                let value: M = <M><any>this.asValueParser(this.cellEditor).getValueOrThrow();
                this.validator.validate(value, this.cell.getModel());
            }
        }
    }

    /*private*/
    validateEnteredValue() {
        if (this.validator != null) {
            if (this.asValueParser(this.cellEditor) != null) this.validator.validate(this.cellEditor.getHasValue().getValue(), this.cell.getModel());
        }
    }

    public isEditing(): boolean {
        return this.__isEditing;
    }

    setCell(cell: BaseCell<any, any>) {
        this.cell = cell;
        this.cellView = cell.getCellView();
    }
}
