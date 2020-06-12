import {ButtonView} from '../button/view/ButtonView';
import {TextBoxView} from '../textbox/TextBoxView';
import {CheckBoxView} from '../checkbox/CheckBoxView';
import {View} from '../corecls/View';
import {PluginHelper} from '../ComponentHtmlParser';
import {SetMultimap} from '@teppeis/multimaps';
import {RadioView} from '../checkbox/RadioView';
import {AccordionUi} from '../accordion/accrodion_views';
import {ListUi} from '../list/ListUi';
import {AutocompleteView} from '../autocomplete/views/AutocompleteView';
import {AutocompleteMultiSelectView} from '../autocomplete/views/AutocompleteMultiSelectView';
import {DropDownUi} from '../dropdown/DropDownUi';
import {TooltipView} from '../tooltip/view/TooltipView';
import {PopoverView} from '../popover/view/PopoverView';
import {FilterPanelView, PagerUi, TableUi, TableView} from '../table/views/TableUi';
import {TreeUi} from '../tree/view/TreeUi';
import {SideMenuView} from '../sidemenu/view/SideMenuView';
import {java} from 'j4ts';
import {AutocompleteTreeView} from '../autocomplete/views/AutocompleteTreeView';
import {DropDownMultiLevelUi} from '../multi/view/DropDownMultiLevelUi';
import {DialogView} from '../modal/view/DialogView';
import {ProgressView} from '../progress/view/ProgressView';
import {TabUi} from '../tab/view/TabUi';
import {MainViewSlots} from '../BaseComponent';
import {TableTreeUi} from "../table/TableTreeUi";
import ArrayList = java.util.ArrayList;
import List = java.util.List;

export interface ComponentsViews {
    getButtonView(): ButtonView;

    getTextBoxView(): TextBoxView;

    getCheckBoxView(): CheckBoxView;

    getRegisteredViewFactoriesList(): SetMultimap<string, ViewFactory<any>>;

    getRegisteredTemplateList(): SetMultimap<string, TemplateMap>;

    getRadioView(): RadioView;

    getAccordionUi(): AccordionUi;

    getListUi(): ListUi;

    getAutocompleteView(): AutocompleteView<any>;

    getAutocompleteMultiSelectView<T>(tree: boolean): AutocompleteMultiSelectView<T>;

    getDropDownUi(): DropDownUi;

    getTooltipView(): TooltipView<MainViewSlots>;

    getPopoverView(): PopoverView;

    getTableUi(): TableUi;

    getTreeUi(): TreeUi;

    getSideMenuView(): SideMenuView;

    getTextAreaView(): TextBoxView;

    getAutocompleteTreeView(): AutocompleteTreeView<any>;

    getDropDownMultiLevelUi(): DropDownMultiLevelUi;

    getModalDialogView(): DialogView;

    getProgressView(): ProgressView;

    getTabUi(): TabUi;

    getIconRenderer(): IconRenderer;

    getPagerUi(): PagerUi<any>;

    getTableTreeUi(): TableTreeUi;

    getTreeGroupBy(rootView: TableView): TableTreeUi;

    getFilterPanelListView(): FilterPanelView<any>;
}

export interface ViewFactory<T extends View> extends PluginHelper {
    getView(attributes: Map<string, string>, templateElement: HTMLTemplateElement): T;
}

export class TemplateMap {
    id: string;
    template: HTMLTemplateElement;

    constructor(id: string, template: HTMLTemplateElement) {
        this.id = id;
        this.template = template;
    }
}

// export abstract class HasName {
//     protected name: string;
//
//     constructor() ;
//     constructor(name: string) ;
//     constructor(name?: string) {
//         this.name = name;
//     }
//
//     setName(name: string): void {
//         this.name = name;
//     }
//
//     getName(): string {
//         return this.name;
//     }
//
//     toString(): string {
//         return this.name;
//     }
// }

export class EnumLookUp<E> {

    private stringValueMap = new Map<string, E>();

    public putValue(name: string, value: E) {
        this.stringValueMap.set(name, value);
    }

    public getValue(str: string): E {
        return this.stringValueMap.get(str);
    }

    public toStringList(): List<String> {
        return new ArrayList<String>(this.stringValueMap.keys());
    }

    public init(clazz: any): void {
        initClassMap(clazz, <any>this.stringValueMap);
    }
}

export function initClassMap(clazz: any, map: Map<string, any>) {
    let keys = Object.keys(clazz);
    let values = Object.values(clazz);
    for (let i = 0; i < keys.length; i++) {
        if (keys[i] === 'lookUp')
            break;
        // if (clazz instanceof HasName)
        //     (<HasName>values[i]).setName(keys[i]);
        map.set(keys[i], values[i]);
    }
}

export interface IconRenderer {
    render(element: HTMLElement, icon: string): void;
}
