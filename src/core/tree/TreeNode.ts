import {java} from 'j4ts';
import {getAllChildNodesInOrder, getAllChildNodesInOrderSorted, Node, nodeCollect} from './Node';
import List = java.util.List;
import ArrayList = java.util.ArrayList;
import Comparator = java.util.Comparator;
import Collectors = java.util.stream.Collectors;

export class TreeNode<T> implements Node<TreeNode<T>> {

    private parent: TreeNode<any> = null;
    private children: List<TreeNode<T>>;
    private userObject: T = null;
    private expanded: boolean = true;
    private checked: boolean = false;

    public constructor(userObject: T) {
        this.userObject = userObject;
        if (this.children === undefined)
            this.children = null;
        this.children = null;
    }

    public getUserObject(): any {
        return this.userObject;
    }

    public setUserObject(userObject: T) {
        this.userObject = userObject;
    }

    public getParent(): TreeNode<any> {
        return this.parent;
    }

    public setParent(node: TreeNode<any>) {
        this.parent = node;
    }

    public getChildren(): List<TreeNode<T>> {
        return this.children;
    }

    public createChildrenIfNull() {
        if (this.children == null)
            this.children = new ArrayList<TreeNode<T>>();
    }

    public setChildren(children: List<TreeNode<T>>) {
        this.children = children;
    }

    public isChecked(): boolean {
        return this.checked;
    }

    public setChecked(checked: boolean) {
        this.checked = checked;
    }

    public isExpanded(): boolean {
        return this.expanded;
    }

    public setExpanded(expanded: boolean) {
        this.expanded = expanded;
    }

    insert(node: any, index: number) {
        this.createChildrenIfNull();
        node.setParent(this);
        this.getChildren().add(index, node);
    }

    add(node: any) {
        this.createChildrenIfNull();
        node.setParent(this);
        this.getChildren().add(node);
    }

    addAll(nodeList: List<any>) {
        nodeList.forEach((node) => node.setParent(this));
        this.getChildren().addAll(nodeList);
    }

    isLeaf(): boolean {
        return this.getChildren() == null;
    }

    isRoot(): boolean {
        return this.getParent() == null;
    }

    getRoot(): Node<any> {
        let ancestor: Node<any> = this;
        let previous: Node<any>;
        do {
            {
                previous = ancestor;
                ancestor = ancestor.getParent();
            }
        } while ((ancestor != null));
        return previous;
    }

    getLevel(): number {
        let level: number = -1;
        let ancestor: Node<any> = this;
        do {
            {
                level++;
                ancestor = ancestor.getParent();
            }
        } while ((ancestor != null));
        return level;
    }

    getSiblingsAndChildNodes(): List<any> {
        return nodeCollect(this.getParent());
    }

    getAllNodesFromRoot(): List<any> {
        return nodeCollect(this.getRoot());
    }

    getAllChildNodes(): List<any> {
        return nodeCollect(this);
    }

    getFirstLeaf(): any {
        let node: Node<any> = this;
        if (!this.isLeaf()) do {
            {
                node = <Node<any>><any>node.getChildren().get(0);
            }
        } while ((!node.isLeaf()));
        return <any><any>node;
    }

    getSiblings(): List<any> {
        let level: number = this.getLevel();
        let sib: List<any> = <any>(new ArrayList<any>());
        for (let index128 = this.getSiblingsAndChildNodes().iterator(); index128.hasNext();) {
            let n = index128.next();
            {
                if (n.getLevel() === level) sib.add(n);
            }
        }
        return sib;
    }

    getAllLeafs(): List<any> {
        return this.getAllChildNodes().stream()
            .filter(node => node.isLeaf())
            .collect(Collectors.toList());
    }

    getAllParents(): List<any> {
        let parents = new ArrayList<any>();
        let parent: any = this.getParent();
        while (parent != null) {
            parents.add(parent);
            parent = parent.getParent();
        }
        return parents;
    }

    getAllChildNodesInOrder(): List<any> {
        return getAllChildNodesInOrder(this);
    }

    getAllChildNodesInOrderSorted(comparator: Comparator<any>, filteredList: List<Node<any>>): List<any> {
        return getAllChildNodesInOrderSorted(this, <any>(comparator), filteredList);
    }

    remove(nodeToRemove: any) {
        if (nodeToRemove == null) {
            throw new java.lang.IllegalArgumentException('argument is null');
        }
        this.getChildren().remove(nodeToRemove);
        nodeToRemove.setParent(null);
    }

    removeFromParent() {
        let parent: any = this.getParent();
        if (parent != null) {
            parent.remove(this);
        }
    }

    toString(): string {
        return '' + this.userObject;
    }
}
