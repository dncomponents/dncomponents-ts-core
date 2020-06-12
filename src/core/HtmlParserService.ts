import {ComponentHtmlParser, HtmlParser} from './ComponentHtmlParser';
import {ButtonHtmlParser} from './button/Button';
import {TextBoxHtmlParser} from './textbox/TextBox';
import {CheckBoxHtmlParser} from './checkbox/CheckBox';
import {CheckBoxSelectionGroupHtmlParser} from './checkbox/checkbox_radio';
import {RadioHtmlParser, RadioSelectionGroupHtmlParser} from './checkbox/Radio';
import {AccordionHtmlParser} from './accordion/Accordion';
import {ListHtmlParser} from './list/ListData';
import {AutocompleteHtmlParser} from './autocomplete/Autocomplete';
import {AutocompleteMultiSelectHtmlParser} from './autocomplete/AutocompleteMultiSelect';
import {SideMenuHtmlParser} from './sidemenu/SideMenu';
import {TextAreaHtmlParser} from './textarea/TextArea';
import {TreeHtmlParser} from './tree/Tree';
import {AutocompleteTreeHtmlParser} from './autocomplete/AutocompleteTree';
import {AutocompleteTreeMultiSelectHtmlParser} from './autocomplete/AutocompleteTreeMultiSelect';
import {DropDownHtmlParser} from './dropdown/DropDown';
import {DropDownMultiLevelHtmlParser} from './multi/DropDownMultiLevel';
import {ModalDialogHtmlParser} from './modal/Dialog';
import {PopoverAfterHtmlParser, PopoverHtmlParser} from './popover/Popover';
import {ProgressHtmlParser} from './progress/Progress';
import {TabHtmlParser} from './tab/Tab';
import {TableHtmlParser} from './table/Table';
import {IntegerBoxHtmlParser} from './textbox/IntegerBox';
import {TooltipAfterHtmlParser, TooltipHtmlParser} from './tooltip/Tooltip';
import {DoubleBoxHtmlParser} from './textbox/DoubleBox';
import {DateBoxHtmlParser} from './textbox/DateBox';

export class HtmlParserService {
//     export const COMPONENT_HTML_PARSERS: Array<ComponentHtmlParser> = new Array<ComponentHtmlParser>()

    static COMPONENT_HTML_PARSERS: Array<ComponentHtmlParser> = new Array<ComponentHtmlParser>();
    static HTML_PARSERS: Array<HtmlParser<any>> = new Array<HtmlParser<any>>();
    // public static final List<HtmlParser> HTML_PARSERS = new ArrayList<>();
//     public static final List<HtmlParser> HTML_PARSERS_BEFORE = new ArrayList<>();
//
//     static {
//     register();
// }
//
    constructor() {
        HtmlParserService.register();
    }

    static instance: HtmlParserService;

    public static getInstance(): HtmlParserService {
        if (this.instance == null)
            this.instance = new HtmlParserService();
        return this.instance;
    }

