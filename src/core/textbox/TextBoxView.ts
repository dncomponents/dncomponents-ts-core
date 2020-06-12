import {KeyUpHandler, OnBlurHandler} from '../corecls/handlers';
import {FocusComponentView} from '../views/FocusComponentView';

export interface TextBoxView extends FocusComponentView {
    getValue(): string;

    setValue(value: string): void;

    addOnInputChangeHandler(listener: EventListener): void;

    addOnBlurHandler(handler: OnBlurHandler): void;

    addOnKeyUpHandler(handler: KeyUpHandler): void;

    setError(b: boolean): void;

    setErrorMessage(errorMessage: string): void;

    setPlaceHolder(placeHolder: string): void;

}