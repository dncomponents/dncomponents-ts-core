import {EventHandler, HandlerRegistration, HasHandlers} from './events';
import {BaseCell} from '../BaseCell';
import {HasPredicate, Predicate} from '../AbstractCellComponent';

export abstract class ClickHandler extends EventHandler<MouseEvent> {
    public static readonly TYPE: string = 'click';

    abstract onClick(evt: MouseEvent): void;

    handleEvent(evt: MouseEvent): void {
        this.onClick(evt);
    }

    getType(): string {
        return ClickHandler.TYPE;
    }

    public static onClick(c: (evt: MouseEvent) => void): ClickHandler {
        return new class extends ClickHandler {
            onClick = c;
        };
    }
}

export interface HasClickHandlers extends HasHandlers {
    addClickHandler(handler: ClickHandler): HandlerRegistration;
}

export abstract class DoubleClickHandler extends EventHandler<MouseEvent> {
    public static readonly TYPE: string = 'dblclick';

    abstract onDoubleClick(evt: MouseEvent): void;

    handleEvent(evt: MouseEvent): void {
        this.onDoubleClick(evt);
    }

    getType(): string {
        return DoubleClickHandler.TYPE;
    }

    public static onDoubleClick(c: (evt: MouseEvent) => void): DoubleClickHandler {
        return new class extends DoubleClickHandler {
            onDoubleClick = c;
        };
    }
}

export interface HasDoubleClickHandler extends HasHandlers {
    addDoubleClickHandler(handler: DoubleClickHandler): HandlerRegistration;
}

export abstract class MouseOutHandler extends EventHandler<MouseEvent> {
    public static readonly TYPE: string = 'mouseout';

    abstract onMouseOut(evt: MouseEvent): void;

    handleEvent(evt: MouseEvent): void {
        this.onMouseOut(evt);
    }

    getType(): string {
        return MouseOutHandler.TYPE;
    }

    public static onMouseOut(c: (evt: MouseEvent) => void): MouseOutHandler {
        return new class extends MouseOutHandler {
            onMouseOut = c;
        };
    }
}

export interface HasMouseOutHandler extends HasHandlers {
    addMouseOutHandler(handler: MouseOutHandler): HandlerRegistration;
}

export abstract class MouseLeaveHandler extends EventHandler<MouseEvent> {
    public static readonly TYPE: string = 'mouseleave';

    abstract onMouseLeave(evt: MouseEvent): void;

    handleEvent(evt: MouseEvent): void {
        this.onMouseLeave(evt);
    }

    getType(): string {
        return MouseLeaveHandler.TYPE;
    }

    public static onMouseLeave(c: (evt: MouseEvent) => void): MouseLeaveHandler {
        return new class extends MouseLeaveHandler {
            onMouseLeave = c;
        };
    }
}

export interface HasMouseLeaveHandler extends HasHandlers {
    addMouseLeaveHandler(handler: MouseLeaveHandler): HandlerRegistration;
}

export abstract class MouseEnterHandler extends EventHandler<MouseEvent> {
    public static readonly TYPE: string = 'mouseenter';

    abstract onMouseEnter(evt: MouseEvent): void;

    handleEvent(evt: MouseEvent): void {
        this.onMouseEnter(evt);
    }

    getType(): string {
        return MouseEnterHandler.TYPE;
    }

    public static onMouseEnter(c: (evt: MouseEvent) => void): MouseEnterHandler {
        return new class extends MouseEnterHandler {
            onMouseEnter = c;
        };
    }
}

export interface HasMouseEnterHandler extends HasHandlers {
    addMouseEnterHandler(handler: MouseEnterHandler): HandlerRegistration;
}

export abstract class MouseOverHandler extends EventHandler<MouseEvent> {
    public static readonly TYPE: string = 'mouseover';

    abstract onMouseOver(evt: MouseEvent): void;

    handleEvent(evt: MouseEvent): void {
        this.onMouseOver(evt);
    }

    getType(): string {
        return MouseOverHandler.TYPE;
    }

    public static onMouseOver(c: (evt: MouseEvent) => void): MouseOverHandler {
        return new class extends MouseOverHandler {
            onMouseOver = c;
        };
    }
}

export interface HasMouseOverHandler extends HasHandlers {
    addMouseOverHandler(handler: MouseOverHandler): HandlerRegistration;
}

export abstract class MouseDownHandler extends EventHandler<MouseEvent> {
    public static readonly TYPE: string = 'mousedown';

    abstract onMouseDown(evt: MouseEvent): void;

