import {IsElement} from './corecls/IsElement';
import {HtmlParserService} from './HtmlParserService';
import {Ui} from './views/Ui';
import {DnI18e} from './corecls/DnI18e';

export class TemplateParser {

    private templateElement: HTMLTemplateElement;

    private elementsMap = new Map();

    private clonedNode: Node;

    private templateContent: string;

    private clazz = '';

    target: Object;

    constructor(templateElement: HTMLTemplateElement);
    constructor(templateElement: HTMLTemplateElement, target?: Object, init?: boolean);
    constructor(templateElement: HTMLTemplateElement, target?: Object, init?: boolean) {
        this.templateElement = templateElement;
        if (target)
            this.target = target;
        if (init) this.init();
    }

    public static create(templateElement: HTMLTemplateElement, target?: Object, init?: boolean): TemplateParser {
        if (templateElement == null)
            throw new Error('templateElement can\'t be null');
        let templateParser = new TemplateParser(templateElement, target, init);
        return templateParser;
    }


    bindFields(): TemplateParser {
        for (let key of this.elementsMap.keys()) {
            /** // @ts-ignore */
            // @ts-ignore
            if (this.target.prototype[key] != null) {
                /** // @ts-ignore */
                // @ts-ignore
                this.target.prototype[key] = this.getElement(key);
            }
        }
        return this;
    }

    public bind(): TemplateParser {
        for (let key of this.elementsMap.keys()) {
            /** // @ts-ignore */
            // @ts-ignore
            if (this.target[key] == '!style!') {
                let str = '';
                /** // @ts-ignore */
                // @ts-ignore
                if (this.getElement(key).classList) {
                    /** // @ts-ignore */
                    // @ts-ignore
                    for (let cl of this.getElement(key).classList) {
                        str += cl + ' ';
                    }
                    str = str.trim();
                }
                /** // @ts-ignore */
                // @ts-ignore
                this.target[key] = str;
                /** // @ts-ignore */
                // @ts-ignore
            } else if (this.target[key] != null) {
                /** // @ts-ignore */
                // @ts-ignore
                this.target[key] = this.getElement(key);
            }
        }
        return this;
    }


    private init(): void {
        HtmlParserService.getInstance();
        if (this.templateElement == null)
            if (this.templateContent != null && this.templateContent.startsWith('#')) { //id of template
                var str = this.templateContent.substring(1);
                this.templateElement = (<HTMLTemplateElement>document.getElementById(str));
            } else {
                this.templateElement = (<HTMLTemplateElement>document.createElement('template'));
                this.templateElement.innerHTML = this.templateContent;
            }
        this.elementsMap.clear();
        // this.i18e(this.templateElement);
        this.clonedNode = this.templateElement.content.cloneNode(true);
        this.parseTemplates(TEMPLATE_KEY, this.clonedNode);
        this.parseElements(KEY, this.clonedNode);
        this.parseOther(KEY, this.clonedNode);
        this.clearKeyTags(KEY, this.getCloned());
    }


    public getElement<T>(id: string): T {
        return this.elementsMap.get(id);
    }


    public getHTMLElement<T extends Element>(id: string): T {
        return this.elementsMap.get(id);
    }


    public getIsElement<T extends IsElement<any>>(id: string): T {
        return this.elementsMap.get(id);
    }


    public getStyle(id: string): string {
        return this.elementsMap.get(id);
    }


    public getCloned(): Node {
        return this.clonedNode;
    }


    private mapCustomElements(key: string, root: Element): Map<String, any> {

        let result: Map<string, any>;
        let allElements = root.querySelectorAll('*');
        for (let i = 0; i < allElements.length; i++) {
            const at = allElements[i];
            if (HtmlParserService.isComponentParserTag(at)) {
                result = new Map<string, any>();
                let value = at.getAttribute(key);
                if (this.elementsMap.has(key))
                    throw new Error('You can\'t have duplicate ui-field: ' + value + ' for class: ' + this.clazz);
                let component = HtmlParserService.getComponentParser(at.tagName).parse(at, this.elementsMap);
                if (component != null) {
                    if (value != null)
                        result.set(value, component);
                }
                component.asElement().removeAttribute(key);
                break;

            }
        }
        return result;
    }

