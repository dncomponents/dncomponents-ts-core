import {ComponentsViews} from './ComponentsViews';

export class Ui {

    static debug: boolean;

    private static _implementation: ComponentsViews;

    public static get(): ComponentsViews {
        return this._implementation;
    }

    public static setDebug(debug: boolean): void {
        Ui.debug = debug;
    }

    public static get implementation(): ComponentsViews {
        return this._implementation;
    }

    public static set implementation(value: ComponentsViews) {
        this._implementation = value;
    }

    static isDebug(): boolean {
        return this.debug;
    }

}