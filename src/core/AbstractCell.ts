import {IsElement} from './corecls/IsElement';
import {CellView} from './corecls/CellView';
import {AbstractCellComponent} from './AbstractCellComponent';
import {ComponentUi} from './corecls/View';
import {CellConfig} from './CellConfig';

export abstract class AbstractCell<P, M, CW extends CellView> implements IsElement<any> {
    protected model: P;
    protected value: M;

    protected owner: AbstractCellComponent<P, M, any>;

    protected cellConfig: CellConfig<P, M>;

    protected cellView: CW;

    constructor(cellView?: CW) {
        this.cellView = cellView;
    }

    public getModel(): P {
        return this.model;
    }

    setModel(model: P): void {
        this.model = model;
    }

    public getValue(): M {
        return this.value;
    }

    public getOwner(): AbstractCellComponent<any, any, any> {
        return this.owner;
    }

    setOwner(owner: AbstractCellComponent<any, any, any>) {
        this.owner = owner;
        if (this.cellView == null)
            this.initViewFromOwner();
    }

    protected initViewFromOwner() {
    }

    protected getCellView(): CW {
        return this.cellView;
    }

    public abstract draw(): void;

    /**
     * this method is called after all cell fields are initialised by the owner widget
     */
    bind() {
    }

    removeFromParent() {
        this.cellView.asElement().remove();
    }

    /**
     *
     * @return {HTMLElement}
     */
    public asElement(): HTMLElement {
        return this.cellView.asElement();
    }

    protected getUi(): ComponentUi<any> {
        return this.getOwner().getView();
    }

    static getUi(component: AbstractCellComponent<any, any, any>): ComponentUi<any> {
        return component.getView();
    }

    public setCellConfig(cellConfig: CellConfig<P, M>) {
        this.cellConfig = cellConfig;
    }

    public getCellConfig(): CellConfig<P, M> {
        return this.cellConfig;
    }

}