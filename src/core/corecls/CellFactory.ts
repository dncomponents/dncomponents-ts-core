import {CellContext} from './CellContext';
import {BaseCell} from '../BaseCell';
import {AbstractCellComponent} from '../AbstractCellComponent';

export interface CellFactory<T, M, C extends AbstractCellComponent<T, any, any>> {
    getCell(c: CellContext<T, M, C>): BaseCell<T, M>;
}
