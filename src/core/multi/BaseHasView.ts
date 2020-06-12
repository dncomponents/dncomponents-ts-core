import {HasViewSlots, Renderer, ViewSlots} from '../BaseComponent';
import {View} from '../corecls/View';
import {IsElement} from '../corecls/IsElement';

export abstract class BaseHasView<T, V extends View> implements IsElement<any> {

    renderer: Renderer<any, any>;

    value: T;

    view: V;

    viewSlots: ViewSlots;

    public constructor(view: V) {
        this.view = view;
    }

    public asElement(): HTMLElement {
        return this.view.asElement();
    }

    getView(): V {
        return this.view;
    }

    setRendererBase(renderer: Renderer<any, any>) {
        this.renderer = renderer;
    }

    public getValue(): T {
        return this.value;
    }

    public setValue(value: T) {
        this.value = value;
        this.render();
    }

    render() {
        if (this.renderer != null) {
            this.renderer.render(this.value, this.getViewSlots());
        }
    }

    getViewSlots(): ViewSlots {
        if ('getViewSlots' in this.view)
            this.viewSlots = (<HasViewSlots<any>><unknown>this.view).getViewSlots();
        return this.viewSlots;
    }
}


