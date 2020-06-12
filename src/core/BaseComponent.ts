import {View} from './corecls/View';
import {IsElement} from './corecls/IsElement';
import {EventHandler, HandlerRegistration, HasHandlers} from './corecls/events';
import {Ui} from './views/Ui';

export abstract class BaseComponent<T, V extends View> implements IsElement<HTMLElement>, HasHandlers, HasUserValue<T> {

    protected view: V;
    protected userObject: T;
    protected renderer: Renderer<T, any>;
    protected viewSlots: ViewSlots;

    protected getViewSlots(): ViewSlots {
        if ('getViewSlots' in this.view) {
            var v = (<HasViewSlots<any>><unknown>this.view);
            this.viewSlots = v.getViewSlots();
        }
        return this.viewSlots;
    }

    public static allComponents = new WeakMap();

    public static source<T extends BaseComponent<any, any>>(event: Event): T {
        return <T>this.allComponents.get(event.target);
    }


    asElement(): HTMLElement {
        return this.view.asElement();
    }

    constructor(view: V) {
        // super();
        if (view == null)
            throw new DOMException('View can\'t be null! Please check view initialisation.');
        this.view = view;
        let viewElement = this.view.asElement();
        if (viewElement == null)
            throw new DOMException('View ' + view.constructor.name + ' root element is null. Please check if you properly bind elements!');
        BaseComponent.allComponents.set(viewElement, this);
        if (Ui.isDebug()) {
            viewElement.setAttribute('component-class', this.constructor.name);
            viewElement.setAttribute('view-class', this.view.constructor.name);
        }

    }

    protected render(): void {
        if (this.renderer != null) {
            // initUserRenderView();
            this.renderer.render(this.userObject, this.getViewSlots());
        }
    }

    protected setRendererBase(renderer: Renderer<T, any>): void {
        this.renderer = renderer;
    }

    addHandler(handler: EventHandler<any>): HandlerRegistration {
        return handler.addTo(this.asElement());
    }

    fireEvent(event: CustomEvent<any>): void {
        this.asElement().dispatchEvent(event);
    }

    setView(view: V): void {
        this.view = view;
    }

    protected getView(): V {
        return this.view;
    }

    getUserObject(): T {
        return this.userObject;
    }

    setUserObject(t: T): void {
        this.userObject = t;
        this.render();
    }

}

export interface Renderer<T, R extends ViewSlots> {
    render(userObject: T, view: R): void;
}

export interface MainRenderer<T> extends Renderer<T, MainViewSlots> {
}

export class MainRendererImpl<T> implements MainRenderer<T> {
    render(userObject: T, view: MainViewSlots): void {
        view.getMainSlot().innerHTML = userObject + '';
    }
}

export interface HasUserValue<T> {
    getUserObject(): T;

    setUserObject(t: T): void;
}

export interface Command {
    execute(): void;
}

export interface ViewSlots {
}

export interface HasViewSlots<R extends ViewSlots> {
    getViewSlots(): R;
}

export interface MainViewSlots extends ViewSlots {
    getMainSlot(): HTMLElement;
}

export class MainViewSlotsImpl implements MainViewSlots {
    mainPanel: HTMLElement;

    constructor(mainPanel: HTMLElement) {
        this.mainPanel = mainPanel;
    }

    getMainSlot(): HTMLElement {
        return this.mainPanel;
    }

}

export interface HasMainViewSlots extends HasViewSlots<MainViewSlots> {
}

export interface MainRenderer<T> extends Renderer<T, MainViewSlots> {
}