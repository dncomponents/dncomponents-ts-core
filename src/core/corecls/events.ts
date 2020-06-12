export abstract class AbstractCustomEvent<T> extends CustomEvent<T> {
    constructor(name: string) {
        super(name);
    }
}


export abstract class EventHandler<E extends Event> {

    abstract getType(): string;

    public fn = (evt: E) => {
        return this.handleEvent(evt);
    };

    public abstract handleEvent(evt: E): void;

    public addTo(el: EventTarget): HandlerRegistration {
        el.addEventListener(this.getType(), this.fn);
        let self = this;
        return new class implements HandlerRegistration {
            removeHandler(): void {
                el.removeEventListener(self.getType(), self.fn);
            }
        };
    }
}

export interface HasHandlers {
    fireEvent(event: CustomEvent): void;
}

export interface HandlerRegistration {
    removeHandler(): void;
}

export interface IsEvent {
    asEvent(): CustomEvent;
}

export abstract class BaseEvent implements IsEvent {
    protected customEvent: CustomEvent;

    constructor(type: string) {
        this.customEvent = new CustomEvent(type);
        this.customEvent.initCustomEvent(type, true, true, this);
    }

    public asEvent(): CustomEvent {
        return this.customEvent;
    }
}