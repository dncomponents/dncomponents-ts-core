import {HasSelectionHandlers, MultiSelectionModel, SingleSelectionModel} from './selection';
import {SelectionEvent, SelectionHandler} from '../handlers';
import {HandlerRegistration, HasHandlers} from '../events';
import {HasUserValue} from '../../BaseComponent';
import {HasValue, ValueChangeEvent, ValueChangeHandler} from '../ValueClasses';
import {Util} from '../Util';
import {java} from 'j4ts';
import List = java.util.List;
import ArrayList = java.util.ArrayList;
import Collectors = java.util.stream.Collectors;

export abstract class DefaultSingleSelectionModel<T> implements SingleSelectionModel<T> {

    selection: T;
    lastSelection: T;
    private bus: HTMLElement;

    getSelection(): T {
        return this.selection;
    }

    setSelected(model: T, b: boolean): boolean;
    setSelected(model: T, b: boolean, fireEvent: boolean): boolean;
    setSelected(model: T, b: boolean, fireEvent?: boolean): boolean {
        if (fireEvent == null) {
            fireEvent = false;
        }
        let changed = false;
        if (!this.getItems().contains(model))
            return false;
        if (this.selection != model) {
            changed = true;
            this.lastSelection = this.selection;
            this.selection = model;
        }
        if (changed) {
            if (this.lastSelection != null)
                this.setSelectedInView(this.lastSelection, false);
            this.setSelectedInView(model, b);
        }
        if (changed && fireEvent)
            this.fireSelectionChange();
        return changed;
    }

    public setSelectedInView(model: T, b: boolean): void {
    }


    fireSelectionChange(): void {
        SelectionEvent.fireEl(this.ensureHandlers(), this.selection);
    }


    isSelected(value: T): boolean {
        return this.selection == value;
    }


    abstract getItems(): List<T>;


    addSelectionHandler(handler: SelectionHandler<T>): HandlerRegistration {
        return handler.addTo(this.ensureHandlers());
    }

    fireEvent(event: CustomEvent<any>): void {
        this.ensureHandlers().dispatchEvent(event);
    }

    private ensureHandlers(): HTMLElement {
        if (this.bus == null)
            this.bus = Util.createDiv();
        return this.bus;
    }
}

export class AbstractSingleSelectionGroup<T, C extends HasUserValue<T>> extends DefaultSingleSelectionModel<C> {

    possibleValues: List<C> = new ArrayList<C>();
    entitySelectionModel = new EntitySingleSelectionModel<T, C>(this);
    hasValue: HasValue<T> = new HasValueModel<T, C>(this);


    getEntitySelectionModel(): SingleSelectionModel<T> {
        return this.entitySelectionModel;
    }


    getHasValue(): HasValue<T> {
        return this.hasValue;
    }


    public removeItem(value: C): void {
        this.possibleValues.remove(value);
        if (value === (this.selection))
            this.selection = null;
    }


    public addItemsArr(...value: C[]): any {
        for (let c of value) {
            this.addItem(c);
        }
    }

    public addItems(values: List<C>): void {
        values.forEach(value1 => this.addItem(value1));
    }

    public addItem(value: C): void {
        if (value != null && !this.possibleValues.contains(value))
            this.possibleValues.add(value);
        else throw new DOMException('Can\'t add ' + value + ' as item');
    }

    getItems(): List<C> {
        return this.possibleValues;
    }

    public getElementByModel(value: T): C {
        return this.possibleValues
            .stream()
            .filter(value1 => value1.getUserObject() == value)
            .findFirst()
            .orElse(null);
    }

    fireSelectionChange(): void {
        super.fireSelectionChange();
        SelectionEvent.fire(this.entitySelectionModel, this.entitySelectionModel.getSelection());
        ValueChangeEvent.fire(this.hasValue, this.entitySelectionModel.getSelection());
    }
}

export class AbstractHandler implements HasHandlers {

    private bus: HTMLElement;

    fireEvent(event: CustomEvent<any>): void {
        this.ensureHandlers().dispatchEvent(event);
    }

    ensureHandlers(): HTMLElement {
        if (this.bus == null)
            this.bus = Util.createDiv();
        return this.bus;
    }

}

export abstract class AbstractValueChangeHandler<T> extends AbstractHandler implements HasValue<T> {

    addValueChangeHandler(handler: ValueChangeHandler<T>): HandlerRegistration {
        return handler.addTo(this.ensureHandlers());
    }

    abstract getValue(): T;

    abstract setValue(value: T): void;
    abstract setValue(value: T, fireEvents: boolean): void;
}

export class AbstractSelectionHandler<T> extends AbstractHandler implements HasSelectionHandlers<T> {
    addSelectionHandler(handler: SelectionHandler<T>): HandlerRegistration {
        return handler.addTo(this.ensureHandlers());
    }
}