    handleEvent(evt: MouseEvent): void {
        this.onMouseDown(evt);
    }

    getType(): string {
        return MouseDownHandler.TYPE;
    }

    public static onMouseDown(c: (evt: MouseEvent) => void): MouseDownHandler {
        return new class extends MouseDownHandler {
            onMouseDown = c;
        };
    }
}

export interface HasMouseDownHandler extends HasHandlers {
    addMouseDownHandler(handler: MouseDownHandler): HandlerRegistration;
}

export abstract class MouseMoveHandler extends EventHandler<MouseEvent> {
    public static readonly TYPE: string = 'mousemove';

    abstract onMouseMove(evt: MouseEvent): void;

    handleEvent(evt: MouseEvent): void {
        this.onMouseMove(evt);
    }

    getType(): string {
        return MouseMoveHandler.TYPE;
    }

    public static onMouseDown(c: (evt: MouseEvent) => void): MouseMoveHandler {
        return new class extends MouseMoveHandler {
            onMouseMove = c;
        };
    }
}

export interface HasMouseMoveHandler extends HasHandlers {
    addMouseMoveHandler(handler: MouseMoveHandler): HandlerRegistration;
}

export abstract class MouseUpHandler extends EventHandler<MouseEvent> {
    public static readonly TYPE: string = 'mouseup';

    abstract onMouseUp(evt: MouseEvent): void;

    handleEvent(evt: MouseEvent): void {
        this.onMouseUp(evt);
    }

    getType(): string {
        return MouseUpHandler.TYPE;
    }

    public static onMouseUp(c: (evt: MouseEvent) => void): MouseUpHandler {
        return new class extends MouseUpHandler {
            onMouseUp = c;
        };
    }
}

export interface HasMouseUpHandler extends HasHandlers {
    addMouseUpHandler(handler: MouseUpHandler): HandlerRegistration;
}

export abstract class OnBlurHandler extends EventHandler<FocusEvent> {
    public static readonly TYPE: string = 'blur';

    abstract onBlur(evt: FocusEvent): void;

    handleEvent(evt: FocusEvent): void {
        this.onBlur(evt);
    }

    getType(): string {
        return OnBlurHandler.TYPE;
    }

    public static onBlur(c: (evt: FocusEvent) => void): OnBlurHandler {
        return new class extends OnBlurHandler {
            onBlur = c;
        };
    }

}

export interface HasBlurHandlers extends HasHandlers {
    addBlurHandler(handler: OnBlurHandler): HandlerRegistration;
}

export interface Focusable {
    getTabIndex(): number;

    setAccessKey(key: string): void;

    setFocus(focused: boolean): void;

    setTabIndex(index: number): void;
}


export abstract class OnFocusHandler extends EventHandler<FocusEvent> {
    public static readonly TYPE: string = 'focus';

    abstract onFocus(evt: FocusEvent): void;

    handleEvent(evt: FocusEvent): void {
        this.onFocus(evt);
    }

    getType(): string {
        return OnFocusHandler.TYPE;
    }

    public static onFocus(c: (evt: FocusEvent) => void): OnFocusHandler {
        return new class extends OnFocusHandler {
            onFocus = c;
        };
    }

}

export interface HasFocusHandlers extends HasHandlers {
    addFocusHandler(handler: OnFocusHandler): HandlerRegistration;
}


export abstract class KeyUpHandler extends EventHandler<KeyboardEvent> {
    public static readonly TYPE: string = 'keyup';

    abstract onKeyUp(evt: KeyboardEvent): void;

    handleEvent(evt: KeyboardEvent): void {
        this.onKeyUp(evt);
    }

    getType(): string {
        return KeyUpHandler.TYPE;
    }

    public static onKeyUp(c: (evt: KeyboardEvent) => void): KeyUpHandler {
        return new class extends KeyUpHandler {
            onKeyUp = c;
        };
    }

}

export abstract class KeyDownHandler extends EventHandler<KeyboardEvent> {
    public static readonly TYPE: string = 'keydown';

    abstract onKeyDown(evt: KeyboardEvent): void;

    handleEvent(evt: KeyboardEvent): void {
        this.onKeyDown(evt);
    }

    getType(): string {
        return KeyDownHandler.TYPE;
    }

    public static onKeyDown(c: (evt: KeyboardEvent) => void): KeyDownHandler {
        return new class extends KeyDownHandler {
            onKeyDown = c;
        };
    }

}

export abstract class OnChangeHandler extends EventHandler<Event> {
    public static readonly TYPE: string = 'change';

