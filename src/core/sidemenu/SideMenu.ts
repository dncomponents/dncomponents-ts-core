import {BaseComponent} from '../BaseComponent';
import {HasSelectionHandlers} from '../corecls/selectionmodel/selection';
import {TreeNode} from '../tree/TreeNode';
import {CellRenderer} from '../BaseCell';
import {java} from 'j4ts';
import {TreeCellConfig} from '../tree/Tree';
import {SelectionEvent, SelectionHandler} from '../corecls/handlers';
import {HandlerRegistration} from '../corecls/events';
import {Filter} from '../corecls/Filter';
import {SideMenuView} from './view/SideMenuView';
import {Predicate} from '../AbstractCellComponent';
import {PlaceManager} from '../appview/PlaceManager';
import {History} from '../appview/History';
import {ItemId} from '../corecls/entities';
import {ValueChangeHandler} from '../corecls/ValueClasses';
import {ComponentHtmlParser} from '../ComponentHtmlParser';
import {Util} from '../corecls/Util';
import {Ui} from '../views/Ui';

export class SideMenu<T> extends BaseComponent<any, SideMenuView> implements HasSelectionHandlers<T> {
    constructor();
    constructor(view?: SideMenuView) ;
    constructor(view?: SideMenuView) {
        super(view ? view : Ui.get().getSideMenuView());
        this.init();
    }

    filter: Filter<TreeNode<any>>;

    private itemRenderer: CellRenderer<TreeNode<T>, any>;

    filterField: (p1: TreeNode<T>) => string;


    init() {
        let self = this;
        this.filter = new class extends Filter<TreeNode<any>> {
            compare(): Predicate<TreeNode<any>> {
                return treeNode => {
                    if (treeNode == null || treeNode.getUserObject() == null || self.view.getValueFromView() == null)
                        return true;
                    let str = '';
                    if (self.filterField == null)
                        str = treeNode.getUserObject() + '';
                    else
                        str = self.filterField.apply(this, [treeNode]);
                    if (str == null)
                        return false;
                    return str.toLowerCase().includes(self.view.getValueFromView().toLowerCase());
                };
            }
        };
        this.view.registerFilter(this.filter);
        this.view.addSelectionHandler<T>(SelectionHandler.onSelection(evt => {
            SelectionEvent.fire(self, evt.selection.get(0).getUserObject());
        }));
    }

    public showFilter(b: boolean) {
        this.view.showFilter(b);
    }

    public setRootMenuItem(item: TreeNode<any>) {
        this.view.setRoot(item);
    }

    public expandAll(b: boolean) {
        this.view.expandAll(b);
    }

    public getAllItems(): java.util.List<TreeNode<T>> {
        return this.view.getAll<any>();
    }

    public showNode(treeNode: TreeNode<any>) {
        this.view.showNode(treeNode);
    }

    public setCellConfig(menuItem: TreeNode<any>, cellConfig: TreeCellConfig<any, any>) {
        this.view.setCellConfig(menuItem, cellConfig);
    }

    public draw() {
        this.view.drawData();
    }

    public setItemRenderer(itemRenderer: CellRenderer<TreeNode<T>, any>) {
        this.itemRenderer = itemRenderer;
        this.view.setRenderer(this.itemRenderer);
    }

    public setFilterField(filterField: (p1: TreeNode<T>) => string) {
        this.filterField = <any>(filterField);
    }

    public addSelectionHandler(handler: SelectionHandler<T>): HandlerRegistration {
        return handler.addTo(this.asElement());
    }

    public setSelected(item: TreeNode<T>, selected: boolean, fireEvent: boolean) {
        this.view.setSelected<any>(item, selected, fireEvent);
    }

    placeManager: PlaceManager;

    public setPlaceManager(placeManager: PlaceManager) {
        if (this.placeManager == null) {
            this.placeManager = placeManager;
            this.addSelectionHandler(SelectionHandler.onSelection(evt => {
                if (evt.selection instanceof ItemId)
                    History.newItem((<ItemId>evt.selection).getId(), true);
                else
                    History.newItem(evt.selection + '', true);
            }));

            this.placeManager.addValueChangeHandler(ValueChangeHandler.onValueChange(evt => {
                let historyToken = placeManager.getHistoryToken(evt.value);
                this.getAllItems().forEach(item => {
                    if ((<ItemId>item.getUserObject()).getId() != null &&
                        (<ItemId>item.getUserObject()).getId() === (historyToken)) {
                        this.setSelected(item, true, false);
                        this.draw();
                    }
                });
            }));
        }
    }

    setCellRenderer(cellRenderer: CellRenderer<TreeNode<T>, string>) {
    }

    public setHeight(height: string) {
        this.view.setHeight(height);
    }

    public setWidth(width: string) {
        this.view.setWidth(width);
    }

    public show(b: boolean) {
        this.view.show(b);
    }

    public isShown(): boolean {
        return this.view.isShown();
    }
}


export class SideMenuHtmlParser extends ComponentHtmlParser {


    private static instance: SideMenuHtmlParser;

    private ListHtmlParser() {
    }

    public static getInstance(): SideMenuHtmlParser {
        if (this.instance == null)
            return this.instance = new SideMenuHtmlParser();
        return this.instance;
    }

    public parse(htmlElement: Element, elements: Map<string, any>): BaseComponent<any, any> {
        let sideMenu: SideMenu<ItemId>;
        let ui = this.getView(this.getClazz(), htmlElement, elements);
        if (ui != null)
            sideMenu = new SideMenu(<SideMenuView>ui);
        else
            sideMenu = new SideMenu();
        if (htmlElement.hasChildNodes()) {
            let root: TreeNode<ItemId> = new TreeNode(new ItemId('root', 'root'));
            sideMenu.setItemRenderer({
                setValue: (r) =>
                    r.valuePanel.innerHTML = r.cell.getModel().getUserObject().getContent() + ''
            });
            sideMenu.setFilterField((itemIdTreeNode) => itemIdTreeNode.getUserObject().getContent());
            this.parseItem(<HTMLElement>htmlElement, root);
            sideMenu.setRootMenuItem(root);
            sideMenu.draw();
        }
        this.replaceAndCopy(htmlElement, sideMenu);
        return sideMenu;
    }

    public parseItem(node: HTMLElement, treeNode: TreeNode<ItemId>) {
        let elements = node.getElementsByTagName(ComponentHtmlParser.ITEM);
        for (let i: number = 0; i < elements.length; i++) {
            {
                let at: Element = elements.item(i);
                if (!Util.isChildOf(node, at)) {
                    continue;
                }
                let item: TreeNode<ItemId>;
                let idItem: ItemId = this.getIdItem(at);
                item = new TreeNode<ItemId>(idItem);
                if (at.hasAttribute(ComponentHtmlParser.CONTENT))
                    this.parseItem(<HTMLElement>at, item);
                treeNode.add(item);
            }
        }
    }

    public getId(): string {
        return 'dn-side-menu';
    }

    public getClazz(): string {
        return 'SideMenu';
    }

}
