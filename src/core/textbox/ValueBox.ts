import {BaseFocusComponent} from './BaseFocusComponent';
import {TextBoxView} from './TextBoxView';
import {HasValue, ValueChangeEvent, ValueChangeHandler} from '../corecls/ValueClasses';
import {HandlerRegistration} from '../corecls/events';
import {KeyUpHandler, OnBlurHandler} from '../corecls/handlers';
import {HasValueParser} from './HasValueParser';

export abstract class ValueBox<T> extends BaseFocusComponent<Object, TextBoxView> implements HasValue<T>, HasValueParser<T> {

    value: T;
    triggerOnBlur: boolean;

    constructor(view: TextBoxView) {
        super(view);
        this.bind();
    }

    addValueChangeHandler(handler: ValueChangeHandler<T>): HandlerRegistration {
        return handler.addTo(this.asElement());
    }

    getValue(): T {
        return this.value;
    }

    setValue(value: T): void;
    setValue(value: T, fireEvents: boolean): void;
    setValue(value: T, fireEvents?: boolean): void {
        let oldValue = this.getValue();
        this.value = value;
        this.view.setValue(this.renderThis(value));
        if (fireEvents) {
            let newValue = this.getValue();
            ValueChangeEvent.fireIfNotEqual(this, oldValue, newValue);
        }

    }

    abstract parseString(str: string): T ;

    abstract renderThis(t: T): string;

    private bind() {
        let self = this;
        this.view.addOnBlurHandler(OnBlurHandler.onBlur(evt => {
            if (self.triggerOnBlur) return;
            let parsedValue = self.parseString(self.view.getValue());
            self.setValue(parsedValue, true);
        }));
        this.view.addOnKeyUpHandler(KeyUpHandler.onKeyUp(evt => {
            if (evt.key == 'Enter')
                this.setValue(this.parseString(this.view.getValue()), true);
        }));
    }

    public getValueOrThrow(): T {
        let text: string = this.view.getValue();
        let parseResult: T = this.parseString(text);
        if ('' === text) {
            return null;
        }
        return parseResult;
    }

}