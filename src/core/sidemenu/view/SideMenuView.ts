import {View} from '../../corecls/View';
import {java} from 'j4ts';
import {SelectionHandler} from '../../corecls/handlers';
import {TreeNode} from '../../tree/TreeNode';
import {TreeCellConfig} from '../../tree/Tree';
import {Filter} from '../../corecls/Filter';
import {HandlerRegistration} from '../../corecls/events';
import {CellRenderer} from '../../BaseCell';

export interface SideMenuView extends View {
    showFilter(b: boolean): void;

    setRoot(item: TreeNode<any>): void;

    drawData(): void;

    expandAll(b: boolean): void;

    addSelectionHandler<T>(handler: SelectionHandler<java.util.List<TreeNode<T>>>): HandlerRegistration;

    getAll<T>(): java.util.List<TreeNode<T>>;

    getValueFromView(): string;

    registerFilter(filter: Filter<TreeNode<any>>): void;

    showNode(treeNode: TreeNode<any>): void;

    setCellConfig(menuItem: TreeNode<any>, cellConfig: TreeCellConfig<any, any>): void;

    setRenderer<T>(renderer: CellRenderer<TreeNode<T>, any>): void;

    setHeight(height: string): void;

    setWidth(width: string): void;

    setSelected<T>(item: TreeNode<T>, selected: boolean, fireEvent: boolean): void;

    show(b: boolean): void;

    isShown(): boolean;
}
