import {BaseFocusComponent} from '../textbox/BaseFocusComponent';
import {HasValue, ValueChangeEvent, ValueChangeHandler} from '../corecls/ValueClasses';
import {CellConfig} from '../CellConfig';
import {Filter} from '../corecls/Filter';
import {ClickHandler, KeyUpHandler, OnBlurHandler, SelectionHandler} from '../corecls/handlers';
import {HandlerRegistration} from '../corecls/events';
import {Predicate} from '../AbstractCellComponent';
import {BaseAutocompleteView} from './views/BaseAutocompleteView';
import {java} from 'j4ts';
import ArrayList = java.util.ArrayList;

export abstract class AbstractAutocomplete<T, V extends BaseAutocompleteView<T>, C> extends BaseFocusComponent<T, V> implements HasValue<C> {

    protected listShowing: boolean;

    private value: C;

    protected filter: Filter<T>;

    protected constructor(view: V);
    protected constructor(view: V, fieldGetter: (p1: T) => string);
    protected constructor(view: V, fieldGetter?: (p1: T) => string) {
        super(view);
        if (fieldGetter != null)
            this.getRowCellConfig().setFieldGetter(fieldGetter);
        this.bind();
    }

    protected isMultiSelect(): boolean {
        return false;
    }

    private bind(): void {
        let self = this;
        this.filter = new class extends Filter<T> {
            compare(): Predicate<T> {
                return (o: T) => {
                    if (self.getView().getTextBoxCurrentValue() == null)
                        return true;
                    return self.getRowCellConfig()
                        .getFieldGetter()(o)
                        .toString()
                        .toLowerCase()
                        .includes(self.view.getTextBoxCurrentValue().toLowerCase());
                };
            }
        };
        this.view.setFilter(this.filter);
        this.view.showListPanel(false, null);
        this.view.addSelectionHandler(SelectionHandler.onSelection(evt => {
            if (this.isMultiSelect())
                this.setValue(<any>new ArrayList<any>(evt.selection), true);
            else
                this.setValue(<any>evt.selection.stream().findFirst().orElse(null), true);
        }));
        // this.view.setFilter(this.filter);
        this.view.addKeyUpHandler(KeyUpHandler.onKeyUp(evt => {
            if ('Escape' === evt.code) {
                this.showList(false);
            } else if ('ArrowDown' === evt.code) {
                this.view.focusList();
            } else
                this.filter.fireFilterChange();
        }));
        this.addValueChangeHandler(ValueChangeHandler.onValueChange(() => this.showList(false)));
        this.view.addButtonClickHandler(ClickHandler.onClick(
            (e: MouseEvent) => {
                this.showList(!this.listShowing);
            }
        ));
        this.blurRegistration = this.addBlurHandler(OnBlurHandler.onBlur(evt =>
            this.showList(false))
        );
    }

    blurRegistration: HandlerRegistration;

    public isListShowing(): boolean {
        return this.listShowing;
    }

    public showList(b: boolean) {
        let self = this;
        this.view.showListPanel(b, {
            execute(): void {
                self.view.setTextBoxFocused(b);
                self.listShowing = b;
                if (!self.listShowing) {
                    self.view.setTextBoxCurrentValue(null);
                    self.filter.fireFilterChange();
                }
            }
        });
    }

    getView(): V {
        return super.getView();
    }

    public getRowCellConfig(): CellConfig<T, String> {
        return this.view.getRowCellConfig();
    }

    public addValueChangeHandler(handler: ValueChangeHandler<C>): HandlerRegistration {
        return handler.addTo(this.asElement());
    }

    public getValue(): C {
        return this.value;
    }

    public setValue(value: C): void;
    public setValue(value: C, fireEvents: boolean): void;
    public setValue(value: C, fireEvents?: boolean): void {
        let oldValue = this.getValue();
        this.value = value;
        if (value != null) {
            if (!this.isMultiSelect())
                this.view.setStringValue(this.getRowCellConfig().getFieldGetter().apply(this, [this.value]));
            /** // @ts-ignore */
            // @ts-ignore
            this.view.getSelectionModel().setSelected(this.value, true, false);
            this.view.getHasRowsData().refreshSelections();
        } else {
            this.view.setStringValue('Choose');
            this.view.getSelectionModel().clearSelection(false);
            this.view.getHasRowsData().refreshSelections();
        }
        if (fireEvents) {
            let newValue = this.getValue();
            ValueChangeEvent.fireIfNotEqual(this, oldValue, newValue);
        }
    }

}
