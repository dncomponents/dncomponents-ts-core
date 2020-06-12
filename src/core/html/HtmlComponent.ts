/**
 * @author nikolasavic
 */
import {IsElement} from '../corecls/IsElement';

export class HtmlComponent implements IsElement<any> {
    private element: HTMLElement;

    public constructor(tag: string, content: string) {
        this.element = document.createElement(tag);
        this.setHtml(content);
    }

    public asElement(): HTMLElement {
        return this.element;
    }

    public setHtml(html: string): void {
        this.element.innerHTML = html;
    }
}