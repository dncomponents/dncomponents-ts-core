export class Template {

    private clonedNode: HTMLElement;
    //this is document fragment after clone. and after apending it becomes empty.
    // getElementsT call before attach, after that use host as a root
    private templateElement: HTMLTemplateElement;
    private hostStyle: string;
    private stylesMap: Map<string, string>;
    private elementsNames: any;

    constructor(private templateContent: string) {
        if (templateContent.startsWith('#')) { // id of template
            var str = templateContent.substring(1);
            this.templateElement = <HTMLTemplateElement>document.getElementById(str);
        } else {
            this.templateElement = document.createElement('template');
            this.templateElement.innerHTML = templateContent;
        }
        this.stylesMap = getStylesFromTemplate(STYLE_TAG, STYLE_TAG_NAME_KEY, STYLE_TAG_STYLE_CLASSNAME_KEY, this.templateElement.content);
        this.hostStyle = getHostStyle(HOST_TAG, HOST_TAG_STYLE_KEY, this.templateElement.content);
        this.clonedNode = <HTMLElement>this.templateElement.content.cloneNode(true);
        this.elementsNames = getAllElementsFromTemplateString(KEY, this.templateElement.content);
    }

    public getElementT<T extends HTMLElement>(id: string): T {
        return <T>getElementFromTemplate(id, this.clonedNode);
        // return <T>this.elementsMap.get(id);
    }

    getClonedNode(): HTMLElement {
        // if (this.clonedNode == null) {
        //     // this.clonedNode = <HTMLElement>this.templateElement.content.cloneNode(true);
        // }
        return this.clonedNode;
    }

    getStyle(key: string): string {
        let style = this.stylesMap.get(key);
        if (style == null)
            throw new DOMException('No style name for key ' + key + '. Please check template, might be a typo!');
        return style;
    }

    getHostStyle(): string {
        return this.hostStyle;
    }

    getElementsNames(): Array<string> {
        return this.elementsNames;
    }
}

export const KEY: string = 'ui-field';
export const HOST_TAG: string = 'style-host';
export const HOST_TAG_STYLE_KEY: string = 'class';
export const STYLE_TAG: string = 'style-item';
export const STYLE_TAG_NAME_KEY: string = 'name';
export const STYLE_TAG_STYLE_CLASSNAME_KEY: string = 'class';

export function getHostStyle(tag: string, keyClass: string, root: DocumentFragment): string {
    let elements = root.querySelectorAll('*');
    let clazzResult;
    for (var i = 0; i < elements.length; i++) {
        var at = elements[i];
        if (at.tagName.toLowerCase() != tag.toLowerCase() || at.attributes == null || at.attributes.length < 1) continue;
        let clazz = at.getAttribute(keyClass);
        if (clazz != null) {
            clazzResult = clazz;
            at.remove();
        }
    }
    return clazzResult;
}

export function getStylesFromTemplate(tag: string, keyName: string, keyClassName: string, root: DocumentFragment): Map<string, string> {
    let elements = root.querySelectorAll('*');
    let map: Map<string, string> = new Map<string, string>();
    for (var i = 0; i < elements.length; i++) {
        var at = elements[i];
        if (at.tagName.toLowerCase() != tag.toLowerCase() || at.attributes == null || at.attributes.length < 2) continue;
        let name = at.getAttribute(keyName);
        let className = at.getAttribute(keyClassName);
        if (name != null && className != null) {
            map.set(name, className);
            at.remove();
        }
    }
    return map;
}

export function getElementFromTemplate<T extends HTMLElement>(id: string, root: HTMLElement): T {
    var result: HTMLElement;
    let elements = root.querySelectorAll('*');

    for (var i = 0; i < elements.length; i++) {
        var at = elements[i];
        if (at.attributes == null || at.attributes.length == 0) continue;
        let value = at.getAttribute(KEY);
        // tslint:disable-next-line:triple-equals
        if (value != null && value == id) {
            result = <HTMLElement>at;
            break;
        }
    }
    if (result == null)
        throw new DOMException('No element with ' + id + ' ui-field. Please check template, might be a typo!');
    return <T>result;
}

export function getAllElementsFromTemplateString(key: string, root: DocumentFragment): Array<string> {

    let elements = root.querySelectorAll('*');
    let result: Array<string> = new Array<string>();

    for (var i = 0; i < elements.length; i++) {
        var at = <HTMLElement>elements[i];
        if (at.attributes == null || at.attributes.length == 0) continue;
        let value = at.getAttribute(key);
        if (value != null) {
            result.push(value);
        }
    }
    return result;
}