import {AbstractActivity} from './AbstractActivity';
import {IsElement} from '../corecls/IsElement';
import {Place} from './Place';

export class DefaultActivity extends AbstractActivity<any, any> {
    public constructor(view: IsElement<any>, place: Place) {
        super(view, place);
    }

    onStart() {
        this.mainApp.setElement(this.view);
    }
}
 
