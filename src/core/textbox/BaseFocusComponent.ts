import {FocusComponentView} from '../views/FocusComponentView';
import {BaseComponent} from '../BaseComponent';
import {HandlerRegistration} from '../corecls/events';
import {Focusable, HasBlurHandlers, HasFocusHandlers, OnBlurHandler, OnFocusHandler} from '../corecls/handlers';

export class BaseFocusComponent<T, V extends FocusComponentView> extends BaseComponent<T, V>
    implements Focusable, HasFocusHandlers, HasBlurHandlers {

    enabled: boolean = true;
    protected focused: boolean = false;
    private firstTimeFocused: boolean = false;

    constructor(view: V) {
        super(view);
        this.initComplexFocus();
    }

    public int(): number {
        return this.focusElement().tabIndex;
    }

    public setAccessKey(key: any): void {
        this.focusElement().setAttribute('accesskey', key);
    }

    public setFocus(focused: boolean): void {
        if (focused)
            this.focusElement().focus();
        else
            this.asElement().blur();
    }

    public setTabIndex(index: any): void {
        this.focusElement().setAttribute('tabindex', index);
    }

    getTabIndex(): number {
        return this.focusElement().tabIndex;
    }

    protected focusElement(): HTMLElement {
        return this.view.getFocusElement();
    }

    addFocusHandler(handler: OnFocusHandler): HandlerRegistration {
        return handler.addTo(this.asElement());
    }

    public addBlurHandler(handler: OnBlurHandler): HandlerRegistration {
        return handler.addTo(this.asElement());
    }

    public isEnabled(): boolean {
        return this.enabled;
    }

    public setEnabled(enabled: boolean): void {
        this.enabled = enabled;
        this.view.setEnabled(enabled);
    }

    private initComplexFocus(): void {
        this.asElement().addEventListener('focusout', ev => {
            this.focused = false;
            setTimeout(() => {
                if (!this.focused) {
                    this.asElement().dispatchEvent(new FocusEvent('blur'));
                    this.firstTimeFocused = false;
                }
            }, 200);
        });
        this.asElement().addEventListener('focusin', ev => {
            if (!this.firstTimeFocused) {
                this.asElement().dispatchEvent(new FocusEvent('focus'));
            }
            this.focused = true;
            this.firstTimeFocused = true;
        });
    }
}

