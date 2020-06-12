import {BaseComponent, Renderer} from '../BaseComponent';
import {Util} from '../corecls/Util';
import {HandlerRegistration} from '../corecls/events';
import {DialogView} from './view/DialogView';
import {HasHideHandlers, HasShowHandlers, HideEvent, HideHandler, ShowEvent, ShowHandler} from '../corecls/handlers';
import {Ui} from '../views/Ui';
import {DialogViewSlots} from './view/DialogViewSlots';
import {SetElement} from '../corecls/corecls';
import {ComponentHtmlParser} from '../ComponentHtmlParser';

export class Dialog<T> extends BaseComponent<T, DialogView> implements HasShowHandlers<any>, HasHideHandlers<any> {

    private backdrop: boolean = true;
    private closeOnEscape: boolean = true;
    private draggable: boolean = true;

    public constructor() ;
    public constructor(view: DialogView) ;
    public constructor(view?: DialogView) {
        super(view ? view : Ui.get().getModalDialogView());
        this.bind();
    }

    private bind() {
        this.view.addCloseHandler(() => {
            this.hide();
        });
        this.setBackdrop(this.backdrop);
        this.setCloseOnEscape(this.closeOnEscape);
        this.setDraggable(this.draggable);
    }

    public show() {
        Util.addToBody(this);
        this.view.show();
        ShowEvent.fire(this, this);
    }

    public hide() {
        this.view.hide();
        this.asElement().remove();
        HideEvent.fire(this, this);
    }

    public setWidth(width: string) {
        this.view.setWidth(width);
    }

    public setHeight(height: string) {
        this.view.setHeight(height);
    }

    getView(): DialogView {
        return super.getView();
    }


    public addShowHandler(handler: ShowHandler<any>): HandlerRegistration {
        return handler.addTo(this.asElement());
    }

    public addHideHandler(handler: HideHandler<any>): HandlerRegistration {
        return handler.addTo(this.asElement());
    }

    public setRenderer(renderer: ModalRenderer<T>) {
        super.setRendererBase(renderer);
    }

    public setHeader(se: SetElement) {
        se.setHtml(this.getView().getViewSlots().getHeaderPanel());
    }

    public setContent(se: SetElement) {
        se.setHtml(this.getView().getViewSlots().getContentPanel());
    }

    public setFooter(se: SetElement) {
        se.setHtml(this.getView().getViewSlots().getFooterPanel());
    }

    public setBackdrop(backdrop: boolean) {
        this.backdrop = backdrop;
        this.view.setBackDrop(backdrop);
    }

    public setCloseOnEscape(closeOnEscape: boolean) {
        this.closeOnEscape = closeOnEscape;
        this.view.setCloseOnEscape(closeOnEscape);
    }

    public setDraggable(draggable: boolean) {
        this.draggable = draggable;
        this.view.setDraggable(draggable);
    }

    public isDraggable(): boolean {
        return this.draggable;
    }

    public isBackdrop(): boolean {
        return this.backdrop;
    }

    public isCloseOnEscape(): boolean {
        return this.closeOnEscape;
    }

    public setPosition(top: number, left: number) {
        this.view.setPosition(top, left);
    }

    public getTopPosition(): number {
        return this.view.getTopPosition();
    }

    public getLeftPosition(): number {
        return this.view.getLeftPosition();
    }
}

export interface ModalRenderer<T> extends Renderer<T, DialogViewSlots> {
}

export class ModalDialogHtmlParser extends ComponentHtmlParser {

    static HEADER_TAG = 'header';
    static CONTENT_TAG = 'content';
    static FOOTER_TAG = 'footer';

    private static instance: ModalDialogHtmlParser;


    public static getInstance(): ModalDialogHtmlParser {
        if (this.instance == null)
            return this.instance = new ModalDialogHtmlParser();
        return this.instance;
    }

    public parse(htmlElement: Element, elements: Map<string, any>): BaseComponent<any, any> {
        let modalDialog: Dialog<any>;
        let view = this.getView(this.getClazz(), htmlElement, elements);
        if (view != null)
            modalDialog = new Dialog(<DialogView>view);
        else
            modalDialog = new Dialog();

        let titles = htmlElement.getElementsByTagName(ModalDialogHtmlParser.HEADER_TAG);
        for (let i = 0; i < titles.length; i++) {
            modalDialog.getView().getViewSlots().getHeaderPanel().innerHTML = titles.item(i).innerHTML;
            break;
        }
        let contents = htmlElement.getElementsByTagName(ModalDialogHtmlParser.CONTENT_TAG);
        for (let i = 0; i < contents.length; i++) {
            modalDialog.getView().getViewSlots().getContentPanel().innerHTML = contents.item(i).innerHTML;
            break;
        }
        let bottoms = htmlElement.getElementsByTagName(ModalDialogHtmlParser.FOOTER_TAG);
        for (let i = 0; i < contents.length; i++) {
            modalDialog.getView().getViewSlots().getFooterPanel().innerHTML = bottoms.item(i).innerHTML;
            break;
        }
        this.replaceAndCopy(htmlElement, modalDialog);
        htmlElement.remove();
        return modalDialog;
    }

    public getId(): string {
        return 'dn-modal-dialog';
    }

    public getClazz(): string {
        return 'ModalDialog';
    }

}
