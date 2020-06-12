import {java} from 'j4ts';
import {HandlerRegistration} from '../corecls/events';
import {PopstateHandler} from '../corecls/handlers';
import ArrayList = java.util.ArrayList;


export class History {

    private static handlerList = new ArrayList<Consumer<string>>();

    public static addValueChangeHandler(handler: Consumer<string>): HandlerRegistration {
        this.handlerList.add(handler);
        let self = this;
        return {
            removeHandler(): void {
                self.handlerList.remove(handler);
            }
        };
    }

    public static removeValueChangeHandler(handler: Consumer<string>): void {
        this.handlerList.remove(handler);
    }


    public static clearHandlers(): void {
        this.handlerList.clear();
    }

    public static newItem(historyToken: string, issueEvent: boolean): void {
        if (issueEvent)
            location.hash = (historyToken);
        else
            window.history.replaceState(null, null, '#' + historyToken);
    }

    public static update(token: string): void {
        // this.handlerList.forEach(e => e(token.substring(1)));
        this.handlerList.forEach(e => e.apply(this, [token.substring(1)]));
    }

    public static init(): void {
        window.addEventListener(PopstateHandler.TYPE, evt => {
            let hash = location.hash;
            this.update(hash);
        });
    }

    public static fireCurrentHistoryState(): void {
        let hash = location.hash;
        this.newItem('temp', false);
        this.newItem(hash.substring(1), true);
    }


}

interface Consumer<T> {
    (e: T): void;
}
 