import {AbstractActivity} from './AbstractActivity';

export class Place {
    placeRegister: PlaceRegister<any>;

    public equals(o: any): boolean {
        if (this === o) return true;
        if (o == null || (<any>this.constructor) !== (<any>o.constructor)) return false;
        return true;
    }

    constructor() {
        if (this.placeRegister === undefined) this.placeRegister = null;
    }
}


export abstract class PlaceRegister<T extends Place> {
    public static DIVIDER: string = ':';

    public abstract getHistoryToken(): string;

    public abstract getPlaceFromToken(token: string): T;

    public abstract getTokenFromPlace(place: T): string;

    public abstract getActivity(place: T): AbstractActivity<any, any>;

    public abstract forPlace(): string;

    constructor() {
    }
}

 
