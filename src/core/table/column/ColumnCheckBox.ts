import {ColumnConfig} from '../TableUtil';
import {HeaderTableCheckBoxCell} from './HeaderTableCheckBoxCell';
import {TableCellCheckBox} from './TableCellCheckBox';

export class ColumnCheckBox<T> extends ColumnConfig<T, boolean> {
    public constructor() {
        super();
        this.setFieldGetter(p1 => true);
        this.setColumnWidth('25px');
        this.setHeaderCellFactory({getCell: () => new HeaderTableCheckBoxCell()});
        this.setCellFactory({getCell: (c) => new TableCellCheckBox()});
    }
}
