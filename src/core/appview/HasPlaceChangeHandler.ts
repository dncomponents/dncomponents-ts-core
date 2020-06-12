import {HandlerRegistration} from '../corecls/events';
import {Place} from './Place';
import {HasValueChangeHandlers, ValueChangeHandler} from '../corecls/ValueClasses';

export interface HasPlaceChangeHandler extends HasValueChangeHandlers<Place> {
    addValueChangeHandler(handler: ValueChangeHandler<Place>): HandlerRegistration;

    goTo(place: Place, fireEvent: boolean): void;
}