import {HandlerRegistration} from '../corecls/events';
import {ClickHandler, HasNavigationHandler, KeyDownHandler} from '../corecls/handlers';
import {AbstractCellComponent} from '../AbstractCellComponent';
import {BaseCell} from '../BaseCell';

export abstract class BaseCellNavigator {
    owner: AbstractCellComponent<any, any, any>;

    currentFocusedModel: any;

    lastFocusedModel: any;

    keyDownHandlerRegistration: HandlerRegistration;

    clickHandlerRegistration: HandlerRegistration;

    hasNavigationHandler: HasNavigationHandler;

    handler: Handler;

    public constructor(owner: AbstractCellComponent<any, any, any>, hasNavigationHandler: HasNavigationHandler) {
        this.owner = owner;
        this.hasNavigationHandler = hasNavigationHandler;
        this.setHandlers();
    }

    public setHandler(handler: Handler) {
        this.handler = handler;
    }

    public setValueClick(model: any, mouseEvent: MouseEvent) {
        this.setVal(model);
        if (this.currentFocusedModel !== this.lastFocusedModel)
            this.handler.onClickEvent(this.currentFocusedModel, this.lastFocusedModel, mouseEvent);
        else
            this.handler.onClickEventEquals(this.currentFocusedModel);
    }


    public setVal(model: any): any ;
    public setVal(model: any, nav?: boolean, keyboardEvent?: any): any ;
    public setVal(model: any, nav?: boolean, keyboardEvent?: any): any {
        this.lastFocusedModel = this.currentFocusedModel;
        this.currentFocusedModel = model;
        if (this.lastFocusedModel != null)
            this.setCellFocused(this.lastFocusedModel, false);
        if (nav && keyboardEvent != null)
            this.handler.onKeyFocused(this.currentFocusedModel, this.lastFocusedModel, keyboardEvent);
        this.setCellFocused(this.currentFocusedModel, true);
    }

    setCellFocused(model: any, b: boolean) {
        let cell: BaseCell<any, any> = this.owner.getRowCell(model);
        if (cell != null && cell.isFocusable())
            cell.setFocus(b);
    }

    abstract moveCellUp(keyboardEvent: KeyboardEvent): void;

    abstract moveCellDown(keyboardEvent: KeyboardEvent): void;

    abstract moveCellLeft(keyboardEvent: KeyboardEvent): void;

    abstract moveCellRight(keyboardEvent: KeyboardEvent): void;

    public removeHandlers() {
        if (this.clickHandlerRegistration != null) this.clickHandlerRegistration.removeHandler();
        if (this.keyDownHandlerRegistration != null) this.keyDownHandlerRegistration.removeHandler();
    }

    public setHandlers() {
        let self = this;
        this.keyDownHandlerRegistration = this.hasNavigationHandler.addKeyDownHandler(new class extends KeyDownHandler {
            onKeyDown(keyboardEvent: KeyboardEvent): void {
                if (self.currentFocusedModel == null) return;
                if (keyboardEvent.key === 'ArrowDown') {
                    self.moveCellUp(keyboardEvent);
                } else if (keyboardEvent.key === 'ArrowUp') {
                    self.moveCellDown(keyboardEvent);
                } else if (keyboardEvent.key === 'ArrowLeft') {
                    self.moveCellLeft(keyboardEvent);
                } else if (keyboardEvent.key === 'ArrowRight') {
                    self.moveCellRight(keyboardEvent);
                }
            }
        });
        this.clickHandlerRegistration = this.owner.addCellHandler(ClickHandler.onClick(evt => {
            self.setValueClick(self.owner.getCell(evt).getModel(), evt);
        }));
        this.owner.addCellHandler(KeyDownHandler.onKeyDown(evt => {
            self.setValueClick(self.owner.getCell(evt).getModel(), new MouseEvent(''));
        }));
    }
}

export interface Handler {
    onKeyFocused(currentFocusedModel: any, lastFocusedModel: any, event: KeyboardEvent): void;

    onClickEvent(currentFocusedModel: any, lastFocusedModel: any, event: MouseEvent): void;

    onClickEventEquals(currentFocusedModel: any): void;
}