    abstract onChange(evt: Event): void;

    handleEvent(evt: Event): void {
        this.onChange(evt);
    }

    getType(): string {
        return OnChangeHandler.TYPE;
    }

    public static onChange(c: (evt: Event) => void): OnChangeHandler {
        return new class extends OnChangeHandler {
            onChange = c;
        };
    }
}

export abstract class ScrollHandler extends EventHandler<Event> {
    public static readonly TYPE: string = 'scroll';

    abstract onScroll(evt: Event): void;

    handleEvent(evt: Event): void {
        this.onScroll(evt);
    }

    getType(): string {
        return ScrollHandler.TYPE;
    }

    public static onScroll(c: (evt: Event) => void): ScrollHandler {
        return new class extends ScrollHandler {
            onScroll = c;
        };
    }
}

export class SelectionEvent<T> extends CustomEvent<T> {

    selection: T;

    constructor() {
        super(SelectionHandler.TYPE);
    }

    static fire<T>(source: HasHandlers, item: T): void {
        let event = new SelectionEvent<T>();
        event.selection = item;
        source.fireEvent(event);
    }

    static fireEl<T>(source: Element, item: T): void {
        let event = new SelectionEvent<T>();
        event.selection = item;
        source.dispatchEvent(event);
    }
}

export abstract class SelectionHandler<T> extends EventHandler<SelectionEvent<T>> {
    public static readonly TYPE: string = 'selection';

    abstract onSelection(evt: SelectionEvent<T>): void;

    handleEvent(evt: SelectionEvent<T>): void {
        this.onSelection(evt);
    }

    getType(): string {
        return SelectionHandler.TYPE;
    }

    public static onSelection<T>(c: (evt: SelectionEvent<T>) => void): SelectionHandler<T> {
        return new class extends SelectionHandler<T> {
            onSelection = c;
        };
    }


}

//before selection event
export class BeforeSelectionEvent<T> extends CustomEvent<T> {

    selection: T;

    constructor() {
        super(BeforeSelectionHandler.TYPE);
    }

    static fire<T>(source: HasHandlers, item: T): void {
        let event = new SelectionEvent<T>();
        event.selection = item;
        source.fireEvent(event);
    }

    static fireEl<T>(source: Element, item: T): void {
        let event = new SelectionEvent<T>();
        event.selection = item;
        source.dispatchEvent(event);
    }
}

export abstract class BeforeSelectionHandler<T> extends EventHandler<BeforeSelectionEvent<T>> {
    public static readonly TYPE: string = 'beforeSelection';

    abstract onBeforeSelection(evt: BeforeSelectionEvent<T>): void;

    handleEvent(evt: BeforeSelectionEvent<T>): void {
        this.onBeforeSelection(evt);
    }

    getType(): string {
        return BeforeSelectionHandler.TYPE;
    }

    public static onBeforeSelection<T>(c: (evt: BeforeSelectionEvent<T>) => void): BeforeSelectionHandler<T> {
        return new class extends BeforeSelectionHandler<T> {
            onBeforeSelection = c;
        };
    }

}

export interface HasBeforeSelectionHandlers<T> extends HasHandlers {
    addBeforeSelectionHandler(handler: BeforeSelectionHandler<T>): HandlerRegistration;
}


// cell editing
export class CellEditEvent<T> extends CustomEvent<T> {
    cell: BaseCell<T, any>;

    constructor() {
        super(CellEditHandler.TYPE);
    }

    static fire<T>(source: HasHandlers, cell: BaseCell<T, any>): void {
        let event = new CellEditEvent<T>();
        event.cell = cell;
        source.fireEvent(event);
    }

    static fireEl<T>(source: Element, cell: BaseCell<T, any>): void {
        let event = new CellEditEvent<T>();
        event.cell = cell;
        source.dispatchEvent(event);
    }
}

export abstract class CellEditHandler<T> extends EventHandler<CellEditEvent<T>> {
    public static readonly TYPE: string = 'celledit';

    abstract onCellEdit(evt: CellEditEvent<T>): void;

    handleEvent(evt: CellEditEvent<T>): void {
        this.onCellEdit(evt);
    }

    getType(): string {
        return CellEditHandler.TYPE;
    }
    public static onCellEdit<T>(c: (evt: CellEditEvent<T>) => void): CellEditHandler<T> {
        return new class extends CellEditHandler<T> {
            onCellEdit = c;
        };
    }

}

export interface HasCellEditHandlers<T> extends HasHandlers {
    addCellEditHandler(handler: CellEditHandler<T>): HandlerRegistration;
}

