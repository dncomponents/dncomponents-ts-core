import {java} from 'j4ts';
import {Autocomplete} from './Autocomplete';
import {DefaultCellEditor} from '../CellEditor';
import List = java.util.List;

export class AutoCompleteEditor<M> extends DefaultCellEditor<M, Autocomplete<any>> {
    public constructor();
    public constructor(list: List<any>);
    public constructor(list?: List<any>) {
        super(new Autocomplete());
        if (list != null)
            this.getHasValue().setRowsData(list);
    }

    public startEditing() {
        this.getHasValue().showList(true);
    }

    public getHasValue(): Autocomplete<any> {
        return <Autocomplete<any>><any>super.getHasValue();
    }
}


