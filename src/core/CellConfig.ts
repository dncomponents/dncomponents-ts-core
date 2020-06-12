import {CellFactory} from './corecls/CellFactory';
import {BaseCellBuilder} from './BaseCell';

export class CellConfig<T, M> {

    protected fieldGetter: (p1: T) => M;
    protected fieldSetter: (p1: T, p2: M) => void;

    protected cellFactory: CellFactory<T, M, any>;

    private clazz: string;


    public getFieldSetter(): (p1: T, p2: M) => void {
        return <any>(this.fieldSetter);
    }

    public setFieldSetter(fieldSetter: (p1: T, p2: M) => void): CellConfig<T, M> {
        this.fieldSetter = <any>(fieldSetter);
        return this;
    }

    public getCellFactory(): CellFactory<T, M, any> {
        if (this.cellFactory == null)
            throw new DOMException('Cell Factory is not defined!');
        return <any>this.cellFactory;
    }

    public setCellFactory<C extends CellConfig<T, M>>(cellFactory: CellFactory<T, M, any>): C {
        this.cellFactory = cellFactory;
        return <C><any>this;
    }

    public getFieldGetter(): (p1: T) => M {
        return this.fieldGetter;
    }

    public setFieldGetter(fieldGetter: (p1: T) => M): CellConfig<T, M> {
        this.fieldGetter = fieldGetter;
        return this;
    }

    public setClazz<C extends CellConfig<T, M>>(clazz: string): C {
        this.clazz = clazz;
        return <C><any>this;
    }

    public getClazz(): string {
        return this.clazz;
    }

    builder: BaseCellBuilder<T, M, any>;

    public getCellBuilder(): BaseCellBuilder<T, M, any> {
        return this.builder;
    }

}