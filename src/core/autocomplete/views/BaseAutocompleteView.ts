import {java} from 'j4ts';
import {FocusComponentView} from '../../views/FocusComponentView';
import {HasSelectionHandlers} from '../../corecls/selectionmodel/selection';
import {ClickHandler, KeyUpHandler} from '../../corecls/handlers';
import {Filter} from '../../corecls/Filter';
import {CellConfig} from '../../CellConfig';
import {Command} from '../../BaseComponent';
import {DefaultMultiSelectionModel} from '../../corecls/selectionmodel/selectionImpl';
import {HasRowsData} from '../../AbstractCellComponent';

export interface BaseAutocompleteView<M> extends FocusComponentView, HasSelectionHandlers<java.util.List<M>> {
    getTextBoxCurrentValue(): string;

    setTextBoxCurrentValue(value: string): void;

    addKeyUpHandler(keyUpHandler: KeyUpHandler): void;

    addButtonClickHandler(clickHandler: ClickHandler): void;

    setFilter(filter: Filter<M>): void;

    setStringValue(value: string): void;

    showListPanel(b: boolean, done: Command): void;

    setTextBoxFocused(b: boolean): void;

    focusList(): void;

    getSelectionModel(): DefaultMultiSelectionModel<M>;

    getHasRowsData(): HasRowsData<M>;

    setFieldGetter(fieldGetter: (p1: M) => string): void;

    getRowCellConfig(): CellConfig<M, any>;
}
