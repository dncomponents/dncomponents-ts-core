import {ComponentUi, View} from '../../corecls/View';
import {IsElement} from '../../corecls/IsElement';
import {MouseEnterHandler, MouseLeaveHandler} from '../../corecls/handlers';
import {DropDownItemView, DropDownView} from '../../dropdown/DropDownUi';

export interface DropDownMultiLevelUi extends ComponentUi<DropDownView> {
    getDropDownItemView(): DropDownItemView;

    getDropDownItemMultiLevelParentView(): DropDownItemMultiLevelParentView;

    getDropDownTreeNodePanelView(): DropDownTreeNodePanelView;
}

export interface DropDownTreeNodePanelView extends View {
    add(item: IsElement<any>): void;

    clear(): void;

    show(relativeTo: IsElement<any>, b: boolean, orientation: string): void;

    addMouseEnterHandler(mouseEnterHandler: MouseEnterHandler): void;

    addMouseLeaveHandler(mouseLeaveHandler: MouseLeaveHandler): void;
}

export interface DropDownItemMultiLevelParentView extends DropDownItemView {
    addMouseLeaveHandler(mouseLeaveHandler: MouseLeaveHandler): void;

    addMouseEnterHandler(mouseEnterHandler: MouseEnterHandler): void;
}