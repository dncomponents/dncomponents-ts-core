import {ListTreeMultiSelectionModel} from '../list/ListTreeMultiSelectionModel';
import {AbstractCellComponent} from '../AbstractCellComponent';
import {TreeNode} from './TreeNode';
import {java} from 'j4ts';
import {ListView} from '../list/ListUi';
import Collectors = java.util.stream.Collectors;

export class TreeMultiSelectionModel extends ListTreeMultiSelectionModel<TreeNode<any>> {

    public constructor(owner: AbstractCellComponent<any, any, any>, view: ListView) {
        super(owner, view);
    }

    public setSelected(model: TreeNode<any>, b: boolean, fireEvent?: boolean): boolean {
        let changed: boolean = false;
        if (b) {
            if (!this.isSelected(model)) {
                this.selection.add(model);
                if (!model.isLeaf()) {
                    this.selection.addAll(model.getAllChildNodesInOrder()
                        .stream()
                        .filter((e) => !this.isSelected(e))
                        .collect(Collectors.toList<any>()));
                }
                for (let index2 = model.getAllParents().iterator(); index2.hasNext();) {
                    let treeNode = index2.next();
                    {
                        if (this.isAllSelectedP(treeNode)) {
                            this.selection.add(treeNode);
                        }
                    }
                }
                changed = true;
            }
        } else {
            if (this.isSelected(model)) {
                this.selection.remove(model);
                if (!model.isLeaf()) {
                    this.selection.removeAll(model.getAllChildNodesInOrder());
                }
                this.selection.removeAll(model.getAllParents());
                changed = true;
            }
        }
        if (changed) {
            this.fireSelectionChange();
        }
        return changed;
    }


    private isAllSelectedP(node: TreeNode<any>): boolean {
        return node.getAllChildNodesInOrder().stream().allMatch((p) => {
            return this.selection.contains(p);
        });
    }


    public getNodeState(parent: TreeNode<any>): SelectionState {
        let allSelected = true;
        parent.getAllChildNodesInOrder().forEach(p1 => {
            if (allSelected == true)
                if (!this.selection.contains(p1)) {
                    allSelected = false;
                }
        });

        let allUnSelected = true;
        parent.getAllChildNodesInOrder().forEach(p1 => {
            if (allUnSelected == true)
                if (this.selection.contains(p1)) {
                    allUnSelected = false;
                }
        });

        // let allSelected: boolean = parent.getAllChildNodesInOrder()
        //     .stream()
        //     .allMatch((p) => {
        //         return this.selection.contains(p);
        //     });
        // let allUnSelected: boolean = parent.getAllChildNodesInOrder()
        //     .stream()
        //     .allMatch((treeNode) => !this.selection.contains(treeNode));

        if (allSelected) {
            return SelectionState.CHECKED;
        } else if (allUnSelected) {
            return SelectionState.UNCHECKED;
        } else if (!allSelected && !allUnSelected) {
            return SelectionState.INDETERMINATE;
        } else {
            return null;
        }
    }
}

export enum SelectionState {
    CHECKED, UNCHECKED, INDETERMINATE
}