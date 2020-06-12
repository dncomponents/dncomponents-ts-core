import {View} from '../corecls/View';
import {IsElement} from '../corecls/IsElement';

export interface FocusComponentView extends View {

    getFocusElement(): HTMLElement;

    setEnabled(enabled: boolean): void;

    isDisabled(): boolean;
}

export class FocusLogic implements FocusComponentView {
    isElement: IsElement<any>;

    constructor(isElement: IsElement<any>) {
        this.isElement = isElement;
    }

    asElement(): HTMLElement {
        return this.isElement.asElement();
    }

    getFocusElement(): HTMLElement {
        return this.isElement.asElement();
    }

    isDisabled(): boolean {
        let disabled: boolean;
        if (this.getFocusElement() instanceof HTMLInputElement) {
            disabled = (<HTMLInputElement>this.getFocusElement()).disabled;
        } else {
            disabled = this.getFocusElement().hasAttribute('disabled');
        }
        return disabled;
    }

    setEnabled(enabled: boolean): void {
        if (this.getFocusElement() instanceof HTMLInputElement) {
            (<HTMLInputElement>this.getFocusElement()).disabled = !enabled;
        } else {
            if (!enabled)
                this.getFocusElement().setAttribute('disabled', 'true');
            else
                this.getFocusElement().removeAttribute('disabled');
        }
    }

}

export abstract class FocusComponentViewBase implements FocusComponentView {

    getFocusElement(): HTMLElement {
        return this.asElement();
    }

    isDisabled(): boolean {
        let disabled: boolean;
        if (this.getFocusElement() instanceof HTMLInputElement) {
            disabled = (<HTMLInputElement>this.getFocusElement()).disabled;
        } else {
            disabled = this.getFocusElement().hasAttribute('disabled');
        }
        return disabled;
    }

    setEnabled(enabled: boolean): void {
        if (this.getFocusElement() instanceof HTMLInputElement) {
            (this.getFocusElement() as HTMLInputElement).disabled = !enabled;
        } else {
            if (!enabled)
                this.getFocusElement().setAttribute('disabled', 'true');
            else
                this.getFocusElement().removeAttribute('disabled');
        }
    }

    abstract asElement(): HTMLElement;

}