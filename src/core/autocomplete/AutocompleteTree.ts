/**
 * @author nikolasavic
 */
import {AbstractAutocomplete} from './AbstractAutocomplete';
import {TreeNode} from '../tree/TreeNode';
import {Ui} from '../views/Ui';
import {AutocompleteTreeView} from './views/AutocompleteTreeView';
import {Util} from '../corecls/Util';
import {TreeCellConfig, TreeHtmlParser} from '../tree/Tree';
import {CloseHandler, HasCloseHandlers, HasOpenHandlers, OnBlurHandler, OpenHandler} from '../corecls/handlers';
import {ComponentHtmlParser} from '../ComponentHtmlParser';
import {BaseComponent} from '../BaseComponent';
import {ItemId} from '../corecls/entities';
import {RendererContext} from '../BaseCell';

export class AutocompleteTree<T> extends AbstractAutocomplete<TreeNode<T>, AutocompleteTreeView<T>, TreeNode<T>> {
    treeAcLogic: TreeAcLogic;

    constructor();
    constructor(view?: AutocompleteTreeView<T> | ((p1: TreeNode<T>) => string));
    constructor(view?: AutocompleteTreeView<T>, fieldGetter?: (p1: TreeNode<T>) => string);
    constructor(view?: AutocompleteTreeView<T>, fieldGetter?: (p1: TreeNode<T>) => string) {
        super(Util.isIsElement(view) ? view : Ui.get().getAutocompleteTreeView(), fieldGetter);
        this.ini();
    }

    public setRoot(root: TreeNode<T>): void {
        this.view.getHasRowsData().setRoot(root);
        this.view.getHasRowsData().drawData();
    }

    private ini(): void {
        /** // @ts-ignore */
        // @ts-ignore
        this.treeAcLogic = new TreeAcLogic(this);
        this.treeAcLogic.bind();
    }

    public selectOnlyLeaf(b: boolean): void {
        this.treeAcLogic.setOnlyLeaf(b);
    }

    // public setValue(value: TreeNode<T>): void ;
    // public setValue(value: TreeNode<T>, fireEvents?: boolean): void ;
    // public setValue(value: TreeNode<T>, fireEvents?: boolean): void {
    //     if (!value.isLeaf() && this.treeAcLogic.isOnlyLeaf())
    //         return;
    //     super.setValue(value, fireEvents);
    // }

      /** // @ts-ignore */
     // @ts-ignore
     public getRowCellConfig(): TreeCellConfig<T, String> {
        return <TreeCellConfig<T, String>>this.view.getRowCellConfig();
    }

}

export class TreeAcLogic {
    treeOp: boolean = false;
    onlyLeaf: boolean = false;
    ac: AbstractAutocomplete<any, any, any>;

    public constructor(ac: AbstractAutocomplete<any, any, any>) {
        this.ac = ac;
    }

    public bind(): void {
        this.ac.blurRegistration.removeHandler();
        (<HasCloseHandlers<Object>>this.ac.getView().getHasRowsData()).addCloseHandler(CloseHandler.onClose(() => this.treeOp = true));
        (<HasOpenHandlers<Object>>this.ac.getView().getHasRowsData()).addOpenHandler(OpenHandler.onOpen(() => this.treeOp = true));
        this.ac.addBlurHandler(OnBlurHandler.onBlur(evt => {
            setTimeout(() => {
                if (this.treeOp) {
                    this.treeOp = false;
                    this.ac.getView().setTextBoxFocused(true);
                    return;
                }
                this.ac.showList(false);
            }, 200);
        }));
    }

    public isNotLeaf(value: TreeNode<any>): boolean {
        return (!value.isLeaf() && this.onlyLeaf);
    }

    public setOnlyLeaf(onlyLeaf: boolean): void {
        this.onlyLeaf = onlyLeaf;
    }

    public isOnlyLeaf(): boolean {
        return this.onlyLeaf;
    }
}

export class AutocompleteTreeHtmlParser extends ComponentHtmlParser {

    private static instance: AutocompleteTreeHtmlParser;

    private constructor() {
        super();
    }

    public static getInstance(): AutocompleteTreeHtmlParser {
        if (this.instance == null)
            return this.instance = new AutocompleteTreeHtmlParser();
        return this.instance;
    }

    public parse(htmlElement: Element, elements: Map<string, any>): BaseComponent<any, any> {
        let autocomplete: AutocompleteTree<ItemId>;
        let view = this.getView(this.getClazz(), htmlElement, elements);
        if (view != null)
            autocomplete = new AutocompleteTree(<AutocompleteTreeView<any>><unknown>view);
        else
            autocomplete = new AutocompleteTree();
        if (htmlElement.hasChildNodes()) {
            let root = new TreeNode<any>(new ItemId('root', 'root'));
            TreeHtmlParser.parseItem(<HTMLElement>htmlElement, root, this);
            autocomplete.getRowCellConfig().getCellBuilder()
                .setCellRenderer({
                    setValue(r: RendererContext<TreeNode<ItemId>, String>): void {
                        r.valuePanel.innerHTML =
                            r.cell.getModel().getUserObject().getContent();
                    }
                });
            autocomplete.setRoot(root);
        }
        Util.copyAllAttributes(htmlElement, autocomplete.asElement());
        this.replaceAndCopy(htmlElement, autocomplete);
        return autocomplete;
    }

    public getId(): string {
        return 'dn-autocomplete-tree';
    }

    public getClazz(): string {
        return 'AutocompleteTree';
    }

}
