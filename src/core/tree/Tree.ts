import {AbstractCellComponent, Predicate} from '../AbstractCellComponent';
import {CloseHandler, HasCloseHandlers, HasOpenHandlers, OpenHandler} from '../corecls/handlers';
import {TreeNode} from './TreeNode';
import {java} from 'j4ts';
import {CellConfig} from '../CellConfig';
import {Filter} from '../corecls/Filter';
import {AbstractTreeCell, AbstractTreeCellBuilder, TreeCellFactory} from './treecell';
import {ListTreeMultiSelectionModel} from '../list/ListTreeMultiSelectionModel';
import {TreeMultiSelectionModel} from './TreeMultiSelectionModel';
import {HandlerRegistration} from '../corecls/events';
import {CellRenderer} from '../BaseCell';
import {TreeUi} from './view/TreeUi';
import {Ui} from '../views/Ui';
import {ComponentHtmlParser} from '../ComponentHtmlParser';
import {ItemId} from '../corecls/entities';
import {BaseComponent} from '../BaseComponent';
import {Util} from '../corecls/Util';
import Collectors = java.util.stream.Collectors;
import List = java.util.List;
import ArrayList = java.util.ArrayList;
import HashMap = java.util.HashMap;

export class Tree<M> extends AbstractCellComponent<TreeNode<M>, any, TreeUi> implements HasOpenHandlers<TreeNode<any>>, HasCloseHandlers<TreeNode<any>> {

    mapCfg: java.util.Map<TreeNode<M>, CellConfig<TreeNode<M>, any>>;

    /** // @ts-ignore */
    // @ts-ignore
    private treeLogic: TreeLogic<any> = new TreeLogic<any>(this);

    constructor();
    constructor(view?: TreeUi) ;
    constructor(view?: TreeUi) {
        super(view ? view : Ui.get().getTreeUi());
        this.mapCfg = new HashMap<any, any>();
        let self = this;
        /** // @ts-ignore */
        // @ts-ignore
        this.defaultCellFactory = new class implements TreeCellFactory<M, any> {
            getCell(c?: any): AbstractTreeCell<M, any> {
                return AbstractTreeCell.getCell(c.model, self.isCheckable());
            }
        };
        /** // @ts-ignore */
        // @ts-ignore
        this.setSelectionModel(new ListTreeMultiSelectionModel(this, this.view.getRootView()));
    }

    /** // @ts-ignore */
    // @ts-ignore
    getRowCell(row: number | TreeNode<M>): AbstractTreeCell<any, any> {
        return <AbstractTreeCell<any, any>>super.getRowCell(row);
    }

    public getRowCells(list: List<TreeNode<M>>): List<AbstractTreeCell<any, any>> {
        return <List<AbstractTreeCell<any, any>>><any>super.getRowCells(list);
    }

    /** // @ts-ignore */
    // @ts-ignore
    public getCells(): List<AbstractTreeCell<M, any>> {
        return <List<AbstractTreeCell<M, any>>><any>super.getCells();
    }

    filterAndSort() {
        super.filterAndSort();
        this.treeLogic.filterChildParentNodes();
        this.treeLogic.filterAndSort();
    }

    isAllExpandedOrCollapsed(): boolean {
        return this.treeLogic.isAllExpandedOrCollapsed();
    }

    getDefaultCellConfig(node: TreeNode<any>): CellConfig<any, any> {
        return <CellConfig<any, any>>this.ensureRowCellConfig();
    }

    public isCheckable(): boolean {
        return this.treeLogic.checkable;
    }

    public setCheckable(checkable: boolean) {
        this.treeLogic.checkable = checkable;
        /** // @ts-ignore */
        // @ts-ignore
        this.setSelectionModel(new TreeMultiSelectionModel(this, this.view.getRootView()));
        // this.getSelectionModel().setNavigator$boolean(false);
    }

    public getRoot(): TreeNode<any> {
        return this.treeLogic.root;
    }

    public setRoot(root: TreeNode<any>) {
        this.treeLogic.root = root;
        let rows: List<any> = <any>(new ArrayList<any>());
        rows.add(root);
        rows.addAll(root.getAllChildNodesInOrder());
        this.setRowsData(rows);
    }

    public rootToList() {
        this.rows.clear();
        this.rowsFiltered.clear();
        let rows: List<any> = new ArrayList<any>();
        rows.add(this.treeLogic.root);
        rows.addAll(this.treeLogic.root.getAllChildNodesInOrder());
        this.setRowsData(rows);
    }

    public isAllCollapsed(): boolean {
        return this.treeLogic.allNodesCollapsed();
    }

    public isAllExpanded(): boolean {
        return this.treeLogic.allNodesExpanded();
    }

    /**
     * sets expandAll property and all nodes to expandAll
     *
     * @param {boolean} expandAll
     */
    public expandAll(expandAll: boolean) {
        this.treeLogic.setExpandAll(expandAll);
    }

