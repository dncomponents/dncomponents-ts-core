import {IsElement} from './IsElement';
import {EventHandler, HandlerRegistration} from './events';
import {java} from 'j4ts';
import NullPointerException = java.lang.NullPointerException;

export class Util {
    static remove<T>(item: T, arr: Array<T>) {
        arr.splice(arr.indexOf(item), 1);
    }

    static addAll<T>(arr1: Array<T>, arr2: Array<T>) {
        arr1.concat(arr2);
    }

    static addHandler(element: HTMLElement, handler: EventHandler<any>): HandlerRegistration {
        return handler.addTo(element);
    }

    static copyAllAttributes(element1: Element, element2: HTMLElement) {
        for (let s of element1.getAttributeNames()) {
            element2.setAttribute(s, element1.getAttribute(s));
        }
    }

    static replace(n1: Object, n2: Object) {
        if (n1 == null || n2 == null) return;
        Util.copyAllAttributes(this.asHtmlElement(n2), this.asHtmlElement(n1));
        this.replaceEl(this.asHtmlElement(n1), this.asHtmlElement(n2));
    }

    static replaceEl(n1: Element, n2: Element) {
        let parent = n2.parentNode;
        n1.className = n1.className + ' ' + n2.className;
        parent.replaceChild(n1, n2);
    }

    static asHtmlElement(obj: Object): HTMLElement {
        let n1: HTMLElement;
        if ((obj as IsElement<any>).asElement) {
            n1 = (obj as IsElement<any>).asElement();
        } else if (obj instanceof HTMLElement) {
            n1 = <HTMLElement>obj;
        }
        return n1;
    }

    static getAllAttributes(html: Element) {
        let map = new Map<string, string>();
        for (let s of html.getAttributeNames()) {
            map.set(s, html.getAttribute(s));
        }
        return map;
    }

    static unwrap(element: Element): Node {
        let fragment: DocumentFragment = document.createDocumentFragment();
        while (element.firstChild != null) {
            fragment.appendChild(element.firstChild);
        }
        return element.parentNode.replaceChild(fragment, element);
    }

