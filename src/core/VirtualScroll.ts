import {AbstractCellComponent} from './AbstractCellComponent';
import {java} from 'j4ts';
import {HandlerRegistration} from './corecls/events';
import {Util} from './corecls/Util';
import {ScrollView} from './corecls/ui/list/ScrollView';
import {ScrollHandler} from './corecls/handlers';

/**
 * Support for virtual scrolling.
 * Its purpose is to show large number of rows smoothly
 * without affecting browser performance.
 * It is turned on by default on all components that are using this class.
 * It is highly recommended to keep it turned on.
 *
 * @author nikolasavic
 * @param {AbstractCellComponent} owner
 * @param {*} scrollView
 * @class
 */
export class VirtualScroll {
    static BLOCK_SIZE: number = 20;

    static ROW_SIZE_SCROLL_STARTS: number = 200;

    owner: AbstractCellComponent<any, any, any>;

    /**
     * defines number of rows after virtual scroll is turned on
     */
    scrollStarts: number = VirtualScroll.ROW_SIZE_SCROLL_STARTS;

    VISIBLE_BLOCK: number = 4;

    blockRowsSize: number = VirtualScroll.BLOCK_SIZE;

    rowHeight: number;

    rows: number;

    topScroll: number = 11;

    currentBlock: number;

    blockHeight: number;

    lastBlockHeight: number;

    totalHeight: number;


    private evenHeight: number;

    totalNumberOfBlocks: number;

    private blockEvenPercent: number;

    private view: ScrollView;

    private enabled: boolean = true;

    topElement: HTMLElement;

    bottomElement: HTMLElement;

    private oldBlocks: java.util.List<number> = <any>(new java.util.ArrayList<any>());

    blocks: java.util.List<number> = <any>(new java.util.ArrayList<any>());

    topHeight: number = 0;

    bottomHeight: number;

    private scrollHandlerRegistration: HandlerRegistration;

    public constructor(owner: AbstractCellComponent<any, any, any>, scrollView: ScrollView) {
        this.owner = owner;
        this.view = scrollView;
        this.rowHeight = this.view.getRowHeight();
        this.topHeight = 0;
        this.rows = 0;
        this.topScroll = 11;
        this.currentBlock = 0;
        this.blockHeight = 0;
        this.lastBlockHeight = 0;
        this.evenHeight = 0;
        this.totalNumberOfBlocks = 0;
        this.blockEvenPercent = 0;
        this.bottomHeight = 0;
        this.init();
    }

    init() {
        this.setRowsSize();
        this.calculateAll();
        this.addScrollHandler();
    }

    addScrollHandler() {
        let self = this;
        this.scrollHandlerRegistration = this.view.addScrollHandler(new class extends ScrollHandler {
            onScroll(evt: Event): void {
                if (self.enabled && self.isRowsStart())
                    self.setTopScroll(self.view.getScrollTop());
            }
        });
    }

    calculateTotalHeight() {
        this.totalHeight = this.rows * this.rowHeight;
    }

    calculateBlockHeight() {
        this.blockHeight = this.blockRowsSize * this.rowHeight;
    }

    calculateNumberOfBlocks() {
        this.totalNumberOfBlocks = /* intValue */(<number>new Number((this.rows / this.blockRowsSize | 0)) | 0);
        this.evenHeight = this.totalNumberOfBlocks * this.blockHeight;
        if (this.evenHeight !== 0) this.blockEvenPercent = (<number>this.blockHeight / this.evenHeight);
    }

    calculateLastBlockHeight() {
        let rest: number = this.rows - (this.totalNumberOfBlocks * this.blockRowsSize);
        this.lastBlockHeight = rest * this.rowHeight;
    }

    calculateCurrentBlock() {
        if (this.evenHeight !== 0 && this.blockEvenPercent !== 0) this.currentBlock = (<number>((<number>this.topScroll / this.evenHeight) / this.blockEvenPercent) | 0);
    }

    initTopBottomElements() {
        this.topElement = this.view.createEmptyRow();
        this.bottomElement = this.view.createEmptyRow();
    }

    setHeight(el: HTMLElement, height: number) {
        Util.setHeight(el, height + 'px');
    }

    updateView() {
        this.view.clear();
        this.initTopBottomElements();
        this.view.addItem(this.topElement);
        this.calculateTopBottomHeights();
        this.setHeight(this.topElement, this.topHeight);
        this.setHeight(this.bottomElement, this.bottomHeight);
        for (let index167 = this.blocks.iterator(); index167.hasNext();) {
            let block = index167.next();
            {
                let range: Range = this.getRangeFromBlock(block);
                for (let i: number = range.from; i < range.to; i++) {
                    this.owner.createAndInitModelRowCell(this.owner.rowsFiltered.get(i));
                }
            }
        }
        this.owner.newBlock();
        this.view.addItem(this.bottomElement);
        this.oldBlocks = this.copy(this.blocks);
    }

