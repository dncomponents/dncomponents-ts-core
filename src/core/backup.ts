// import {ListData} from './list/ListData';
// import {KeyUpHandler, SelectionEvent, SelectionHandler} from './core/handlers';
// import {java} from 'j4ts';
// import {Fruit} from './test/Fruit';
// import {TextBox} from './textbox/TextBox';
// import {Filter} from './core/Filter';
// import {Predicate} from './AbstractCellComponent';
// import {Autocomplete} from './autocomplete/Autocomplete';
// import {AutocompleteMultiSelect} from './autocomplete/AutocompleteMultiSelect';
// import {Something} from './Something';
// import {Table} from './table/Table';
// import {ColumnConfig} from './table/TableUtil';
// import {Tree} from './tree/Tree';
// import {TreeNode} from './tree/TreeNode';
//
// let listData: ListData<string, string> = new ListData<string, string>();
// listData.getRowCellConfig().setFieldGetter(p1 => {
//     return '* ' + p1 + ' *';
// });
// let list: List<string> = new ArrayList();
// for (let i = 0; i < 1000; i++) {
//     list.add('item ' + i);
// }
// list.add('one');
// list.add('two');
// list.add('three');
// list.add('four');
// listData.setRowsData(list);
// listData.drawData();
// listData.setEditable(true);
// listData.getSelectionModel().addSelectionHandler(new class extends SelectionHandler<List<string>> {
//     onSelection(evt: SelectionEvent<java.util.List<string>>): void {
//         window.alert(evt.selection.get(0));
//     }
// });
//
// ///filter test
// let listFruit: ListData<Fruit, string> = new ListData<Fruit, string>();
// listFruit.getRowCellConfig().setFieldGetter(p1 => {
//     return p1.name;
// });
//
// listFruit.setRowsData(Fruit.getFruits(2));
// listFruit.drawData();
// let tb = new TextBox();
// let filter = new class extends Filter<Fruit> {
//     compare(): Predicate<Fruit> {
//         return fruit => {
//             let val = tb.getValueOrThrow();
//             if (val == null)
//                 return true;
//             return fruit.name.toLowerCase().includes(val.toLowerCase());
//         };
//     }
// };
// tb.addHandler(KeyUpHandler.onKeyUp(evt => filter.fireFilterChange()));
// listFruit.addFilter(filter);
// let ac = new Autocomplete();
// let acM = new AutocompleteMultiSelect();
// ac.setRowsData(list);
// acM.setRowsData(list);
// acM.getHasRowsDataList().drawData();
//
// let smt = new Something();
//
// //
// document.body.append(smt.asElement());
// // document.body.append(tb.asElement());
// // document.body.append(listFruit.asElement());
// // document.body.append(listData.asElement());
// document.body.append(ac.asElement());
// document.body.append(acM.asElement());
//
//
// let table = new Table<Fruit>();
// let col1 = new ColumnConfig<Fruit, string>().setColumnName("Name");
// col1.setFieldGetter(p1 => {
//     return p1.name;
// });
// let col2 = new ColumnConfig<Fruit, string>().setColumnName("Description");
// col2.setFieldGetter(p1 => {
//     return p1.description;
// });
//
// table.addColumn(col1,col2);
// table.setRowsData(Fruit.getFruits(2));
// table.drawData();
//
// document.body.append(table.asElement());
// let tree=new Tree();
// let root = new TreeNode("root");
// let node1 = new TreeNode("node 1");
// let node2 = new TreeNode("node 2");
// let node21 = new TreeNode("node 21");
// let node22 = new TreeNode("node 22");
// let node23 = new TreeNode("node 23");
// node2.add(node21);
// node2.add(node22);
// node2.add(node23);
//
// root.add(node1);
// root.add(node2);
// tree.setRoot(root);
// tree.drawData();
// document.body.append(tree.asElement());
//
