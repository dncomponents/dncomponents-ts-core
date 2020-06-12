import {HasPredicate, Predicate} from '../AbstractCellComponent';
import {Util} from './Util';
import {FilterEvent, FilterHandler, HasFilterHandlers} from './handlers';
import {HandlerRegistration} from './events';

export abstract class Filter<T> implements HasPredicate<T>, HasFilterHandlers<T> {

    private bus: HTMLElement;

    public fireEvent(event: CustomEvent): void {
        this.ensureHandlers().dispatchEvent(event);
    }

    public fireFilterChange(): void {
        this.fireEvent((new FilterEvent(this)));
    }

    addFilterHandler(handler: FilterHandler<T>): HandlerRegistration {
        return handler.addTo(this.ensureHandlers());
    }

    abstract compare(): Predicate<T> ;

    ensureHandlers(): HTMLElement {
        if (this.bus == null)
            this.bus = Util.createDiv();
        return this.bus;
    }

}

