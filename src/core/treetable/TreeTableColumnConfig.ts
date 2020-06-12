import {AbstractHeaderCell, ColumnConfig} from '../table/TableUtil';
import {TreeNode} from '../tree/TreeNode';
import {java} from 'j4ts';
import Optional = java.util.Optional;

export class TreeTableColumnConfig<T, M> extends ColumnConfig<TreeNode<T>, M> {
    public constructor(fieldGetter?: (p1: T) => M) {
        super();
        if (fieldGetter)
            this.setFieldGetterTn(fieldGetter);
    }

    setFieldGetterTn(fieldGetter: (p1: T) => M): TreeTableColumnConfig<T, M> {
        super.setFieldGetter(tn => {
            let userObject;
            try {
                userObject = tn.getUserObject();
                if (typeof userObject === 'string')
                    return null;
                return fieldGetter(userObject);
            } catch (e) {
                return null;
            }
        });
        return this;
    }


    public setColumnConfigTn(columnConfig: ColumnConfig<T, M>): TreeTableColumnConfig<T, M> {
        this.setFieldGetterTn(columnConfig.getFieldGetter());
        this.setFieldSetter((tn, m) => {
            let userObject: T;
            try {
                userObject = tn.getUserObject();
                columnConfig.getFieldSetter()(userObject, m);
            } catch (ex) {
                //cast exception
            }
        });
        this.setColumnName(columnConfig.getColumnName());
        this.setClazz(columnConfig.getClazz());
        this.setEditable(columnConfig.isEditable());
        this.setColumnWidth(columnConfig.getColumnWidth());
        this.setCellFactory({
            getCell(c: any): any {
                return columnConfig.getCellFactory().getCell(c);
            }
        });
        this.setHeaderCellFactory({
            getCell(): AbstractHeaderCell {
                return columnConfig.getHeaderCellFactory().getCell();
            }
        });
        return this;
    }


    private static getUserObject<T>(node: TreeNode<T>): Optional<T> {
        let userObject: T;
        try {
            userObject = node.getUserObject();
        } catch (ex) {
            //class cast exception
            userObject = null;
        }
        return Optional.ofNullable(userObject);
    }
}