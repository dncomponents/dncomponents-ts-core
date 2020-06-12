/**
 * Created by nikolasavic
 */
import {AbstractAutocomplete} from './AbstractAutocomplete';
import {MainRenderer, MainViewSlots} from '../BaseComponent';
import {java} from 'j4ts';
import {AutocompleteMultiSelectItem} from './AutocompleteMultiSelectItem';
import {ValueChangeHandler} from '../corecls/ValueClasses';
import {AutocompleteMultiSelectView} from './views/AutocompleteMultiSelectView';
import ArrayList = java.util.ArrayList;
import List = java.util.List;


export abstract class AbstractAutocompleteMultiSelect<T, C> extends AbstractAutocomplete<T, AutocompleteMultiSelectView<T>, C> {

    itemRenderer: MainRenderer<T> = new class implements MainRenderer<T> {
        render(userObject: T, view: MainViewSlots): void {
            view.getMainSlot().innerHTML = userObject + '';
        }
    };
    protected items = new ArrayList<AutocompleteMultiSelectItem<any>>();

    public setItemRenderer(itemRenderer: MainRenderer<T>): void {
        this.itemRenderer = itemRenderer;
    }

    remove(item: AutocompleteMultiSelectItem<any>): void {
        this.view.getSelectionModel().setSelected(item.getUserObject(), false, true);
    }

    protected constructor(view: AutocompleteMultiSelectView<T>);
    protected constructor(view: AutocompleteMultiSelectView<T>, fieldGetter?: (p1: T) => string);
    protected constructor(view: AutocompleteMultiSelectView<T>, fieldGetter?: (p1: T) => string) {
        super(view, fieldGetter);
        this.init();
    }

    private init(): void {
        this.addValueChangeHandler(ValueChangeHandler.onValueChange(evt => this.showList(false)));
        this.view.getSelectionModel().getHasValue().addValueChangeHandler(ValueChangeHandler.onValueChange(evt => {
            this.changed(evt.value);
            this.showList(true);
        }));
    }

    protected isMultiSelect(): boolean {
        return true;
    }

    public setValue(value: C, fireEvents?: boolean): void {
        super.setValue(value, fireEvents);
        if (value == null)
            this.changed(null);
    }

    protected changed(value: List<T>): void {
        this.view.clearItems();
        if (value != null) {
            for (let t of value.toArray()) {
                let item = new AutocompleteMultiSelectItem(this, t);
                this.view.addItem(item);
            }
        } else {
            this.view.clearItems();
        }
    }

    getView(): AutocompleteMultiSelectView<T> {
        return super.getView();
    }

}