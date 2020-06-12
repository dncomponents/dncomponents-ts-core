import {CellFactory} from './CellFactory';
import {BaseCell} from '../BaseCell';
import {CellConfig} from '../CellConfig';
import {AbstractCellComponent} from '../AbstractCellComponent';

export class CellContext<T, M, C extends AbstractCellComponent<T, any, any>> {

    constructor(cellConfig: CellConfig<T, M>, defaultCellFactory: CellFactory<T, M, C>, model: T, owner: C) {
        this.defaultCellFactory = defaultCellFactory;
        this.cellConfig = cellConfig;
        this.model = model;
        this.owner = owner;
    }

    cellConfig: CellConfig<T, M>;
    public defaultCellFactory: CellFactory<T, M, C>;
    public model: T;
    public owner: C;

    public value(): M {
        return this.cellConfig.getFieldGetter()(this.model);
    }

    public createDefaultCell<B extends BaseCell<T, M>>(): B {
        return <B>this.defaultCellFactory.getCell(this);
    }
}

