import {AbstractCellComponent} from '../../AbstractCellComponent';
import {TableCell} from '../TableUtil';
import {KeyDownHandler, SelectionHandler} from '../../corecls/handlers';
import {TableCellCheckBoxView} from '../views/TableUi';
import {ValueChangeHandler} from '../../corecls/ValueClasses';

export class TableCellCheckBox extends TableCell<any, any> {

    public constructor() {
        super();
    }

    setOwner(owner: AbstractCellComponent<any, any, any>) {
        super.setOwner(owner);
        // this.getOwner().getSelectionModel().setNavigator(false);
    }

    bind() {
        super.bind();
        this.getCellView()
            .getCheckbox()
            .addValueChangeHandler(ValueChangeHandler.onValueChange(evt => {
                this.getOwner().getSelectionModel().setSelected(this.getModel(), evt.value, true);
            }));
        this.getCellView().addKeyDownHandler(KeyDownHandler.onKeyDown(evt => {
            if (evt.key === ('space')) {
                this.getCellView().getCheckbox().setValue(!this.getCellView().getCheckbox().getValue(), true);
            }
        }));
        this.getOwner().getSelectionModel().addSelectionHandler(SelectionHandler.onSelection(evt => {
            this.draw();
        }));
    }

    public draw() {
        this.getCellView().getCheckbox().setValue(this.getOwner().getSelectionModel().isSelected(this.getModel()), false);
    }

    setSelection() {
        this.setSelectionBase();
    }

    public getCellView(): TableCellCheckBoxView {
        return <TableCellCheckBoxView><any>super.getCellView();
    }

    initViewFromOwner() {
        this.cellView = this.getUi().getTableCellCheckBoxView();
    }
}
