import {HasValue} from '../ValueClasses';
import {HandlerRegistration, HasHandlers} from '../events';
import {SelectionHandler} from '../handlers';
import {java} from 'j4ts';
import List = java.util.List;

export interface HasSelectionHandlers<T> extends HasHandlers {
    addSelectionHandler(handler: SelectionHandler<T>): HandlerRegistration;
}

export interface BaseSelectionModel<T> {

    setSelected(model: T, b: boolean, fireEvent: boolean): boolean;

    setSelected(model: T, b: boolean): boolean;

    isSelected(value: T): boolean;

    getItems(): List<T>;
}

export interface MultiSelectionModel<T> extends BaseSelectionModel<T>,
    HasSelectionHandlers<List<T>> {

    getSelection(): List<T>;

    isSelected(value: T): boolean;

    getHasValue(): HasValue<List<T>>;
}

export interface SingleSelectionModel<T> extends BaseSelectionModel<T>,
    HasSelectionHandlers<T> {

    getSelection(): T;

    isSelected(value: T): boolean;
}