    static isDescendant(parent: Element, child: Element) {
        let node = child.parentNode;
        while (node != null) {
            if (node == parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }

    public static addStyle(element: HTMLElement, style: string) {
        Util.checkArgumentsAndTrim(element, style);
        element.classList.remove(style);
    }

    public static removeStyle(element: HTMLElement, style: string) {
        Util.checkArgumentsAndTrim(element, style);
        element.classList.remove(style);
    }


    static isNumber(x: any): x is number {
        return typeof x === 'number';
    }

    static isString(x: any): x is string {
        return typeof x === 'string';
    }


    public static createElement<T extends HTMLElement>(tag: string): T {
        return document.createElement(tag) as T;
    }


    public static createDiv(innerHtml?: string): HTMLDivElement {
        if (innerHtml) {
            let div = this.createElement('div');
            div.innerHTML = innerHtml;
            return <HTMLDivElement>div;
        }
        return this.createElement('div');
    }


    public static createH1(): HTMLHeadingElement {
        return Util.createElement('h1');
    }

    public static createH2(): HTMLHeadingElement {
        return Util.createElement('h2');
    }

    public static createH3(): HTMLHeadingElement {
        return Util.createElement('h3');
    }

    public static createH4(): HTMLHeadingElement {
        return Util.createElement('h4');
    }

    public static createTemplate(): HTMLTemplateElement {
        return Util.createElement('template');
    }

    public static createDiv$(): HTMLDivElement {
        return Util.createElement('div');
    }

    public static createBody(): HTMLBodyElement {
        return Util.createElement('body');
    }

    public static createAddress(): HTMLElement {
        return Util.createElement('address');
    }

    public static createArticle(): HTMLElement {
        return Util.createElement('article');
    }

    public static createAside(): HTMLElement {
        return Util.createElement('aside');
    }

    public static createFooter(): HTMLElement {
        return Util.createElement('footer');
    }

    public static createHgroup(): HTMLElement {
        return Util.createElement('hgroup');
    }

    public static createHeader(): HTMLElement {
        return Util.createElement('header');
    }

    public static createNav(): HTMLElement {
        return Util.createElement('nav');
    }

    public static createSection(): HTMLElement {
        return Util.createElement('section');
    }

    public static createBlockquote(): HTMLQuoteElement {
        return Util.createElement('blockquote');
    }

    public static createDd(): HTMLElement {
        return Util.createElement('dd');
    }

    public static createDl(): HTMLElement {
        return Util.createElement('dl');
    }

    public static createDt(): HTMLElement {
        return Util.createElement('dt');
    }

    public static createFigcaption(): HTMLElement {
        return Util.createElement('figcaption');
    }

    public static createFigure(): HTMLElement {
        return Util.createElement('figure');
    }

    public static createHr(): HTMLHRElement {
        return Util.createElement('hr');
    }

    public static createLi(): HTMLLIElement {
        return Util.createElement('li');
    }

    public static createMain(): HTMLElement {
        return Util.createElement('main');
    }

    public static createOl(): HTMLOListElement {
        return Util.createElement('ol');
    }

    public static createP(): HTMLParagraphElement {
        return Util.createElement('p');
    }

    public static createPre(): HTMLPreElement {
        return Util.createElement('pre');
    }

    public static createUl(): HTMLUListElement {
        return Util.createElement('ul');
    }

    public static createA(): HTMLAnchorElement {
        return Util.createElement('a');
    }

    public static createAbbr(): HTMLElement {
        return Util.createElement('abbr');
    }

    public static createB(): HTMLElement {
        return Util.createElement('b');
    }

    public static createBr(): HTMLBRElement {
        return Util.createElement('br');
    }

    public static createCite(): HTMLElement {
        return Util.createElement('cite');
    }

    public static createCode(): HTMLElement {
        return Util.createElement('code');
    }

    public static createDfn(): HTMLElement {
        return Util.createElement('dfn');
    }

    public static createEm(): HTMLElement {
        return Util.createElement('em');
    }

    public static createI(): HTMLElement {
        return Util.createElement('i');
    }

    public static createKbd(): HTMLElement {
        return Util.createElement('kbd');
    }

    public static createMark(): HTMLElement {
        return Util.createElement('mark');
    }

    public static createQ(): HTMLQuoteElement {
        return Util.createElement('q');
    }

    public static createSmall(): HTMLElement {
        return Util.createElement('small');
    }

    public static createSpan(): HTMLElement {
        return Util.createElement('span');
    }

    public static createStrong(): HTMLElement {
        return Util.createElement('strong');
    }

    public static createSub(): HTMLElement {
        return Util.createElement('sub');
    }

    public static createSup(): HTMLElement {
        return Util.createElement('sup');
    }

    public static createTime(): HTMLElement {
        return Util.createElement('time');
    }

    public static createU(): HTMLElement {
        return Util.createElement('u');
    }

    public static createVar(): HTMLElement {
        return Util.createElement('var');
    }

    public static createWbr(): HTMLElement {
        return Util.createElement('wbr');
    }

    public static createArea(): HTMLAreaElement {
        return Util.createElement('area');
    }

    public static createAudio(): HTMLAudioElement {
        return Util.createElement('audio');
    }

    public static createImg(): HTMLImageElement {
        return Util.createElement('img');
    }

    public static createMap(): HTMLMapElement {
        return Util.createElement('map');
    }

    public static createTrack(): HTMLTrackElement {
        return Util.createElement('track');
    }

    public static createVideo(): HTMLVideoElement {
        return Util.createElement('video');
    }

    public static createCanvas(): HTMLCanvasElement {
        return Util.createElement('canvas');
    }

    public static createEmbed(): HTMLEmbedElement {
        return Util.createElement('embed');
    }

    public static createObject(): HTMLObjectElement {
        return Util.createElement('object');
    }

    public static createParam(): HTMLParamElement {
        return Util.createElement('param');
    }

    public static createSource(): HTMLSourceElement {
        return Util.createElement('source');
    }

    public static createNoscript(): HTMLElement {
        return Util.createElement('noscript');
    }

    public static createScript(): HTMLScriptElement {
        return Util.createElement('script');
    }

    public static createDel(): HTMLModElement {
        return Util.createElement('del');
    }

    public static createIns(): HTMLModElement {
        return Util.createElement('ins');
    }

    public static createCaption(): HTMLTableCaptionElement {
        return Util.createElement('caption');
    }

    public static createCol(): HTMLTableColElement {
        return Util.createElement('col');
    }

    public static createColgroup(): HTMLTableColElement {
        return Util.createElement('colgroup');
    }

    public static createTable(): HTMLTableElement {
        return Util.createElement('table');
    }

    public static createTbody(): HTMLTableSectionElement {
        return Util.createElement('tbody');
    }

    public static createTd(): HTMLTableCellElement {
        return Util.createElement('td');
    }

    public static createTfoot(): HTMLTableSectionElement {
        return Util.createElement('tfoot');
    }

    public static createTh(): HTMLTableCellElement {
        return Util.createElement('th');
    }

    public static createThead(): HTMLTableSectionElement {
        return Util.createElement('thead');
    }

    public static createTr(): HTMLTableRowElement {
        return Util.createElement('tr');
    }

    public static createButton(): HTMLButtonElement {
        return Util.createElement('button');
    }

    public static createDatalist(): HTMLDataListElement {
        return Util.createElement('datalist');
    }

    public static createFieldset(): HTMLFieldSetElement {
        return Util.createElement('fieldset');
    }

    public static createForm(): HTMLFormElement {
        return Util.createElement('form');
    }

    public static createLabel(): HTMLLabelElement {
        return Util.createElement('label');
    }

    public static createLegend(): HTMLLegendElement {
        return Util.createElement('legend');
    }

    public static createMeter(): HTMLMeterElement {
        return Util.createElement('meter');
    }

    public static createOptgroup(): HTMLOptGroupElement {
        return Util.createElement('optgroup');
    }

    public static createOption(): HTMLOptionElement {
        return Util.createElement('option');
    }

    public static createOutput(): HTMLOutputElement {
        return Util.createElement('output');
    }

    public static createProgress(): HTMLProgressElement {
        return Util.createElement('progress');
    }

    public static createSelect(): HTMLSelectElement {
        return Util.createElement('select');
    }

    public static createTextarea(): HTMLTextAreaElement {
        return Util.createElement('textarea');
    }

    public static setVisible(element: HTMLElement, visible: boolean) {
        element.style.display = visible ? '' : 'none';
    }

    public static setElementStyleProperty(element: HTMLElement, property: string, value: string) {
        element.style.setProperty(property, value);
    }

    public static setPadding(element: HTMLElement, padding: string) {
        Util.setElementStyleProperty(element, 'padding', padding);
    }

    public static setPaddingLeft(element: HTMLElement, padding: string) {
        Util.setElementStyleProperty(element, 'padding-left', padding);
    }

    public static setPaddingRight(element: HTMLElement, padding: string) {
        Util.setElementStyleProperty(element, 'padding-right', padding);
    }

    public static setPaddingBottom(element: HTMLElement, padding: string) {
        Util.setElementStyleProperty(element, 'padding-bottom', padding);
    }

    public static setPaddingTop(element: HTMLElement, padding: string) {
        Util.setElementStyleProperty(element, 'padding-top', padding);
    }

    public static setBackgroundColor(element: HTMLElement, color: string) {
        Util.setElementStyleProperty(element, 'background-color', color);
    }

    public static setMaxHeight(element: HTMLElement, height: string) {
        Util.setElementStyleProperty(element, 'max-height', height);
    }

    public static setMinHeight(element: HTMLElement, height: string) {
        Util.setElementStyleProperty(element, 'min-height', height);
    }

    public static setHeight(element: HTMLElement, height: string) {
        Util.setElementStyleProperty(element, 'height', height);
    }

    public static setWidth(element: HTMLElement, width: string) {
        Util.setElementStyleProperty(element, 'width', width);
    }

    public static setAlignContent(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'align-content', value);
    }

    public static alignItems(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'align-items', value);
    }

