import {AbstractCellComponent} from './AbstractCellComponent';

export interface HasCellComponents {
    resetScrollPosition(): void;
}

export namespace HasCellComponents {
    export function resetAll(...all: AbstractCellComponent<any, any, any>[]) {
        for (let index = 0; index < all.length; index++) {
            let h = all[index];
            h.resetScrollPosition();
        }
    }
}

