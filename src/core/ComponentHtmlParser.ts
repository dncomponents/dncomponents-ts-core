import {BaseComponent} from './BaseComponent';
import {IsElement} from './corecls/IsElement';
import {Util} from './corecls/Util';
import {ItemId} from './corecls/entities';
import {View} from './corecls/View';
import {Ui} from './views/Ui';

export abstract class ComponentHtmlParser implements HtmlParser<BaseComponent<any, any>> {

    public static VIEW = 'view';
    public static TEMPLATE_ID = 'template-id';

    public static ITEM_ID = 'itemId';
    public static CONTENT = 'content';

    public static ITEM = 'item';


    arguments = new Map<string, Array<string>>();
    tags = new Map<string, Array<string>>();

    abstract getClazz(): string;

    abstract getId(): string;

    getArguments(): Map<string, Array<String>> {
        return this.arguments;
    }

    getTags(): Map<String, Array<String>> {
        return this.tags;
    }

    abstract parse(htmlElement: Element, elements: Map<String, any>): BaseComponent<any, any>;

    replaceAndCopy(element1: Element, element2: IsElement<any>): void {
        Util.copyAllAttributes(element1, element2.asElement());
        Util.replace(element2.asElement(), element1);
        addStyle(element1, element2.asElement());
        copyStyle(element1, element2.asElement());
    }

    getIdItem(element: Element): ItemId {
        let idItem = new ItemId();
        idItem.setId(this.getElementId(element));
        idItem.setContent(element.innerHTML);
        if (element.hasAttribute(CONTENT)) {
            idItem.setContent(element.getAttribute(CONTENT));
        }
        if (element.hasAttribute(ICON)) {
            idItem.setIcon(element.getAttribute(ICON));
        }
        return idItem;
    }

    getElementId(element: Element): string {
        if (element.hasAttribute(ITEM_ID))
            return element.getAttribute(ITEM_ID);
        else
            return null;
    }

    getView<T extends View>(viewClazz: string, html: Element, elements: Map<String, any>): T {
        let viewAttr = html.getAttribute(VIEW);
        let templateId = html.getAttribute(TEMPLATE_ID);

        if (viewAttr == null)
            viewAttr = 'default';

        let template: HTMLTemplateElement = null;

        if (elements.get(templateId) != null)
            template = <HTMLTemplateElement>elements.get(templateId);

        let f = Ui.get().getRegisteredViewFactoriesList();
        let t = Ui.get().getRegisteredTemplateList();
        let viewFactories = f.get(viewClazz);

        if (viewFactories == null) {
            console.log('No ViewFactory for view: ' + viewClazz);
            return null;
        }
        let view = null;

        for (let viewFactory of viewFactories) {
            if (viewFactory.getId().toLowerCase() === viewAttr.toLowerCase()) {
                let templates = t.get(viewFactory.getClazz());
                for (let temp of templates) {
                    if (temp.id === templateId) {
                        template = temp.template;
                    }
                }
                view = viewFactory.getView(Util.getAllAttributes(html), template);
            }
        }
        return <T>view;
    }
}

export interface HtmlParser<T> extends PluginHelper {
    parse(htmlElement: Element, elements: Map<String, any>): T;
}

export interface PluginHelper {
    getId(): string;

    getClazz(): string;

    // getArguments(): Map<string, Array<String>>;
    //
    // getTags(): Map<String, Array<String>>;
}

export const VIEW = 'view';
export const TEMPLATE_ID = 'template-id';
export const ITEM_ID = 'itemId';
export const CONTENT = 'content';
export const ICON = 'icon';
export const ITEM = 'item';

export function copyStyle(element1: Element, element2: Element): void {
    let style: string = element1.getAttribute('class');
    if (style != null)
        element2.className = style;
}

export function addStyle(element1: Element, element2: Element): void {
    let style = element1.getAttribute('addclass');
    if (style != null) {
        if (style.includes(' ')) {
            let words = style.split(' ');
            for (let word of words) {
                if (word.length != 0)
                    element2.classList.add(word);
            }
        } else {
            element2.classList.add(style);
        }
        element2.removeAttribute('addclass');
    }
}

// export abstract class AbstractPluginHelper implements PluginHelper {
//
//     arguments = new Map<string, Array<string>>();
//     tags = new Map<string, Array<string>>();
//
//     getArguments(): Map<String, Array<String>> {
//         return this.arguments;
//     }
//
//     getTags(): Map<String, Array<String>> {
//         return this.tags;
//     }
//
//     abstract getClazz(): string;
//
//     abstract getId(): string;
// }