export class HasValueModel<T, C extends HasUserValue<T>> extends AbstractValueChangeHandler<T> implements HasValue<T> {
    private group: AbstractSingleSelectionGroup<T, C>;

    constructor(group: AbstractSingleSelectionGroup<T, C>) {
        super();
        this.group = group;
    }

    getValue(): T {
        return this.group.entitySelectionModel.getSelection();
    }

    setValue(value: T): void;
    setValue(value: T, fireEvents?: boolean): void {
        if (fireEvents == null)
            fireEvents = false;
        this.group.entitySelectionModel.setSelected(value, true, fireEvents);
    }

}

export class EntitySingleSelectionModel<T, C extends HasUserValue<T>> extends AbstractSelectionHandler<T> implements SingleSelectionModel<T> {
    private group: AbstractSingleSelectionGroup<T, C>;

    constructor(group: AbstractSingleSelectionGroup<T, C>) {
        super();
        this.group = group;
    }

    getSelection(): T {
        return this.group.selection == null ? null : this.group.selection.getUserObject();
    }

    getItems(): List<T> {
        return this.group.possibleValues.stream().map(e => e.getUserObject()).collect(Collectors.toList());
    }

    isSelected(value: T): boolean {
        return false;
    }

    setSelected(model: T, b: boolean): boolean;
    setSelected(model: T, b: boolean, fireEvent: boolean): boolean;
    setSelected(model: T, b: boolean, fireEvent?: boolean): boolean {
        return this.group.setSelected(this.group.getElementByModel(model), b, fireEvent);
    }
}

export abstract class DefaultMultiSelectionModel<M> implements MultiSelectionModel<M> {

    protected selectionMode: SelectionMode = SelectionMode.MULTI;
    selection: List<M> = new ArrayList<M>();
    hasValue: HasValue<List<M>> = new HasValueDefaultMultiSelectionModel(this);
    private bus: HTMLElement;


    public getSelection(): List<M> {
        return new ArrayList<M>(this.selection);
    }

    public getFirstSelected(): M {
        return !this.selection.isEmpty() ? this.selection.get(0) : null;
    }


    public isSelected(item: M): boolean {
        return this.selection.contains(item);
    }


    abstract getItems(): List<M>;

    private setSelectedList(models: List<M>, b: boolean, fireEvent?: boolean): void {
        let changed = false;
        let fe = fireEvent != null ? fireEvent : false;
        for (let index = models.iterator(); index.hasNext();) {
            let model = index.next();
            let b1 = this.setSelected(model, b, fe);
            if (b1 && !changed) {
                changed = true;
            }
        }
        if (changed && fireEvent)
            this.fireSelectionChange();
    }

    setSelected(model: List<M> | M, b: boolean): boolean;
    setSelected(model: List<M> | M, b: boolean, fireEvent?: boolean): boolean;
    public setSelected(model: List<M> | M, b: boolean, fireEvent?: boolean): boolean {
        if (isList<M>(model)) {
            this.setSelectedList(model, b, fireEvent);
        } else {
            let changed = false;
            if (!this.getItems().contains(model))
                return false;
            if (b) {
                if (!this.isSelected(model)) {
                    if (this.selectionMode == SelectionMode.SINGLE) {
                        this.selectAll(false, false);
                    }
                    this.selection.add(model);
                    changed = true;
                }
            } else {
                if (this.isSelected(model)) {
                    this.selection.remove(model);
                    changed = true;
                }
            }
            if (changed)
                this.setSelectedInView(model, b);

            if (changed && fireEvent) {
                this.fireSelectionChange();
            }
            return changed;
        }
    }

    public selectAll(value: boolean, fire: boolean): void {
        if (value) {
            this.selection.clear();
            this.selection.addAll(this.getItems());
        } else {
            this.selection.clear();
        }
        this.getItems().forEach(v => {
            this.setSelectedInView(v, value);
        });
        if (fire)
            this.fireSelectionChange();
    }

    public setSelectedInView(model: M, b: boolean): void {

    }

    public clearSelection(fire: boolean): void {
        this.selectAll(false, fire);
    }

    public getSelectionMode(): SelectionMode {
        return this.selectionMode;
    }

    public setSelectionMode(selectionMode: SelectionMode): void {
        this.selectionMode = selectionMode;
    }

    public isAllSelected(): boolean {
        return this.selection.size() == this.getItems().size() && this.getItems().size() > 0;
    }

    addSelectionHandler(handler: SelectionHandler<List<M>>): HandlerRegistration {
        return handler.addTo(this.ensureHandlers());
    }

    protected fireSelectionChange(): void {
        SelectionEvent.fire(this, this.selection);
        ValueChangeEvent.fire(this.getHasValue(), this.selection);
    }

    protected ensureHandlers(): HTMLElement {
        if (this.bus == null)
            this.bus = Util.createDiv();
        return this.bus;
    }

