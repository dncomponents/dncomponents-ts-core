import {AbstractSingleSelectionGroup} from './corecls/selectionmodel/selectionImpl';
import {CanSelect} from './BaseComponentMultiSelection';
import {SingleSelectionModel} from './corecls/selectionmodel/selection';
import {BaseComponent, HasUserValue} from './BaseComponent';
import {View} from './corecls/View';
import {SelectionHandler} from './corecls/handlers';
import {HandlerRegistration} from './corecls/events';
import {java} from 'j4ts';
import List = java.util.List;

export class BaseComponentSingleSelection<T, V extends View, C extends HasUserValue<T> & CanSelect> extends BaseComponent<T, V> implements SingleSelectionModel<C> {


    selectionGroup: AbstractSingleSelectionGroup<T, C> = new SelectionGroup();

    addSelectionHandler(handler: SelectionHandler<C>): HandlerRegistration {
        return this.selectionGroup.addSelectionHandler(handler);
    }

    getItems(): List<C> {
        return this.selectionGroup.getItems();
    }

    getSelection(): C {
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

    public getEntitySelectionModel(): SingleSelectionModel<T> {
        return this.selectionGroup.getEntitySelectionModel();
    }

}

class SelectionGroup extends AbstractSingleSelectionGroup<any, any> {
    setSelectedInView(model: any, b: boolean): void {
        model.setSelected(b);
    }
}