    calculateAll() {
        this.calculateTotalHeight();
        this.calculateBlockHeight();
        this.calculateNumberOfBlocks();
        this.calculateCurrentBlock();
        this.calculateVisibleBlocks();
        this.calculateLastBlockHeight();
        this.calculateTopBottomHeights();
    }

    setRowsSize() {
        this.rows = this.owner.rowsFiltered.size();
    }

    copy(list: java.util.List<number>): java.util.List<number> {
        let copy: java.util.List<number> = <any>(new java.util.ArrayList<any>());
        for (let index168 = list.iterator(); index168.hasNext();) {
            let i = index168.next();
            copy.add(i);
        }
        return copy;
    }

    isRowsStart(): boolean {
        return this.rows > this.scrollStarts;
    }

    isSame(list1: java.util.List<number>, list2: java.util.List<number>): boolean {
        for (let i: number = 0; i < list1.size(); i++) {
            if (list1.get(i) !== list2.get(i))
                return false;
        }
        return true;
    }

    public getRangeFromBlock(block: number): Range {
        let from: number = block * this.blockRowsSize;
        let sum: number = from + this.blockRowsSize;
        let to: number = sum > this.rows ? this.rows : sum;
        return new Range(this, from, to);
    }

    public isEnabled(): boolean {
        return this.enabled;
    }

    public setEnabled(enabled: boolean) {
        this.enabled = enabled;
    }

    public setTopScroll(topScroll: number) {
        if (topScroll < 0 || topScroll > this.totalHeight) console.log('error: Top scroll must be in range: ' + 0 + ' - ' + this.totalHeight);
        this.rows = this.owner.rowsFiltered.size();
        this.topScroll = topScroll;
        let oldBlock: number = this.currentBlock;
        this.calculateCurrentBlock();
        this.calculateVisibleBlocks();
        if (this.currentBlock !== oldBlock) {
            this.owner.getCells().clear();
            this.updateView();
        }
    }

    getRowHeight(): number {
        return this.view.getRowHeight();
    }

    calculateVisibleBlocks() {
        this.blocks.clear();
        let half: number = (this.VISIBLE_BLOCK / 2 | 0);
        let from: number = this.currentBlock - half;
        let toAdd: number = null;
        if (from < 0) {
            toAdd = Math.abs(from);
            from = 0;
        }
        for (let i: number = from; i < this.currentBlock; i++) {
            this.blocks.add(i);
        }
        let toSubtracts: number = null;
        let to: number = this.currentBlock + half + (toAdd != null ? toAdd : 0);
        if (to > this.totalNumberOfBlocks) {
            toSubtracts = to - this.totalNumberOfBlocks - 1;
            to = this.totalNumberOfBlocks + 1;
        }
        for (let i: number = this.currentBlock; i < to; i++) {
            this.blocks.add(i);
        }
        if (toSubtracts != null)
            for (let i: number = 0; i < toSubtracts; i++) {
                this.blocks.add(0, this.blocks.get(0) - 1);
            }
    }

    getHalf(): number {
        return (this.VISIBLE_BLOCK / 2 | 0);
    }

    calculateTopBottomHeights() {
        if (this.blocks.isEmpty())
            return;
        this.topHeight = this.blocks.isEmpty() ? 0 : this.blocks.get(0) * this.blockHeight;
        let n: number = this.totalNumberOfBlocks - this.blocks.get(this.VISIBLE_BLOCK - 1);
        this.bottomHeight = 0;
        for (let i: number = 0; i < n; i++) {
            if (i === 0) {
                this.bottomHeight += this.lastBlockHeight;
                continue;
            }
            this.bottomHeight += this.blockHeight;
        }
    }

    /**
     * Draws data if number of rows is above {@link #scrollStarts}
     * otherwise draws data without virtual scroll.
     */
    drawData() {
        this.setRowsSize();
        this.calculateAll();
        this.updateView();
    }

    /**
     * Defines number of rows after VirtualScroll is turned on.
     * default is {@link #scrollStarts}
     *
     * @param {number} rowNumber row number to start virtual scroll
     */
    public setScrollStarts(rowNumber: number) {
        this.scrollStarts = rowNumber;
    }

    public removeScrollHandler() {
        if (this.scrollHandlerRegistration != null) {
            this.scrollHandlerRegistration.removeHandler();
            this.scrollHandlerRegistration = null;
        }
    }

    public scrollingStarts() {
        if (this.scrollHandlerRegistration == null) this.addScrollHandler();
    }
}


export class Range {
    public __parent: any;
    public from: number;

    public to: number;

    constructor(__parent: any, from: number, to: number) {
        this.__parent = __parent;
        if (this.from === undefined) this.from = 0;
        if (this.to === undefined) this.to = 0;
        this.from = from;
        this.to = to;
    }
}
    