    public static alignSelf(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'align-self', value);
    }

    public static azimuth(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'azimuth', value);
    }

    public static backfaceVisibility(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'backface-visibility', value);
    }

    public static background(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'background', value);
    }

    public static backgroundAttachment(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'background-attachment', value);
    }

    public static backgroundColor(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'background-color', value);
    }

    public static backgroundImage(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'background-image', value);
    }

    public static backgroundPosition(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'background-position', value);
    }

    public static backgroundRepeat(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'background-repeat', value);
    }

    public static backgroundSize(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'background-size', value);
    }

    public static border(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'border', value);
    }

    public static borderBottom(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'border-bottom', value);
    }

    public static borderBottomColor(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'border-bottom-color', value);
    }

    public static borderBottomLeftRadius(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'border-bottom-left-radius', value);
    }

    public static borderBottomRightRadius(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'border-bottom-right-radius', value);
    }

    public static borderBottomStyle(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'border-bottom-style', value);
    }

    public static borderBottomWidth(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'border-bottom-width', value);
    }

    public static borderCollapse(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'border-collapse', value);
    }

    public static borderColor(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'border-color', value);
    }

    public static borderImage(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'border-image', value);
    }

    public static borderImageOutset(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'border-image-outset', value);
    }

    public static borderImageRepeat(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'border-image-repeat', value);
    }

    public static borderImageSlice(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'border-image-slice', value);
    }

    public static borderImageSource(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'border-image-source', value);
    }

    public static borderImageWidth(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'border-image-width', value);
    }

    public static borderLeft(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'border-left', value);
    }

    public static borderTopColor(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'border-top-color', value);
    }

    public static borderTop(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'border-top', value);
    }

    public static borderStyle(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'border-style', value);
    }

    public static borderSpacing(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'border-spacing', value);
    }

    public static borderRightWidth(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'border-right-width', value);
    }

    public static borderRightStyle(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'border-right-style', value);
    }

    public static borderRightColor(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'border-right-color', value);
    }

    public static borderRight(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'border-right', value);
    }

    public static borderRadius(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'border-radius', value);
    }

    public static borderLeftWidth(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'border-left-width', value);
    }

    public static borderLeftStyle(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'border-left-style', value);
    }

    public static borderLeftColor(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'border-left-color', value);
    }

    public static borderWidth(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'border-width', value);
    }

    public static borderTopWidth(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'border-top-width', value);
    }

    public static borderTopStyle(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'border-top-style', value);
    }

    public static borderTopRightRadius(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'border-top-right-radius', value);
    }

    public static borderTopLeftRadius(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'border-top-left-radius', value);
    }

    public static bottom(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'bottom', value);
    }

    public static boxShadow(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'box-shadow', value);
    }

    public static boxSizing(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'box-sizing', value);
    }

    public static captionSide(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'caption-side', value);
    }

    public static clear(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'clear', value);
    }

    public static clip(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'clip', value);
    }

    public static color(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'color', value);
    }

    public static content(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'content', value);
    }

    public static counterIncrement(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'counter-increment', value);
    }

    public static counterReset(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'counter-reset', value);
    }

    public static cssFloat(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'css-float', value);
    }

    public static cssText(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'css-text', value);
    }

    public static cue(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'cue', value);
    }

    public static cueAfter(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'cue-after', value);
    }

    public static cueBefore(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'cue-before', value);
    }

    public static cursor(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'cursor', value);
    }

    public static direction(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'direction', value);
    }

    public static display(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'display', value);
    }

    public static elevation(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'elevation', value);
    }

    public static emptyCells(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'empty-cells', value);
    }

    public static flex(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'flex', value);
    }

    public static flexBasis(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'flex-basis', value);
    }

    public static flexDirection(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'flex-direction', value);
    }

    public static flexFlow(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'flex-flow', value);
    }

    public static flexGrow(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'flex-grow', value);
    }

    public static flexShrink(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'flex-shrink', value);
    }

    public static flexWrap(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'flex-wrap', value);
    }

    public static font(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'font', value);
    }

    public static fontFamily(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'font-family', value);
    }

    public static fontSize(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'font-size', value);
    }

    public static fontSizeAdjust(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'font-size-adjust', value);
    }

    public static fontStretch(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'font-stretch', value);
    }

    public static fontStyle(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'font-style', value);
    }

    public static fontVariant(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'font-variant', value);
    }

    public static fontWeight(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'font-weight', value);
    }

    public static height(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'font-weight', value);
    }

    public static justifyContent(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'justify-content', value);
    }

    public static left(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'left', value);
    }

    public static letterSpacing(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'letter-spacing', value);
    }

    public static lineHeight(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'line-height', value);
    }

    public static listStyle(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'list-style', value);
    }

    public static listStyleImage(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'list-style-image', value);
    }

    public static listStylePosition(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'list-style-position', value);
    }

    public static listStyleType(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'list-style-type', value);
    }

    public static margin(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'margin', value);
    }

    public static marginBottom(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'margin-bottom', value);
    }

    public static marginLeft(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'margin-left', value);
    }

    public static marginRight(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'margin-right', value);
    }

    public static marginTop(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'margin-top', value);
    }

    public static markerOffset(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'marker-offset', value);
    }

    public static marks(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'marks', value);
    }

    public static maxHeight(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'max-height', value);
    }

    public static maxWidth(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'max-width', value);
    }

    public static minHeight(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'min-height', value);
    }

    public static minWidth(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'min-width', value);
    }

    public static opacity(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'opacity', value);
    }

    public static order(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'order', value);
    }

    public static orphans(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'orphans', value);
    }

    public static outlineColor(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'outline-color', value);
    }

    public static outlineStyle(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'outline-style', value);
    }

    public static outlineWidth(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'outline-width', value);
    }

    public static overflow(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'overflow', value);
    }

    public static padding(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'padding', value);
    }

    public static paddingBottom(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'padding-bottom', value);
    }

    public static paddingLeft(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'padding-left', value);
    }

    public static paddingRight(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'padding-Right', value);
    }

    public static paddingTop(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'padding-Top', value);
    }

    public static page(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'page', value);
    }

    public static pageBreakAfter(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'page-break-after', value);
    }

    public static pageBreakBefore(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'page-break-before', value);
    }

    public static pageBreakInside(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'page-break-inside', value);
    }

    public static pause(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'pause', value);
    }

    public static pauseAfter(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'pause-after', value);
    }

    public static pauseBefore(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'pause-before', value);
    }

    public static perspective(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'perspective', value);
    }

    public static perspectiveOrigin(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'perspective-origin', value);
    }

    public static pitch(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'pitch', value);
    }

    public static pitchRange(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'pitch-range', value);
    }

    public static playDuring(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'play-during', value);
    }

    public static pointerEvents(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'pointer-events', value);
    }

    public static position(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'position', value);
    }

    public static quotes(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'quotes', value);
    }

    public static resize(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'resize', value);
    }

    public static richness(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'richness', value);
    }

    public static size(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'size', value);
    }

    public static speak(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'speak', value);
    }

    public static speakHeader(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'speak-header', value);
    }

    public static speakNumeral(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'speak-numeral', value);
    }

    public static speakPunctuation(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'speak-punctuation', value);
    }

    public static speechRate(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'speech-rate', value);
    }

    public static stress(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'stress', value);
    }

    public static tableLayout(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'table-layout', value);
    }

    public static textAlign(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'text-align', value);
    }

    public static textDecoration(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'text-decoration', value);
    }

    public static textIndent(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'text-indent', value);
    }

    public static textOverflow(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'text-overflow', value);
    }

    public static textShadow(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'text-shadow', value);
    }

    public static textTransform(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'text-transform', value);
    }

    public static top(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'top', value);
    }

    public static transform(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'transform', value);
    }

    public static transformOrigin(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'transform-origin', value);
    }

    public static transformStyle(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'transform-style', value);
    }

    public static transition(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'transition', value);
    }

    public static transitionDelay(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'transition-delay', value);
    }

    public static transitionDuration(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'transition-duration', value);
    }

    public static transitionProperty(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'transition-property', value);
    }

    public static transitionTimingFunction(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'transition-timing-function', value);
    }

    public static unicodeBidi(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'unicode-bidi', value);
    }

    public static verticalAlign(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'vertical-align', value);
    }

    public static visibility(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'visibility', value);
    }

    public static voiceFamily(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'voiceFamily', value);
    }

    public static volume(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'volume', value);
    }

    public static whiteSpace(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'whiteSpace', value);
    }

    public static widows(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'widows', value);
    }

    public static width(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'width', value);
    }

    public static willChange(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'will-change', value);
    }

    public static wordSpacing(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'word-spacing', value);
    }

    public static wordWrap(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'word-wrap', value);
    }

    public static zIndex(element: HTMLElement, value: string) {
        Util.setElementStyleProperty(element, 'z-index', value);
    }

    public static setMaxWidth(element: HTMLElement, width: string) {
        element.style.setProperty('max-width', width);
    }

    public static setMinWidth(element: HTMLElement, width: string) {
        element.style.setProperty('min-width', width);
    }

    public static addToBody(element: HTMLElement | IsElement<any>) {
        document.body.appendChild(this.getEl(element));
    }

    private static checkArgumentsAndTrim(element: HTMLElement, style: string) {
        if (element == null) {
            throw new java.lang.RuntimeException('Element can\'t be null!');
        }
        style = style.trim();
        if (style.length === 0) {
            throw new java.lang.IllegalArgumentException('Style names cannot be empty');
        }
    }

    public static getEl(element: HTMLElement | IsElement<any>): HTMLElement {
        let el: HTMLElement;
        if (element instanceof HTMLElement) {
            el = element;
        } else {
            el = element.asElement();
        }
        return el;
    }

    public static setStyle(element: HTMLElement | IsElement<any>, style: string) {
        let el = this.getEl(element);
        this.checkArgumentsAndTrim(el, style);
        el.className = style;
    }

    static replaceRaw(n1: IsElement<any> | HTMLElement, n2: IsElement<any> | HTMLElement) {
        if (n1 == null || n2 == null) throw new NullPointerException('Elements can\'t be null');
        this.replaceRawElement(this.getEl(n1), this.getEl(n2));
    }

    public static replaceRawElement(n1: Element, n2: Element): void {
        let parent = n2.parentNode;
        parent.replaceChild(n1, n2);
    }

    public static isIsElement(el: any) {
        return (el && el instanceof Object && 'asElement' in el);
    }

    public static isChildOf(el: Element, o: Element): boolean {
        let childNodes = el.childNodes;
        for (let i: number = 0; i < childNodes.length; i++)
            if (childNodes.item(i) === o)
                return true;
        return false;
    }
}