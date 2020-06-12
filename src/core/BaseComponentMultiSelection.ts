import {View} from './corecls/View';
import {BaseComponent, HasUserValue} from './BaseComponent';
import {AbstractMultiSelectionGroup} from './corecls/selectionmodel/selectionImpl';
import {MultiSelectionModel} from './corecls/selectionmodel/selection';
import {SelectionHandler} from './corecls/handlers';
import {HandlerRegistration} from './corecls/events';
import {HasValue} from './corecls/ValueClasses';
import {java} from 'j4ts';
import List = java.util.List;

export abstract class BaseComponentMultiSelection<T, V extends View, C extends HasUserValue<T> & CanSelect> extends BaseComponent<T, V> implements MultiSelectionModel<C> {

    selectionGroup: AbstractMultiSelectionGroup<T, C> = new MultiSelectionGroup();

    constructor(ui: V) {
        super(ui);
    }

    addSelectionHandler(handler: SelectionHandler<List<C>>): HandlerRegistration {
        return this.selectionGroup.addSelectionHandler(handler);
    }

    getHasValue(): HasValue<List<C>> {
        return this.selectionGroup.getHasValue();
    }

    getItems(): List<C> {
        return this.selectionGroup.getItems();
    }

    getSelection(): List<C> {
        return this.selectionGroup.getSelection();
    }

    isSelected(value: C): boolean {
        return this.selectionGroup.isSelected(value);
    }

    setSelected(model: C, b: boolean, fireEvent: boolean): boolean;
    setSelected(model: C, b: boolean): boolean;
    setSelected(model: C, b: boolean, fireEvent?: boolean): boolean {
        if (fireEvent == null)
            fireEvent = false;
        return this.selectionGroup.setSelected(model, b, fireEvent);
    }

    public addItem(item: C): void {
        this.selectionGroup.addItem(item);
    }

    public removeItem(item: C): void {
        this.selectionGroup.removeItem(item);
    }

    public removeAllItems(): void {
        this.selectionGroup.getItems().clear();
    }

    public addItems(arr: List<C>): void {
        this.selectionGroup.addItems(arr);
    }

    public addEntityItems(items: List<T>): void {
        for (let index = items.iterator(); index.hasNext();) {
            let model = index.next();
            this.addItem(this.createItem(model));
        }
    }

    protected abstract createItem(t: T): C;

    public getEntitySelectionModel(): MultiSelectionModel<T> {
        return this.selectionGroup.getEntitySelectionModel();
    }


}

export class MultiSelectionGroup<T, C extends HasUserValue<T> & CanSelect> extends AbstractMultiSelectionGroup<T, C> {

    setSelectedInView(model: C, b: boolean): void {
        model.setSelected(b);
    }
}

export interface CanSelect {
    setSelected(b: boolean): void;

    isSelected(): boolean;
}