    public showTreeNode(treeNode: TreeNode<any>) {
        let parent: TreeNode<any> = treeNode.getParent();
        while ((parent != null)) {
            {
                parent.setExpanded(true);
                parent = parent.getParent();
            }
        }
        ;
        this.getSelectionModel().setSelected(treeNode, true);
        this.drawData();
    }

    public getSelectionModel(): ListTreeMultiSelectionModel<TreeNode<M>> {
        return <ListTreeMultiSelectionModel<TreeNode<M>>>this.selectionModel;
    }

    public setScrollHeight(height: string) {
        this.view.getRootView().setScrollHeight(height);
    }

    public showChildren(showChildren: boolean) {
        this.treeLogic.showChildren = showChildren;
    }

    public showParents(showParents: boolean) {
        this.treeLogic.showParents = showParents;
    }

    public isShowRoot(): boolean {
        return this.treeLogic.isShowRoot();
    }

    public showRoot(b: boolean) {
        this.treeLogic.setShowRoot(b);
    }

    public isShowChildren(): boolean {
        return this.treeLogic.showChildren;
    }

    public isShowParents(): boolean {
        return this.treeLogic.showParents;
    }

    public addCloseHandler(handler: CloseHandler<TreeNode<any>>): HandlerRegistration {
        return this.addHandler(handler);
    }

    public addOpenHandler(handler: OpenHandler<TreeNode<any>>): HandlerRegistration {
        return this.addHandler(handler);
    }

    public oneItemExpand(b: boolean) {
    }

    /** // @ts-ignore */
    // @ts-ignore
    public getRowCellConfig(): TreeCellConfig<any, any> {
        return <any>this.ensureRowCellConfig();
    }

    /** // @ts-ignore */
    // @ts-ignore
    public ensureRowCellConfig(): TreeCellConfig<any, any> {
        if (this.rowCellConfig == null) {
            /** // @ts-ignore */
            // @ts-ignore
            this.rowCellConfig = new DefaultTreeRowConfig();
        }
        return <TreeCellConfig<any, any>>this.rowCellConfig;
    }

    public ensureRowCellConfigModel(model: TreeNode<M>): CellConfig<TreeNode<M>, any> {
        if (this.mapCfg.get(model) != null)
            return this.mapCfg.get(model);
        else {
            /** // @ts-ignore */
            // @ts-ignore
            return this.ensureRowCellConfig();
        }
    }

// @ts-ignore
    // public getRowCellConfig(): TreeCellConfig<M, any> {
    //     return <TreeCellConfig<M, any>>super.getRowCellConfig();
    // }

    public setCellConfig(m: TreeNode<any>, cellConfig: CellConfig<any, any>) {
        this.mapCfg.put(m, cellConfig);
    }
}

export class TreeLogic<M> {
    owner: AbstractCellComponent<TreeNode<M>, any, any>;

    public constructor(owner: AbstractCellComponent<TreeNode<M>, any, any>) {
        if (this.owner === undefined) this.owner = null;
        if (this.root === undefined) this.root = null;
        this.owner = owner;
    }

    showParents: boolean = true;

    showChildren: boolean = false;

    expandWhenFiltering: boolean = true;

    showRoot: boolean = true;

    /**
     * Default {@code CellConfig} for all cells.
     */
    checkable: boolean = false;

    root: TreeNode<any>;

    FILTER_EXPAND: Filter<TreeNode<M>> = new class extends Filter<TreeNode<M>> {
        compare(): Predicate<TreeNode<M>> {
            return treeNode => {
                return !treeNode.getAllParents()
                    .stream()
                    .anyMatch(e => !e.isExpanded());
            };
        }
    };

    public isShowRoot(): boolean {
        return this.showRoot;
    }

    public setShowRoot(showRoot: boolean) {
        if (this.showRoot && !showRoot && this.root != null)
            this.root.setExpanded(true);
        this.showRoot = showRoot;
    }

    filterChildParentNodes() {
        if (!this.owner.filters.isEmpty())
            this.filterWithParentNodes();
    }

    filterAndSort() {
        this.owner.rowsFiltered = this.owner.rowsFiltered
            .stream()
            .filter(e => this.FILTER_EXPAND.compare().apply(this, [e]))
            .collect(Collectors.toList<TreeNode<any>>());
        if (!this.showRoot)
            this.owner.rowsFiltered.remove(this.root);
        this.owner.ensureVirtualScroll().calculateAll();
    }

    public setRoot(root: TreeNode<any>) {
        this.root = root;
        let rows: List<any> = new ArrayList<any>();
        rows.add(root);
        rows.addAll(root.getAllChildNodesInOrder());
        this.owner.setRowsData(rows);
    }

    public setExpandAll(expandAll: boolean) {
        this.owner.rows.stream().forEach((e) => {
            if (this.showRoot || e.getLevel() !== 0)
                e.setExpanded(expandAll);
        });
    }

