import {BaseCellView} from '../../corecls/BaseCellView';
import {ComponentUi} from '../../corecls/View';
import {TreeView} from '../../table/views/TableUi';
import {EventHandler} from '../../corecls/events';
import {HasValue} from '../../corecls/ValueClasses';

export interface TreeUi extends ComponentUi<TreeView>, HasTreeUi {
    getTreeCellView(icon: string): BaseTreeCellView;

    getParentTreeCellView(icon: string): ParentTreeCellView;

    getTreeCellCheckBoxView(icon: string): TreeCellCheckboxSimpleView;

    getParentTreeCellCheckboxView(icon: string): TreeCellCheckboxParentView;

    getTreeUi(): TreeUi;
}

export interface TreeCellCheckboxParentView extends ParentTreeCellView {
    getCheckBox(): HasValue<boolean>;

    setIndeterminate(b: boolean): void;
}

export interface TreeCellCheckboxSimpleView extends BaseTreeCellView {
    getCheckBox(): HasValue<boolean>;
}

export interface ParentTreeCellView extends BaseTreeCellView {
    setOpened(b: boolean): void;

    addOpenCloseHandler(handler: EventHandler<any>): void;
}

export interface BaseTreeCellView extends BaseCellView {
    setActive(b: boolean): void;

    setPadding(padding: number): void;
}

export interface HasTreeUi {
    getTreeUi(): TreeUi;
}
