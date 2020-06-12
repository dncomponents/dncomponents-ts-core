import {BaseComponent, MainRenderer, MainViewSlots} from '../BaseComponent';
import {AbstractAutocompleteMultiSelect} from './AbstractAutocompleteMultiSelect';
import {ClickHandler} from '../corecls/handlers';
import {AutocompleteMultiSelectItemView} from './views/AutocompleteMultiSelectItemView';

export class AutocompleteMultiSelectItem<T> extends BaseComponent<T, AutocompleteMultiSelectItemView> {

    protected multiSelect: AbstractAutocompleteMultiSelect<any, any>;

    public constructor(multiSelect: AbstractAutocompleteMultiSelect<any, any>, value: T) {
        super(multiSelect.getView().getAutocompleteMultiSelectItemView());
        this.multiSelect = multiSelect;
        this.setRenderer(multiSelect.itemRenderer);
        this.setUserObject(value);
        this.init();
    }

    private init() {
        this.view.addRemoveClickHandler(ClickHandler.onClick(evt => this.multiSelect.remove(this)));
    }

    public setRenderer(renderer: MainRenderer<T>) {
        super.setRendererBase(renderer);
    }

    public getViewSlots(): MainViewSlots {
        return <MainViewSlots><any>super.getViewSlots();
    }
}