    fireEvent(event: CustomEvent<any>): void {
        this.ensureHandlers().dispatchEvent(event);
    }

    getHasValue(): HasValue<List<M>> {
        return this.hasValue;
    }

}

class HasValueDefaultMultiSelectionModel<T, C extends HasUserValue<T>> extends AbstractValueChangeHandler<List<T>> {
    private multiSelectionModel: DefaultMultiSelectionModel<any>;

    constructor(multiSelectionModel: DefaultMultiSelectionModel<any>) {
        super();
        this.multiSelectionModel = multiSelectionModel;
    }

    getValue(): List<T> {
        return this.multiSelectionModel.getSelection();
    }

    setValue(value: List<T>): void;
    setValue(value: List<T>, fireEvents?: boolean): void {
        let oldValue = this.getValue();
        if (value == null) {
            this.multiSelectionModel.selectAll(false, false);
            if (fireEvents)
                ValueChangeEvent.fireIfNotEqual(this, oldValue, this.getValue());
        } else if (!(oldValue.containsAll(value) && oldValue.size() == value.size())) {
            this.multiSelectionModel.selectAll(false, false);
            this.multiSelectionModel.setSelected(value, true, true);
            if (fireEvents)
                ValueChangeEvent.fireIfNotEqual(this, oldValue, this.getValue());
        }
    }
}

export enum SelectionMode {
    SINGLE, MULTI
}

export class AbstractMultiSelectionGroup<T, C extends HasUserValue<T>>
    extends DefaultMultiSelectionModel<C> {

    possibleValues: List<C> = new ArrayList<C>();

    public removeItem(value: C): void {
        this.possibleValues.remove(value);
        this.selection.remove(value);
    }

    public addItems(items: List<C>): void {
        items.forEach(e => this.addItem(e));
    }

    public addItem(value: C): void {
        if (value != null && !this.possibleValues.contains(value))
            this.possibleValues.add(value);
    }


    public getItems(): List<C> {
        return this.possibleValues;
    }

    public getElementByModel(value: T): C {
        return this.getItems()
            .stream()
            .filter(value1 => value1.getUserObject() == value)
            .findFirst()
            .orElse(null);
    }

    protected fireSelectionChange(): void {
        super.fireSelectionChange();
        SelectionEvent.fire(this.entitySelectionModel, this.entitySelectionModel.getSelection());
        ValueChangeEvent.fire(this.entitySelectionModel.getHasValue(), this.entitySelectionModel.getHasValue().getValue());
    }

    private entitySelectionModel: MultiSelectionModel<T> = new EntitySelectionModel(this);

    public getEntitySelectionModel(): MultiSelectionModel<T> {
        return this.entitySelectionModel;
    }

}

export class EntitySelectionModel<T, C extends HasUserValue<T>> extends AbstractSelectionHandler<List<T>> implements MultiSelectionModel<T> {

    private group: AbstractMultiSelectionGroup<T, C>;

    private entityHasValue: HasValue<List<T>>;

    constructor(group: AbstractMultiSelectionGroup<T, C>) {
        super();
        this.group = group;
        this.entityHasValue = new HasValueModelMulti(this);
    }

    getSelection(): List<T> {
        return this.group.selection.stream().map(p1 => p1.getUserObject()).collect(Collectors.toList());
    }


    public getHasValue(): HasValue<List<T>> {
        return this.entityHasValue;
    }

    setSelected(model: T, b: boolean): boolean;
    setSelected(model: T, b: boolean, fireEvent: boolean): boolean;
    public setSelected(model: T, b: boolean, fireEvent?: boolean): boolean {
        return this.group.setSelected(this.group.getElementByModel(model), b, fireEvent);
    }

    public getItems(): List<T> {
        return this.group.possibleValues.stream().map(p1 => p1.getUserObject()).collect(Collectors.toList());
    }

    isSelected(value: T): boolean {
        return this.getSelection().contains(value);
    }
}

class HasValueModelMulti<T, C extends HasUserValue<T>> extends AbstractValueChangeHandler<List<T>> {
    private multiSelectionModel: EntitySelectionModel<any, any>;

    constructor(multiSelectionModel: EntitySelectionModel<any, any>) {
        super();
        this.multiSelectionModel = multiSelectionModel;
    }

    getValue(): List<T> {
        return this.multiSelectionModel.getSelection();
    }

    setValue(value: List<T>): void;
    setValue(value: List<T>, fireEvents?: boolean): void {
        for (let index = value.iterator(); index.hasNext();) {
            let model = index.next();
            this.multiSelectionModel.setSelected(model, fireEvents);
        }
    }
}

function isList<M>(model: List<M> | M): model is List<M> {
    return (model as List<M>).addAll !== undefined && (model as List<M>).contains !== undefined;
}