export interface HasNavigationHandler {
    addKeyDownHandler(keyDownHandler: KeyDownHandler): HandlerRegistration;
}

// rowdata changed
export class RowDataChangedEvent extends CustomEvent<any> {
    count: number;

    constructor() {
        super(RowDataChangedHandler.TYPE);
    }

    static fire<T>(source: HasHandlers, count: number): void {
        let event = new RowDataChangedEvent();
        event.count = count;
        source.fireEvent(event);
    }

    static fireEl<T>(source: Element, count: number): void {
        let event = new RowDataChangedEvent();
        event.count = count;
        source.dispatchEvent(event);
    }
}

export abstract class RowDataChangedHandler extends EventHandler<RowDataChangedEvent> {
    public static readonly TYPE: string = 'rowdatachanged';

    abstract onRowDataChange(evt: RowDataChangedEvent): void;

    handleEvent(evt: RowDataChangedEvent): void {
        this.onRowDataChange(evt);
    }

    getType(): string {
        return RowDataChangedHandler.TYPE;
    }
}

export interface HasCellEditHandlers<T> extends HasHandlers {
    addCellEditHandler(handler: CellEditHandler<T>): HandlerRegistration;
}

// filter event
export class FilterEvent<T> extends CustomEvent<any> {

    private filter: Predicate<T>;

    constructor(filter?: HasPredicate<T>) {
        super(FilterHandler.TYPE);
        this.filter = filter.compare();
    }

    static fire<T>(source: HasHandlers, filter: HasPredicate<T>): void {
        let event = new FilterEvent(filter);
        source.fireEvent(event);
    }

    static fireEl<T>(source: Element, filter: HasPredicate<T>): void {
        let event = new FilterEvent(filter);
        source.dispatchEvent(event);
    }
}

export abstract class FilterHandler<T> extends EventHandler<FilterEvent<T>> {
    public static readonly TYPE: string = 'filter';

    abstract onFilter(evt: FilterEvent<T>): void;

    handleEvent(evt: FilterEvent<T>): void {
        this.onFilter(evt);
    }

    getType(): string {
        return FilterHandler.TYPE;
    }

    public static onFilter<T>(c: (evt: FilterEvent<T>) => void): FilterHandler<T> {
        return new class extends FilterHandler<T> {
            onFilter = c;
        };
    }
}

export interface HasFilterHandlers<T> extends HasHandlers {
    addFilterHandler(handler: FilterHandler<T>): HandlerRegistration;
}

export class OpenEvent<T> extends CustomEvent<any> {

    owner: T;

    constructor(owner: T) {
        super(OpenHandler.TYPE);
        this.owner = owner;
    }

    static fire<T>(source: HasHandlers, owner: T): void {
        let event = new OpenEvent<T>(owner);
        source.fireEvent(event);
    }

    static fireEl<T>(source: Element, owner: T): void {
        let event = new OpenEvent<T>(owner);
        source.dispatchEvent(event);
    }
}

export abstract class OpenHandler<T> extends EventHandler<OpenEvent<T>> {
    public static readonly TYPE: string = 'open';

    abstract onOpen(evt: OpenEvent<T>): void;

    handleEvent(evt: OpenEvent<T>): void {
        this.onOpen(evt);
    }

    getType(): string {
        return OpenHandler.TYPE;
    }

    public static onOpen<T>(c: (evt: OpenEvent<T>) => void): OpenHandler<T> {
        return new class extends OpenHandler<T> {
            onOpen = c;
        };
    }
}

export interface HasOpenHandlers<T> extends HasHandlers {
    addOpenHandler(handler: OpenHandler<T>): HandlerRegistration;
}

//close
export class CloseEvent<T> extends CustomEvent<any> {

    owner: T;

    constructor(owner: T) {
        super(OpenHandler.TYPE);
        this.owner = owner;
    }

    static fire<T>(source: HasHandlers, owner: T): void {
        let event = new CloseEvent<T>(owner);
        source.fireEvent(event);
    }

    static fireEl<T>(source: Element, owner: T): void {
        let event = new CloseEvent<T>(owner);
        source.dispatchEvent(event);
    }
}

export abstract class CloseHandler<T> extends EventHandler<CloseEvent<T>> {
    public static readonly TYPE: string = 'close';

    abstract onClose(evt: CloseEvent<T>): void;

    handleEvent(evt: CloseEvent<T>): void {
        this.onClose(evt);
    }

    getType(): string {
        return CloseHandler.TYPE;
    }

