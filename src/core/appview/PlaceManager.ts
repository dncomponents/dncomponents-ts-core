import {Place, PlaceRegister} from './Place';
import {ValueChangeEvent, ValueChangeHandler} from '../corecls/ValueClasses';
import {java} from 'j4ts';
import {HasPlaceChangeHandler} from './HasPlaceChangeHandler';
import {AbstractActivity} from './AbstractActivity';
import {AcceptsOneElement} from './AcceptsOneElement';
import {History} from './History';
import {Util} from '../corecls/Util';
import {HandlerRegistration} from '../corecls/events';

export class PlaceManager implements HasPlaceChangeHandler {

    private placeRegisterMap: java.util.Map<string, PlaceRegister<any>> = new java.util.HashMap<string, any>();
    private tokenRegisterMap: java.util.Map<string, PlaceRegister<any>> = new java.util.HashMap<string, any>();
    private homePlace: any;
    private mainApp: AcceptsOneElement;
    private currentActivity: AbstractActivity<any, any>;
    private currentPlace: Place;

    private bus: HTMLElement;

    public constructor(mainApp: AcceptsOneElement) {
        this.mainApp = mainApp;

        History.addValueChangeHandler((s: string) => {
            let token: string = s;
            if (token == null)
                return;
            let filteredToken: string = token;
            if (token.indexOf(PlaceRegister.DIVIDER) != -1)
                filteredToken = token.substring(0, token.indexOf(PlaceRegister.DIVIDER));
            let placeRegister: PlaceRegister<any>;
            if ((token.length === 0) && this.homePlace != null) {
                placeRegister = this.tokenRegisterMap.get(this.homePlace);
                History.newItem(placeRegister.getHistoryToken(), false);
            } else
                placeRegister = this.placeRegisterMap.get(filteredToken);
            if (placeRegister == null)
                return;
            let place: Place = placeRegister.getPlaceFromToken(token);
            this.setPlace(place, true);
            if (this.currentActivity != null && !this.currentActivity.onStop())
                return;
            let activity: AbstractActivity<any, any> = placeRegister.getActivity(place);
            activity.setPlaceManager(this);
            activity.setMainApp(this.getMainApp());
            activity.onStart();
            this.currentActivity = activity;
        });
    }

    public register(placeRegister: PlaceRegister<any>) {
        this.placeRegisterMap.put(placeRegister.getHistoryToken(), placeRegister);
        this.tokenRegisterMap.put(placeRegister.forPlace(), placeRegister);
    }

    public getMainApp(): AcceptsOneElement {
        return this.mainApp;
    }

    public setHomePlace(homePlace: any) {
        this.homePlace = homePlace;
    }

    public getCurrentPlace(): Place {
        return this.currentPlace;
    }

    public addValueChangeHandler(handler: ValueChangeHandler<Place>): HandlerRegistration {
        return handler.addTo(this.ensureHandlers());
    }

    public goTo(place: Place, fireEvent: boolean) {
        let placeRegister: PlaceRegister<any> = this.tokenRegisterMap.get(place.constructor);
        if (this.currentActivity != null && !this.currentActivity.onStop())
            return;
        let activity: AbstractActivity<any, any> = placeRegister.getActivity(place);
        activity.setMainApp(this.getMainApp());
        activity.onStart();
        this.currentActivity = activity;
        History.newItem(placeRegister.getTokenFromPlace(place), false);
        this.setPlace(place, fireEvent);
    }


    private setPlace(place: Place, fireEvent: boolean) {
        let oldValue: Place = this.getCurrentPlace();
        this.currentPlace = place;
        if (fireEvent) {
            let newValue: Place = this.getCurrentPlace();
            ValueChangeEvent.fireIfNotEqual<any>(this, oldValue, newValue);
        }
    }

    ensureHandlers(): HTMLElement {
        if (this.bus == null)
            this.bus = Util.createDiv();
        return this.bus;
    }

    public getHistoryToken(place: Place): string {
        let placeRegister: PlaceRegister<any> = this.tokenRegisterMap.get((<any>place.constructor.name));
        let historyToken: string = placeRegister.getTokenFromPlace(place);
        return historyToken;
    }

    public fireEvent(event: CustomEvent) {
        this.ensureHandlers().dispatchEvent(event);
    }

    gotoPlace(place: Place) {
        this.goTo(place, false);
    }

}