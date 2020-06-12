import {BaseCellView} from '../corecls/BaseCellView';
import {BaseCell, BaseCellBuilder} from '../BaseCell';
import {ListUi} from './ListUi';

export class ListCell<T, M> extends BaseCell<T, M> {

    constructor();
    constructor(cellView?: BaseCellView);
    constructor(cellView?: BaseCellView) {
        super(cellView);
    }

    initViewFromOwner() {
        this.cellView = this.getUi().getListCellView();
    }

    getUi(): ListUi {
        return <ListUi><any>super.getUi();
    }

    setCellBuilder(builder: ListCell.Builder<T, M>): ListCell<T, M> {
        this.initWithBuilder(builder);
        return this;
    }

}

export namespace ListCell {
    export class Builder<T, M> extends BaseCellBuilder<T, M, Builder<T, M>> {

        public build(): ListCell<T, M> {
            return new ListCell<T, M>().setCellBuilder(this);
        }
    }

}