    public static onClose<T>(c: (evt: CloseEvent<T>) => void): CloseHandler<T> {
        return new class extends CloseHandler<T> {
            onClose = c;
        };
    }
}

export interface HasCloseHandlers<T> extends HasHandlers {
    addCloseHandler(handler: CloseHandler<T>): HandlerRegistration;
}


//end close

export abstract class PopstateHandler extends EventHandler<PopStateEvent> {
    public static readonly TYPE: string = 'popstate';

    abstract onPopStateChanged(evt: PopStateEvent): void;

    handleEvent(evt: PopStateEvent): void {
        this.onPopStateChanged(evt);
    }

    getType(): string {
        return PopstateHandler.TYPE;
    }

    public static onPopStateChanged(c: (evt: PopStateEvent) => void): PopstateHandler {
        return new class extends PopstateHandler {
            onPopStateChanged = c;
        };
    }
}

export interface HasCloseHandlers<T> extends HasHandlers {
    addCloseHandler(handler: CloseHandler<T>): HandlerRegistration;
}

export class MouseCustomEvents {

    mouseOver: boolean = false;
    firstTimeMouseOver: boolean = false;
    element: HTMLElement;

    constructor(element: HTMLElement) {
        this.element = element;
        this.init();
    }

    private init(): void {
        MouseOutHandler.onMouseOut(evt => {
            this.mouseOver = false;
            setTimeout(() => {
                if (!this.mouseOver) {
                    let mouseEvent = new CustomEvent('mouseleave');
                    mouseEvent.initCustomEvent('mouseleave', true, true, this);
                    this.element.dispatchEvent(mouseEvent);
                    this.firstTimeMouseOver = false;
                }
            }, 200);
        }).addTo(this.element);
        MouseOverHandler.onMouseOver(evt => {
            this.mouseOver = false;
            setTimeout(() => {
                if (!this.firstTimeMouseOver) {
                    let mouseEvent = new CustomEvent('mouseenter');
                    mouseEvent.initCustomEvent('mouseenter', true, true, this);
                    this.element.dispatchEvent(mouseEvent);
                }
                this.mouseOver = true;
                this.firstTimeMouseOver = true;
            }, 200);
        }).addTo(this.element);
    }

}

export class ShowEvent<T> extends CustomEvent<T> {

    item: T;

    constructor() {
        super(ShowHandler.TYPE);
    }

    static fire<T>(source: HasHandlers, item: T): void {
        let event = new ShowEvent<T>();
        event.item = item;
        source.fireEvent(event);
    }

    static fireEl<T>(source: Element, item: T): void {
        let event = new ShowEvent<T>();
        event.item = item;
        source.dispatchEvent(event);
    }
}

export abstract class ShowHandler<T> extends EventHandler<ShowEvent<T>> {
    public static readonly TYPE: string = 'show';

    abstract onShow(evt: ShowEvent<T>): void;

    handleEvent(evt: ShowEvent<T>): void {
        this.onShow(evt);
    }

    getType(): string {
        return ShowHandler.TYPE;
    }

    public static onShow<T>(c: (evt: ShowEvent<T>) => void): ShowHandler<T> {
        return new class extends ShowHandler<T> {
            onShow = c;
        };
    }

}

export interface HasShowHandlers<T> extends HasHandlers {
    addShowHandler(handler: ShowHandler<T>): HandlerRegistration;
}

//hide
export class HideEvent<T> extends CustomEvent<T> {

    item: T;

    constructor() {
        super(ShowHandler.TYPE);
    }

    static fire<T>(source: HasHandlers, item: T): void {
        let event = new ShowEvent<T>();
        event.item = item;
        source.fireEvent(event);
    }

    static fireEl<T>(source: Element, item: T): void {
        let event = new ShowEvent<T>();
        event.item = item;
        source.dispatchEvent(event);
    }
}

export abstract class HideHandler<T> extends EventHandler<HideEvent<T>> {
    public static readonly TYPE: string = 'hide';

    abstract onHide(evt: HideEvent<T>): void;

    handleEvent(evt: HideEvent<T>): void {
        this.onHide(evt);
    }

    getType(): string {
        return HideHandler.TYPE;
    }

    public static onHide<T>(c: (evt: HideEvent<T>) => void): HideHandler<T> {
        return new class extends HideHandler<T> {
            onHide = c;
        };
    }
}

export interface HasHideHandlers<T> extends HasHandlers {
    addHideHandler(handler: HideHandler<T>): HandlerRegistration;
}
