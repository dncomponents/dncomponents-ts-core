import {AbstractAutocompleteMultiSelect} from './AbstractAutocompleteMultiSelect';
import {java} from 'j4ts';
import {Ui} from '../views/Ui';
import {TreeNode} from '../tree/TreeNode';
import {TreeAcLogic} from './AutocompleteTree';
import {BaseComponent, MainRenderer, MainViewSlots} from '../BaseComponent';
import {Tree, TreeHtmlParser} from '../tree/Tree';
import {ComponentHtmlParser} from '../ComponentHtmlParser';
import {ItemId} from '../corecls/entities';
import {AutocompleteMultiSelectView} from './views/AutocompleteMultiSelectView';
import {RendererContext} from '../BaseCell';
import {Util} from '../corecls/Util';
import List = java.util.List;

export class AutocompleteTreeMultiSelect<T> extends AbstractAutocompleteMultiSelect<TreeNode<T>, List<TreeNode<T>>> {

    constructor();
    constructor(view?: AutocompleteMultiSelectView<T> | ((p1: TreeNode<T>) => string));
    constructor(view?: AutocompleteMultiSelectView<T>, fieldGetter?: (p1: TreeNode<T>) => string);
    constructor(view?: AutocompleteMultiSelectView<T>, fieldGetter?: (p1: TreeNode<T>) => string) {
        super(Ui.get().getAutocompleteMultiSelectView(true), fieldGetter);
        this.ini();
    }


    private ini(): void {
        this.view.getRowCellConfig().setFieldGetter(node => node.getUserObject() + '');
        this.setItemRenderer(new class implements MainRenderer<TreeNode<T>> {
            render(node: TreeNode<T>, slots: MainViewSlots): void {
                slots.getMainSlot().textContent = node.getUserObject() + '';
            }
        });
        let treeAcLogic = new TreeAcLogic(<any>this);
        treeAcLogic.bind();
    }

    public setRoot(root: TreeNode<T>): void {
        (<Tree<T>>this.view.getHasRowsData()).setRoot(root);
        this.view.getHasRowsData().drawData();
    }
}

export class AutocompleteTreeMultiSelectHtmlParser extends ComponentHtmlParser {

    private static instance: AutocompleteTreeMultiSelectHtmlParser;

    private constructor() {
        super();
    }

    public static getInstance(): AutocompleteTreeMultiSelectHtmlParser {
        if (this.instance == null)
            return this.instance = new AutocompleteTreeMultiSelectHtmlParser();
        return this.instance;
    }

    public parse(htmlElement: Element, elements: Map<string, any>): BaseComponent<any, any> {
        let autocomplete: AutocompleteTreeMultiSelect<ItemId>;
        let view = this.getView(this.getClazz(), htmlElement, elements);
        if (view != null)
            autocomplete = new AutocompleteTreeMultiSelect(<AutocompleteMultiSelectView<any>>view);
        else
            autocomplete = new AutocompleteTreeMultiSelect();
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
        return 'dn-autocomplete-tree-multi-select';
    }

    public getClazz(): string {
        return 'AutocompleteTreeMultiSelect';
    }

}
