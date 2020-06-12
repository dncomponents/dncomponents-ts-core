import {ListCell} from './ListCell';
import {ValueChangeHandler} from '../corecls/ValueClasses';
import {ListCellCheckBoxView} from './ListUi';
import {ListData} from './ListData';

export class ListCellCheckbox<T, M> extends ListCell<T, M> {

    constructor()
    constructor(view: ListCellCheckBoxView) ;
    constructor(view?: ListCellCheckBoxView) {
        super(view);
    }

    bind() {
        super.bind();
        this.getCellView().getCheckbox().addValueChangeHandler(ValueChangeHandler.onValueChange<boolean>(evt => {
            this.getOwner().getSelectionModel()
                .setSelected(this.getModel(), evt.value, true);

        }));
        (<ListData<T, M>>this.getOwner()).getSelectionModel().removeNavigator();
    }


    public getCellView(): ListCellCheckBoxView {
        return <ListCellCheckBoxView><any>super.getCellView();
    }

    initViewFromOwner() {
        this.cellView = this.getUi().getListCheckBoxView();
    }
}