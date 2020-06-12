import {CellView} from './CellView';
import {ClickHandler, DoubleClickHandler, KeyDownHandler} from './handlers';

export interface BaseCellView extends CellView {

    addClickHandler(clickHandler: ClickHandler): void;

    addDoubleClickHandler(doubleClickHandler: DoubleClickHandler): void;

    addKeyDownHandler(keyDownHandler: KeyDownHandler): void;

    setErrorStyle(b: boolean): void;

    setValueChangedStyle(b: boolean): void;

    setSelected(b: boolean): void;

    setFocus(b: boolean): void;

    setToValuePanel(element: Element): void;

    getValuePanel(): HTMLElement;
}
