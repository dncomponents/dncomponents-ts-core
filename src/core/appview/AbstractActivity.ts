import {IsElement} from '../corecls/IsElement';
import {Place} from './Place';
import {Presenter} from './Presenter';
import {PlaceManager} from './PlaceManager';
import {AcceptsOneElement} from './AcceptsOneElement';
import {HasPresenter} from './HasPresenter';

export abstract class AbstractActivity<V extends IsElement<any>, P extends Place> implements Presenter {
    protected view: V;
    protected place: P;
    protected placeManager: PlaceManager;
    protected mainApp: AcceptsOneElement;

    public constructor(view: V, place: P) {
        this.view = view;
        this.place = place;
        if ('setPresenter' in view) {
            (<HasPresenter<any>><unknown>view).setPresenter(this);
        }
    }

    onStart() {
        this.mainApp.setElement(this.view);
    }

    /**
     * @return {boolean} true to continue or false to stop
     */
    onStop(): boolean {
        return true;
    }

    getMainApp(): AcceptsOneElement {
        return this.mainApp;
    }

    setMainApp(mainApp: AcceptsOneElement) {
        this.mainApp = mainApp;
    }

    setPlaceManager(placeManager: PlaceManager) {
        this.placeManager = placeManager;
    }
}