    public static register(): void {
        HtmlParserService.COMPONENT_HTML_PARSERS.push(AccordionHtmlParser.getInstance());
        HtmlParserService.COMPONENT_HTML_PARSERS.push(TextBoxHtmlParser.getInstance());
        HtmlParserService.COMPONENT_HTML_PARSERS.push(TextAreaHtmlParser.getInstance());
        HtmlParserService.COMPONENT_HTML_PARSERS.push(TreeHtmlParser.getInstance());
        HtmlParserService.COMPONENT_HTML_PARSERS.push(AutocompleteTreeHtmlParser.getInstance());
        HtmlParserService.COMPONENT_HTML_PARSERS.push(AutocompleteTreeMultiSelectHtmlParser.getInstance());
        HtmlParserService.COMPONENT_HTML_PARSERS.push(DropDownHtmlParser.getInstance());
        HtmlParserService.COMPONENT_HTML_PARSERS.push(DropDownMultiLevelHtmlParser.getInstance());
        HtmlParserService.COMPONENT_HTML_PARSERS.push(ModalDialogHtmlParser.getInstance());
        HtmlParserService.COMPONENT_HTML_PARSERS.push(PopoverHtmlParser.getInstance());
        HtmlParserService.COMPONENT_HTML_PARSERS.push(ProgressHtmlParser.getInstance());
        HtmlParserService.COMPONENT_HTML_PARSERS.push(TabHtmlParser.getInstance());
        HtmlParserService.COMPONENT_HTML_PARSERS.push(TableHtmlParser.getInstance());
        HtmlParserService.COMPONENT_HTML_PARSERS.push(IntegerBoxHtmlParser.getInstance());
        HtmlParserService.COMPONENT_HTML_PARSERS.push(DoubleBoxHtmlParser.getInstance());
        HtmlParserService.COMPONENT_HTML_PARSERS.push(DateBoxHtmlParser.getInstance());
        HtmlParserService.COMPONENT_HTML_PARSERS.push(TooltipHtmlParser.getInstance());
//     COMPONENT_HTML_PARSERS.add(TextArea.TextAreaHtmlParser.getInstance());
//     COMPONENT_HTML_PARSERS.add(IntegerBox.IntegerBoxHtmlParser.getInstance());
//     COMPONENT_HTML_PARSERS.add(DoubleBox.DoubleBoxHtmlParser.getInstance());
//     COMPONENT_HTML_PARSERS.add(LongBox.LongBoxHtmlParser.getInstance());
//     COMPONENT_HTML_PARSERS.add(DateBox.DateBoxHtmlParser.getInstance());
        HtmlParserService.COMPONENT_HTML_PARSERS.push(ButtonHtmlParser.getInstance());
        HtmlParserService.COMPONENT_HTML_PARSERS.push(CheckBoxHtmlParser.getInstance());
        HtmlParserService.COMPONENT_HTML_PARSERS.push(RadioHtmlParser.getInstance());
        HtmlParserService.COMPONENT_HTML_PARSERS.push(ListHtmlParser.getInstance());
        HtmlParserService.COMPONENT_HTML_PARSERS.push(AutocompleteHtmlParser.getInstance());
        HtmlParserService.COMPONENT_HTML_PARSERS.push(AutocompleteMultiSelectHtmlParser.getInstance());
//     COMPONENT_HTML_PARSERS.add(Tab.TabHtmlParser.getInstance());
//     COMPONENT_HTML_PARSERS.add(Progress.ProgressHtmlParser.getInstance());
//     COMPONENT_HTML_PARSERS.add(DropDown.DropDownHtmlParser.getInstance());
//     COMPONENT_HTML_PARSERS.add(Popover.PopoverHtmlParser.getInstance());
//     COMPONENT_HTML_PARSERS.add(Tooltip.TooltipHtmlParser.getInstance());
//     COMPONENT_HTML_PARSERS.add(ModalDialog.ModalDialogHtmlParser.getInstance());
//     //
        HtmlParserService.HTML_PARSERS.push(RadioSelectionGroupHtmlParser.getInstance());
        HtmlParserService.HTML_PARSERS.push(CheckBoxSelectionGroupHtmlParser.getInstance());
        HtmlParserService.HTML_PARSERS.push(SideMenuHtmlParser.getInstance());
        HtmlParserService.HTML_PARSERS.push(PopoverAfterHtmlParser.getInstance());
        HtmlParserService.HTML_PARSERS.push(TooltipAfterHtmlParser.getInstance());

//     HTML_PARSERS.add(StyleHtmlParser.getInstance());
//     HTML_PARSERS.add(ValueHtmlParser.getInstance());
//     HTML_PARSERS.add(Popover.PopoverAfterHtmlParser.getInstance());
//     HTML_PARSERS.add(Tooltip.TooltipAfterHtmlParser.getInstance());
    }

//
    public static getComponentParser(tag: string): ComponentHtmlParser {
        return this.getParserArr(tag, this.COMPONENT_HTML_PARSERS);
    }

//
    public static getParser(tag: string): HtmlParser<any> {
        return this.getParserArr(tag, this.HTML_PARSERS);
    }

//
    public static isComponentParserTag(element: Element): boolean {
        return this.isParserTagAr(element, this.COMPONENT_HTML_PARSERS);
    }

//
    public static isParserTag(element: Element): boolean {
        return this.isParserTagAr(element, this.HTML_PARSERS);
    }

//
    private static getParserArr<T extends HtmlParser<any>>(tag: string, parsers: Array<T>): T {
        for (let parser of parsers) {
            if (parser.getId().toLowerCase() === tag.toLowerCase())
                return parser;
        }
        return null;
    }

//
    private static isParserTagAr(element: Element, parsers: Array<HtmlParser<any>>): boolean {
        for (let parser of parsers) {
            if (parser.getId().toLowerCase() === element.tagName.toLowerCase())
                return true;
        }
        return false;
    }

//
}