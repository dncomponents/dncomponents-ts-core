import {IsElement} from '../corecls/IsElement';
import {Presenter} from './Presenter';
import {HasPresenter} from './HasPresenter';

export abstract class AbstractView<P extends Presenter> implements IsElement<any>, HasPresenter<P> {

    presenter: P;

    public setPresenter(presenter: P) {
        this.presenter = presenter;
    }

    public abstract asElement(): any;

}
