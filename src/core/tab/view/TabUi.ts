import {ComponentUi} from '../../corecls/View';
import {TabItemView} from './TabItemView';
import {TabView} from './TabView';

export interface TabUi extends ComponentUi<TabView> {
    getTabItemView(): TabItemView;
}
