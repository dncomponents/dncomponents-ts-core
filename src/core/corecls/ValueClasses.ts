import {EventHandler, HandlerRegistration, HasHandlers} from './events';

export interface HasValue<T> extends TakesValue<T>, HasValueChangeHandlers<T> {

    getValue(): T;

    setValue(value: T): void;

    setValue(value: T, fireEvents: boolean): void;
}

export interface TakesValue<V> {

    setValue(value: V): void;

    getValue(): V;
}

export interface HasValueChangeHandlers<T> extends HasHandlers {
    addValueChangeHandler(handler: ValueChangeHandler<T>): HandlerRegistration;
}

export abstract class ValueChangeHandler<T> extends EventHandler<ValueChangeEvent<T>> {

    public static readonly TYPE: string = 'valueChangeEventLogic';

    abstract onValueChange(event: ValueChangeEvent<T>): void;

    handleEvent(evt: ValueChangeEvent<T>): void {
        this.onValueChange(evt);
    }

    getType(): string {
        return ValueChangeHandler.TYPE;
    }
    public static onValueChange<T>(c: (evt: ValueChangeEvent<T>) => void): ValueChangeHandler<T> {
        return new class extends ValueChangeHandler<T> {
            onValueChange = c;
        };
    }


}

export class ValueChangeEvent<T> extends CustomEvent<any> {

    value: T;

    constructor(value: T) {
        super(ValueChangeHandler.TYPE);
        this.value = value;
    }

    public static fire<T>(source: HasValueChangeHandlers<T>, value: T): void {
        let event = new ValueChangeEvent<T>(value);
        source.fireEvent(event);
    }

    public static fireIfNotEqual<T>(source: HasValueChangeHandlers<T>, oldValue: T, newValue: T): void {
        if (oldValue != newValue && (oldValue == null || !(oldValue === newValue))) {
            let event = new ValueChangeEvent<T>(newValue);
            source.fireEvent(event);
        }
    }

}