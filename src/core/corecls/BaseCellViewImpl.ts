import {UiField, UiStyle} from '../TemplateParser';
import {ClickHandler, DoubleClickHandler, KeyDownHandler} from './handlers';
import {BaseCellView} from './BaseCellView';

export abstract class BaseCellViewImpl implements BaseCellView {

    @UiStyle
    modelSelected: string;
    @UiStyle
    cellHighlighted: string;
    @UiStyle
    errorCell: string;
    @UiStyle
    valueChanged: string;
    @UiField
    public valuePanel: HTMLElement;
    @UiField
    public root: HTMLElement;


    public addClickHandler(clickHandler: ClickHandler) {
        clickHandler.addTo(this.asElement());
    }


    public addDoubleClickHandler(doubleClickHandler: DoubleClickHandler) {
        doubleClickHandler.addTo(this.asElement());
    }

    public addKeyDownHandler(keyDownHandler: KeyDownHandler) {
        keyDownHandler.addTo(this.asElement());
    }

    public setErrorStyle(b: boolean) {
        if (b)
            this.asElement().classList.add(this.errorCell);
        else
            this.asElement().classList.remove(this.errorCell);
    }

    public setValueChangedStyle(b: boolean) {
        if (b)
            this.asElement().classList.add(this.valueChanged);
        else
            this.asElement().classList.remove(this.valueChanged);
    }

    public setSelected(b: boolean) {
        if (b)
            this.asElement().classList.add(this.modelSelected);
        else
            this.asElement().classList.remove(this.modelSelected);
    }

    public setFocus(b: boolean) {
        if (b) {
            this.asElement().setAttribute('tabindex', '0');
            this.asElement().focus();
        } else {
            this.asElement().removeAttribute('tabindex');
            this.asElement().blur();
        }
    }

    public setToValuePanel(element: Element) {
        this.getValuePanel().innerHTML = '';
        this.getValuePanel().appendChild(element);
    }

    public getValuePanel(): HTMLElement {
        return this.valuePanel;
    }

    public asElement(): HTMLElement {
        return this.root;
    }

}
