import {IsElement} from './IsElement';

export interface View extends IsElement<HTMLElement> {

}

/**
 * Factory interface produces all needed views for component.
 * {@link ComponentUi#getRootView} produce root view for owner component.
 * All other interface methods should create new view instances. (not reference local or static views)
 * <p>
 * Used when component creates sub-elements.
 *
 * @author nikolasavic
 */
export interface ComponentUi<T extends View> extends View {
    getRootView(): T;


    // default  asElement():HTMLElement {
    //      return this.getRootView().asElement();
    //  }
}

export abstract class ComponentUiAbstract<T extends View> implements ComponentUi<T> {
    abstract getRootView(): T;

    asElement(): HTMLElement {
        return this.getRootView().asElement();
    }
}