    filterWithParentNodes() {
        if (!this.showParents && !this.showChildren)
            return;
        let ancestors: java.util.Set<TreeNode<any>> = new java.util.HashSet<any>();
        let descendants: java.util.Set<TreeNode<any>> = new java.util.HashSet<any>();
        for (let index1 = this.owner.rowsFiltered.iterator(); index1.hasNext();) {
            let treeNode = index1.next();
            {
                if (this.showParents) {
                    ancestors.add(treeNode);
                    ancestors.addAll(treeNode.getAllParents());
                }
                if (this.showChildren) {
                    descendants.add(treeNode);
                    descendants.addAll(treeNode.getAllChildNodesInOrder());
                }
            }
        }
        this.owner.rowsFiltered = this.owner.rows
            .stream()
            .filter((treeNode: TreeNode<any>) => {
                return ancestors.contains(treeNode) || descendants.contains(treeNode);
            }).collect(Collectors.toList<any>());
    }

    isAllExpandedOrCollapsed(): boolean {
        return this.allNodesCollapsed() || this.allNodesExpanded();
    }

    /**
     * check if all nodes are expanded
     *
     * @return {boolean} true if all node's properties of expanded are true
     */
    public allNodesExpanded(): boolean {
        return this.owner.rows.stream().allMatch((treeNode) => treeNode.isExpanded() === true);
    }

    public allNodesCollapsed(): boolean {
        return this.owner.rows.stream().allMatch((treeNode) => treeNode.isExpanded() === false);
    }
}


export class TreeCellConfig<T, M> extends CellConfig<TreeNode<T>, M> {

    renderer: CellRenderer<TreeNode<any>, T>;

    public constructor(fieldGetter: (p1: TreeNode<T>) => M, fieldSetter?: any) {
        super();
        this.setFieldGetter(fieldGetter);
        this.setFieldSetter(fieldSetter);
        this.setCellFactory({
            getCell(c?: any): AbstractTreeCell<T, M> {
                return c.initWithBuilder(this.builder);
            }
        });

        /** // @ts-ignore */
        // @ts-ignore
        this.builder = new class extends AbstractTreeCellBuilder<T, M> {
            build(): AbstractTreeCell<T, M> {
                return null;
            }
        };
    }

    /** // @ts-ignore */
    // @ts-ignore
    public setCellFactory(cellFactory: TreeCellFactory<T, M>): TreeCellConfig<T, M> {
        /** // @ts-ignore */
        // @ts-ignore
        super.setCellFactory<any>(cellFactory);
        return this;
    }


    /** // @ts-ignore */
    // @ts-ignore
    public getCellBuilder(): AbstractTreeCellBuilder<T, M> {
        return <AbstractTreeCellBuilder<T, M>>super.getCellBuilder();
    }
}

export class DefaultTreeRowConfig extends TreeCellConfig<any, any> {
    public __parent: any;

    constructor() {
        super((o) => o.getUserObject(), (node: TreeNode<any>, o: any) => node.setUserObject(o));
        this.setCellFactory(new class implements TreeCellFactory<any, any> {
            getCell(c?: any): AbstractTreeCell<any, any> {
                return AbstractTreeCell.getCell(c.model, c.owner.isCheckable());
            }
        });
    }

}

export class TreeHtmlParser extends ComponentHtmlParser {

    static instance: TreeHtmlParser = null;

    public static getInstance(): TreeHtmlParser {
        if (TreeHtmlParser.instance == null)
            return TreeHtmlParser.instance = new TreeHtmlParser();
        return TreeHtmlParser.instance;
    }

    public parse(htmlElement: Element, elements: Map<string, any>): BaseComponent<any, any> {
        let tree: Tree<ItemId>;
        let ui: TreeUi = this.getView(this.getClazz(), htmlElement, elements);
        if (ui != null)
            tree = new Tree<any>(ui);
        else
            tree = new Tree<any>();
        if (htmlElement.hasChildNodes()) {
            let root: TreeNode<ItemId> = new TreeNode<any>(new ItemId('root', 'root'));
            TreeHtmlParser.parseItem(<HTMLElement>htmlElement, root, this);
            tree.setRoot(root);
            tree.getRowCellConfig().getCellBuilder().setCellRenderer({
                setValue: (r) =>
                    r.valuePanel.innerHTML = r.cell.getModel().getUserObject().getContent()
            });
            tree.drawData();
        }
        this.replaceAndCopy(htmlElement, tree);
        return tree;
    }

    public static parseItem(node: HTMLElement, treeNode: TreeNode<ItemId>, cp: ComponentHtmlParser) {
        let elements = node.getElementsByTagName(ComponentHtmlParser.ITEM);
        for (let i: number = 0; i < elements.length; i++) {
            let at: Element = elements.item(i);
            if (!Util.isChildOf(node, at)) {
                continue;
            }
            let item: TreeNode<ItemId>;
            let idItem: ItemId = cp.getIdItem(at);
            if (at.hasAttribute(ComponentHtmlParser.CONTENT)) {
                item = new TreeNode<any>(idItem);
                TreeHtmlParser.parseItem(<HTMLElement>at, item, cp);
            } else item = new TreeNode<any>(idItem);
            treeNode.add(item);
        }
    }

    public getId(): string {
        return 'dn-tree';
    }

    public getClazz(): string {
        return 'Tree';
    }

}