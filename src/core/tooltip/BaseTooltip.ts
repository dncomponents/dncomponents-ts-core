import {java} from 'j4ts';
import {HandlerRegistration} from '../corecls/events';
import {BaseComponent} from '../BaseComponent';
import {ClickHandler, MouseOutHandler, MouseOverHandler, OnBlurHandler, OnFocusHandler} from '../corecls/handlers';
import {Util} from '../corecls/Util';
import {TooltipView} from './view/TooltipView';
import {createPopper, Instance} from '@popperjs/core';
import {Placement} from '@popperjs/core/lib/enums';
import List = java.util.List;
import ArrayList = java.util.ArrayList;

export abstract class BaseTooltip<T, C extends TooltipView<any>> extends BaseComponent<T, C> {

    private orientation: Orientation = Orientation.BOTTOM;

    trigger: Trigger = Trigger.HOVER;

    private owner: HTMLElement;

    private showing: boolean = false;

    popper: Instance;
    private focused: boolean;

    private handlers: List<HandlerRegistration> = new ArrayList<HandlerRegistration>();

    public constructor(view: C) {
        super(view);
        this.addHandler(ClickHandler.onClick(evt => evt.stopPropagation()));
    }

    public setContent(text: string | HTMLElement): void {
        this.view.setContent(text);
    }

    private static bla = 0;
    private static stt = 0;

    private addAndShow() {
        Util.addToBody(this);
        let self = this;
        console.log((this.orientation + '').toLowerCase());
        this.popper = createPopper(this.owner, this.asElement(), {
            placement: <Placement>(this.orientation + '').toLowerCase()
            , modifiers: [{
                name: 'state-changed',
                enabled: true,
                phase: 'main',
                fn({state}) {
                    if (state.placement !== self.orientation.toLowerCase()) {
                        self.setOrientation(<Orientation>state.placement.toUpperCase());
                        state.elements.popper.setAttribute('x-placement', state.placement);
                    }
                },
            },{name: 'attrib'},
                {
                    name: 'flip',
                }, {
                    name: 'offset',
                    options: {
                        offset: [0, 8],
                    }
                }]
        });
        this.showing = true;
        // this.updatePosition();
    }

    private remove() {
        this.asElement().remove();
        this.showing = false;
    }

    protected abstract fireShowEvent(): void;

    protected abstract fireCloseEvent(): void;

    public show() {
        if (!this.isShowing()) {
            this.addAndShow();
            this.fireShowEvent();
        }
    }

    private destroy(): void {
        if (this.popper) {
            this.popper.destroy();
            this.popper = null;
        }
    }

    public hide() {
        if (this.isShowing()) {
            this.remove();
            this.fireCloseEvent();
            this.destroy();
        }
    }

    public updatePosition() {
        this.calculatePosition();
    }

    public isShowing(): boolean {
        return this.showing;
    }

    public getOwner(): Element {
        return this.owner;
    }

    public setOwner(owner: HTMLElement) {
        this.owner = owner;
        this.setTrigger(Trigger.HOVER);
    }

    public getOrientation(): Orientation {
        return this.orientation;
    }

    public setOrientation(orientation: Orientation): any {
        this.orientation = orientation;
        if (this.orientation == null) this.orientation = Orientation.BOTTOM;
        switch ((this.orientation)) {
            case Orientation.BOTTOM:
                this.view.setBottomOrientation();
                break;
            case Orientation.TOP:
                this.view.setTopOrientation();
                break;
            case Orientation.LEFT:
                this.view.setLeftOrientation();
                break;
            case Orientation.RIGHT:
                this.view.setRightOrientation();
                break;
        }
        return this;
    }

    public getTrigger(): Trigger {
        return this.trigger;
    }

    public setTrigger(trigger: Trigger): any {
        this.trigger = trigger;
        if (this.trigger == null) this.trigger = Trigger.HOVER;
        this.handlers.forEach((handlerRegistration) => handlerRegistration.removeHandler());
        switch (this.trigger) {
            case Trigger.HOVER:
                this.handlers.add(Util.addHandler(this.owner, MouseOverHandler.onMouseOver(() => this.show())));
                this.handlers.add(Util.addHandler(this.owner, MouseOutHandler.onMouseOut(() => this.hide())));
                break;
            case Trigger.CLICK:
                this.handlers.add(Util.addHandler(this.owner, ClickHandler.onClick(evt => {
                    evt.stopPropagation();
                    this.show();
                })));
                this.handlers.add(Util.addHandler(document.body, ClickHandler.onClick(() => this.hide())));
                break;
            case Trigger.FOCUS:
                this.handlers.add(Util.addHandler(this.owner, OnFocusHandler.onFocus(() => this.show())));
                this.handlers.add(Util.addHandler(this.owner, OnBlurHandler.onBlur(() => this.hide())));
                break;
            case Trigger.HOVER_FOCUS:
                this.handlers.add(Util.addHandler(this.owner, MouseOverHandler.onMouseOver(() => this.show())));
                this.handlers.add(Util.addHandler(this.owner, MouseOutHandler.onMouseOut(() => {
                    if (!this.focused)
                        this.hide();
                })));
                this.handlers.add(Util.addHandler(this.owner, OnFocusHandler.onFocus(() => {
                    this.show();
                    this.focused = true;
                })));
                this.handlers.add(Util.addHandler(this.owner, OnBlurHandler.onBlur(() => {
                    this.hide();
                    this.focused = false;
                })));
                break;
        }
        return this;
    }

    calculatePosition() {
        switch (this.orientation) {
            case Orientation.BOTTOM:
                this.view.calculatePositionBottom(this.owner);
                break;
            case Orientation.TOP:
                this.view.calculatePositionTop(this.owner);
                break;
            case Orientation.LEFT:
                this.view.calculatePositionLeft(this.owner);
                break;
            case Orientation.RIGHT:
                this.view.calculatePositionRight(this.owner);
                break;
        }
    }
}

export enum Orientation {
    TOP = 'TOP',
    BOTTOM = 'BOTTOM',
    LEFT = 'LEFT',
    RIGHT = 'RIGHT'
}


export enum Trigger {
    HOVER = 'HOVER',
    CLICK = 'CLICK',
    FOCUS = 'FOCUS',
    HOVER_FOCUS = 'HOVER_FOCUS'
}