    private parseElements(key: string, r: Node): void {
        var root: Element = <Element>r;
        while (true) {
            var mapCustomElements = this.mapCustomElements(key, root);
            if (mapCustomElements == null) {
                break;
            }
            mapCustomElements.forEach((value, key1) => this.elementsMap.set(key1, value));
        }

        let result: Map<string, string>;
        let elements = root.querySelectorAll('*');
        for (let i = 0; i < elements.length; i++) {
            let at = elements[i];
            if (at.attributes == null || at.attributes.length == 0) continue;
            let value = at.getAttribute(key);
            if (this.elementsMap.has(key))
                throw new Error('You can\'t have duplicate ui-field: ' + value + ' for class: ' + this.clazz);
            if (value != null) {
                this.elementsMap.set(value, at);
            }
        }
    }

    private parseTemplates(key: string, r: Node): void {
        var root: Element = <Element>r;
        let elements = root.querySelectorAll('*');
        for (var i = 0; i < elements.length; i++) {
            var at = elements[i];
            let value = at.getAttribute(key);
            if (value != null)
                this.elementsMap.set(value, at);
        }
    }

    static getTemplate(template: string): HTMLTemplateElement {
        let htmlTemplateElement = document.createElement('template');
        htmlTemplateElement.innerHTML = template;
        return htmlTemplateElement;
    }

    parseOther(key: string, root: Node): void {
        let elements = (<Element>root).querySelectorAll('*');
        for (var i = 0; i < elements.length; i++) {
            var at = elements[i];
            if (HtmlParserService.isParserTag(at)) {
                let parsed = HtmlParserService.getParser(at.tagName).parse(at, this.elementsMap);
                let value = at.getAttribute(key);
                if (parsed != null && value != null) {
                    this.elementsMap.set(value, parsed);
                }
            }
        }
    }

    private i18e(template: HTMLTemplateElement): void {
        if (template != null && template.innerHTML.includes(DnI18e.START_TAG)) {
            let content = template.innerHTML;
            do {
                let between = DnI18e.getBetween(content, DnI18e.START_TAG, DnI18e.END_TAG);
                if (between == null || between.length == 0)
                    break;
                let value = DnI18e.get().getValue(between);
                content = content.replace(DnI18e.START_TAG + between + DnI18e.END_TAG, value);
            } while (true);
            template.innerHTML = content;
        }
    }

    clearKeyTags(key: string, r: Node): void {
        let elements = (<Element>r).querySelectorAll('*');
        for (var i = 0; i < elements.length; i++) {
            var at = elements[i];
            if (at.hasAttribute(KEY) && Ui.isDebug()) {
                at.setAttribute('ui-field-debug', at.getAttribute(KEY));
            }
            at.removeAttribute(key);
        }

    }
}

export function getTemplate(t: string): HTMLTemplateElement {
    let htmlTemplateElement = document.createElement('template');
    htmlTemplateElement.innerHTML = t;
    return htmlTemplateElement;
}

export const KEY: string = 'ui-field';
export const TEMPLATE_KEY: string = 'ui-template';
export const STYLE_TAG: string = 'style-item';


export function UiField(target: any, key: string) {
    Object.defineProperty(target, key, {
        value: new Object(),
        writable: true
    });
}

export function UiStyle(target: any, key: string) {
    Object.defineProperty(target, key, {
        value: '!style!',
        writable: true
    });
}

export function Template(markup: string, pars?: TemplateParser) {
    return (target: any) => {
        let parser = new TemplateParser(TemplateParser.getTemplate(markup), target, true);
        parser.bindFields();
        Object.defineProperty(target, 'parser', {
            value: parser,
            writable: true
        });
        pars = parser;
        // implement class decorator here, the class decorator
        // will have access to the decorator arguments (obj)
        // because they are  stored in a closure
    };
}