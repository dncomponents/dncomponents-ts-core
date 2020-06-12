import {java} from 'j4ts';
import List = java.util.List;

export interface Node<N extends Node<any>> {

    getUserObject<T>(): T;

    getParent(): N;

    setParent(node: N): void;

    getChildren(): java.util.List<N>;

    createChildrenIfNull(): void;

    insert(node?: any, index?: any): void;

    add(node?: N): void;

    addAll(nodeList?: any): void;

    isLeaf(): boolean;

    isRoot(): boolean;

    getRoot(): Node<any>;

    getLevel(): number;

    getSiblingsAndChildNodes(): List<N>;

    getAllNodesFromRoot(): List<N>;

    getAllChildNodes(): List<N>;

    getFirstLeaf(): N;

    getSiblings(): List<N>;

    getAllLeafs(): List<N>;


    getAllParents(): List<N>;

    getAllChildNodesInOrder(): List<N>;

    getAllChildNodesInOrderSorted(comparator?: any, filteredList?: any): List<N>;

    remove(nodeToRemove?: any): void;

    removeFromParent(): void;
}

export function nodeCollect(node: Node<any>): java.util.List<Node<any>> {
    let list: java.util.List<Node<any>> = new java.util.ArrayList<any>();
    for (let index125 = node.getChildren().iterator(); index125.hasNext();) {
        let child = index125.next();
        {
            list.add(child);
            if (!child.isLeaf()) list.addAll(nodeCollect(child));
        }
    }
    return list;
}

export function getAllChildNodesInOrder(node: Node<any>): java.util.List<Node<any>> {
    let allNodes: java.util.List<Node<any>> = new java.util.ArrayList<any>();
    if (!node.isLeaf()) for (let index126 = node.getChildren().iterator(); index126.hasNext();) {
        let rg = index126.next();
        {
            allNodes.add(rg);
            if (!rg.isLeaf()) {
                allNodes.addAll(getAllChildNodesInOrder(rg));
            }
        }
    }
    return allNodes;
}

export function getAllChildNodesInOrderSorted(node: Node<any>, comparator: java.util.Comparator<Node<any>>, filteredList: java.util.List<Node<any>>): java.util.List<Node<any>> {
    let allNodes: java.util.List<Node<any>> = new java.util.ArrayList<any>();
    if (!node.isLeaf()) {
        let leafNodes: java.util.List<Node<any>> = new java.util.ArrayList<any>();
        let treeNodes: java.util.List<Node<any>> = new java.util.ArrayList<any>();
        for (let index3 = node.getChildren().iterator(); index3.hasNext();) {
            let rg = index3.next();
            if (!rg.isLeaf()) {
                treeNodes.add(rg);
                allNodes.add(rg);
                allNodes.addAll(getAllChildNodesInOrderSorted(rg, <any>(comparator), filteredList));
            } else {
                if (filteredList == null || filteredList.contains(rg)) leafNodes.add(rg);
            }
        }
        leafNodes.sort(<any>(comparator));
        allNodes.addAll(leafNodes);
    }
    return allNodes;
}

export function getAllNodesAtLevel(level: number, node: Node<any>): java.util.List<Node<any>> {
    let all: java.util.List<Node<any>> = nodeCollect(node.getRoot());
    return <any>(all.stream().filter((n) => n.getLevel() === level).collect<any, any>(java.util.stream.Collectors.toList<any>()));
}