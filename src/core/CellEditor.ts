import {Command} from './BaseComponent';
import {IsElement} from './corecls/IsElement';
import {HasValue} from './corecls/ValueClasses';
import {Focusable, HasBlurHandlers} from './corecls/handlers';

export interface CellEditor<M> {
    getHasValue(): HasValue<M>;

    getFocusable(): Focusable;

    getIsElement(): IsElement<any>;

    startEditing(): void;

    getHasBlurHandler(): HasBlurHandlers;

    setEndEditingHandler(endEditing: Command): void;
}

export class DefaultCellEditor<M, C extends HasValue<any> & Focusable & IsElement<any> & HasBlurHandlers> implements CellEditor<M> {
    c: C;

    endEditing: Command;

    public constructor(c: C) {
        if (this.c === undefined) this.c = null;
        if (this.endEditing === undefined) this.endEditing = null;
        this.c = c;
    }

    public getHasValue(): HasValue<M> {
        return this.c;
    }

    public getFocusable(): Focusable {
        return this.c;
    }

    public getIsElement(): IsElement<any> {
        return this.c;
    }

    public startEditing() {
    }

    public getHasBlurHandler(): HasBlurHandlers {
        return this.c;
    }

    public setEndEditingHandler(endEditing: Command) {
        this.endEditing = endEditing;
    }
}
