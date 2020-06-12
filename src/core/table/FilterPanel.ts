import {BaseComponent} from '../BaseComponent';
import {java} from 'j4ts';
import {CellEditor} from '../CellEditor';
import {FilterPanelView} from './views/TableUi';
import {IsElement} from '../corecls/IsElement';
import {ValueChangeHandler} from '../corecls/ValueClasses';
import {ClickHandler} from '../corecls/handlers';
import {Comparator, FilterUtil} from './FilterUtil';

export class FilterPanel<T> extends BaseComponent<T, FilterPanelView<any>> implements HasFilterValue<T> {
    filterValueHandler: FilterValueHandler<T>;

    comparators: java.util.List<any>;

    private hideClear: boolean;

    __currentComparator: Comparator<any, any>;

    __currentValue: any;

    private readonly valueComponent: CellEditor<T>;


    public constructor(view: FilterPanelView<any>, clazz?: string) {
        super(view);
        if (clazz) {
            this.comparators = FilterUtil.getComparators(clazz);
            this.view.setValueComponent(clazz);
            this.valueComponent = view.getValueComponent();
            this.view.setValueComponent(this.valueComponent);
            this.bind();
        }
    }


    setValueComponentFromComparator(comparator: Comparator<any, any>) {

    }

    onValueChanged() {
        if (this.currentValue() != null || FilterUtil.isEmptyComparator(this.currentComparator())) {
            this.filterValueHandler.selected(this.currentValue(), this.currentComparator());
        }
        this.view.getValueComponent().getFocusable().setFocus(true);
    }

    currentValue(): T {
        return <T><any>this.view.getValueComponent().getHasValue().getValue();
    }

    currentComparator(): Comparator<any, any> {
        return <Comparator<any, any>>this.view.getComparatorHasValue().getValue();
    }

    bind() {
        this.view.getValueComponent().getHasValue().addValueChangeHandler(ValueChangeHandler.onValueChange(evt => this.onValueChanged()));
        this.view.getComparatorHasValue().addValueChangeHandler(ValueChangeHandler.onValueChange(evt => {
            let comparator: Comparator<any, any> = evt.value;
            if (this.__currentValue != null || FilterUtil.isEmptyComparator(this.__currentComparator)) {
                this.filterValueHandler.selected(null, null);
                this.view.getValueComponent().getHasValue().setValue(null, false);
            } else if (FilterUtil.isEmptyComparator(comparator)) {
                this.filterValueHandler.selected(null, comparator);
                this.view.setValueComponent(null);
                return;
            }
            this.setValueComponentFromComparator(comparator);
            this.view.getComparatorHasValue().setValue(comparator, false);
            this.focusValueComponent();
        }));
        this.view.getComparatorHasRowsData().setRowsData(this.comparators);
        this.view.getComparatorHasRowsData().drawData();
        this.view.getComparatorHasValue().setValue(this.comparators.get(0));
        this.view.addClearClickHandler(ClickHandler.onClick(evt => {
            this.filterValueHandler.selected(null, null);
            this.focusValueComponent();
        }));
    }


   private focusValueComponent() {
        if (this.view.getValueComponent() != null) {
            this.view.getValueComponent().getFocusable().setFocus(true);
        }
    }

    public setValue(userEnteredValue: any, comparator: Comparator<any, any>) {
        this.__currentValue = userEnteredValue;
        this.__currentComparator = comparator;
        if (!this.hideClear)
            this.view.showClearElement(userEnteredValue != null || FilterUtil.isEmptyComparator(comparator));
        this.view.getValueComponent().getHasValue().setValue(userEnteredValue);
        if (comparator != null) {
            this.setValueComponentFromComparator(comparator);
        } else {
            if (!this.view.getComparatorHasRowsData().getRowsData().isEmpty()) {
                this.view.getComparatorHasValue().setValue(this.comparators.get(0));
                this.setValueComponentFromComparator(this.comparators.get(0));
            }
        }
    }

    public setFilterValueHandler(handler: FilterValueHandler<T>) {
        this.filterValueHandler = handler;
    }

    public hideClearButton() {
        this.hideClear = true;
        this.view.showClearElement(false);
    }
}

export interface HasFilterValue<T> extends IsElement<any> {
    setValue(userEnteredValue: T, comparator: Comparator<any, any>): void;

    setFilterValueHandler(handler: FilterValueHandler<T>): void;
}

export interface FilterValueHandler<T> {
    selected(userEnteredValue: T, comparator: Comparator<any, any>): void;
}
