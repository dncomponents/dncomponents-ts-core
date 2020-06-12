import {HeaderTableTextCell} from '../TableUtil';
import {CheckBoxHeaderTableCellView} from '../views/TableUi';
import {ValueChangeHandler} from '../../corecls/ValueClasses';
import {SelectionHandler} from '../../corecls/handlers';

export class HeaderTableCheckBoxCell extends HeaderTableTextCell {
    public constructor(view?: CheckBoxHeaderTableCellView) {
        super(view);
    }


    bind() {
        this.getCellView().getCheckBox().addValueChangeHandler(
            ValueChangeHandler.onValueChange(evt => this.getOwner().getSelectionModel().selectAll(evt.value, true)));
        this.getOwner().getSelectionModel().addSelectionHandler(SelectionHandler.onSelection(() => this.draw()));
    }

    public draw() {
        this.getCellView().getCheckBox().setValue(this.getOwner().getSelectionModel().isAllSelected(), false);
    }


    getCellView(): CheckBoxHeaderTableCellView {
        return <CheckBoxHeaderTableCellView><any>super.getCellView();
    }

    initViewFromOwner() {
        this.cellView = this.getUi().getCheckBoxHeaderCellView();
    }
}
