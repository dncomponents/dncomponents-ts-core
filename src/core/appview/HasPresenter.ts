import {Presenter} from './Presenter';

export interface HasPresenter<P extends Presenter> {
    setPresenter(presenter: P): void;
}
