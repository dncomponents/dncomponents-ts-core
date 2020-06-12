import {AbstractCellComponent} from '../AbstractCellComponent';
import {PagerUi, PagerView, PagerViewPresenter} from './views/TableUi';
import {BaseComponent} from '../BaseComponent';
import {Ui} from '../views/Ui';

export class Pager<V extends PagerView> extends BaseComponent<any, PagerUi<V>> implements PagerViewPresenter {
    static DEFAULT_VISIBLE_NUMBER: number = 20;

    rowSize: number = 0;
    numberOfPages: number = 0;
    currentPage: number = 0;
    from: number = 0;
    to: number = 0;
    owner: AbstractCellComponent<any, any, any>;
    visibleRowNumber: number = Pager.DEFAULT_VISIBLE_NUMBER;

    constructor(ui?: PagerUi<any>) {
        super(ui ? ui : Ui.get().getPagerUi());
        this.view.getRootView().setPresenter(this);
    }

    calculate() {
        this.numberOfPages = Math.ceil(<number>this.rowSize / this.visibleRowNumber);
        if (this.currentPage >= this.numberOfPages || this.currentPage < 0) this.currentPage = 0;
        this.from = this.currentPage * this.visibleRowNumber;
        if (this.currentPage === this.numberOfPages - 1 || this.numberOfPages === 0) {
            this.to = this.from + (this.rowSize - this.from);
        } else {
            this.to = this.from + this.visibleRowNumber;
        }
    }

    public setCurrentPage(page: number) {
        if (page < 0 || page >= this.numberOfPages) return;
        let update: boolean = page !== this.currentPage;
        this.currentPage = page;
        if (update) {
            this.calculate();
            this.updateView();
            this.owner.drawData();
        }
    }

    public setCurrentPageNoUpdate(page: number) {
        if (page < 0 || page >= this.numberOfPages) return;
        this.currentPage = page;
        this.calculate();
    }

    updateView() {
        this.view.getRootView().setPageNumber(this.currentPage);
        this.view.getRootView().enableNext(this.hasNext());
        this.view.getRootView().enablePrevious(this.hasPrevious());
        this.view.getRootView().setText(this.from + ' - ' + this.to + ' of ' + this.rowSize + ' items');
    }

    public getPageFromIndex(index: number): number {
        if (index > this.rowSize)
            return Math.floor(this.rowSize / this.visibleRowNumber);
        else if (index < 0) return 0;
        else
            return Math.floor(index / this.visibleRowNumber);
    }

    public setPageFromIndex(index: number) {
        let page: number = this.getPageFromIndex(index);
        if (page !== this.currentPage) this.setCurrentPage(page);
    }

    public isPageBound(index: number): boolean {
        return (index % this.visibleRowNumber === 0 && index !== 0);
    }

    public getVisibleRowNumber(): number {
        return this.visibleRowNumber;
    }

    public setVisibleRowNumber(visibleRowNumber: number) {
        this.visibleRowNumber = visibleRowNumber;
    }

    public getNumberOfPages(): number {
        return this.numberOfPages;
    }

    public hasNext(): boolean {
        return this.currentPage + 1 < this.numberOfPages;
    }

    public hasPrevious(): boolean {
        return this.currentPage > 0;
    }

    public next() {
        if (this.hasNext()) this.setCurrentPage(this.currentPage + 1);
    }

    public nextNoUpdate() {
        if (this.hasNext()) this.setCurrentPageNoUpdate(this.currentPage + 1);
    }

    public previous() {
        if (this.hasPrevious()) this.setCurrentPage(this.currentPage - 1);
    }

    public first() {
        this.setCurrentPage(0);
    }

    public last() {
        this.setCurrentPage(this.numberOfPages - 1);
    }

    public getFrom(): number {
        return this.from;
    }

    public getTo(): number {
        return this.to;
    }

    public recalculate() {
        this.rowSize = this.owner.getRowsFiltered().size();
        this.calculate();
        this.updateView();
    }

    public setOwner(owner: AbstractCellComponent<any, any, any>) {
        this.owner = owner;
    }

    getView(): PagerUi<any> {
        return super.getView();
    }
}
