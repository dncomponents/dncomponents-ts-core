import {FocusComponentView} from '../views/FocusComponentView';
import {HandlerRegistration} from '../corecls/events';
import {OnChangeHandler} from '../corecls/handlers';
import {HasMainViewSlots} from '../BaseComponent';

export interface CheckBoxView extends FocusComponentView, HasMainViewSlots {
    isChecked(): boolean;

    setChecked(b: boolean): void;

    setIndeterminate(b: boolean): void;

    setLabel(txt: string): void;

    addOnChangeHandler(changeHandler: OnChangeHandler): HandlerRegistration;

    setName(nameOfGroup: string): void;

    getLabel(): string;
}

