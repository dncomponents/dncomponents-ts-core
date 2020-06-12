import {HasStyle} from './HasStyle';
import {java} from 'j4ts';
import Comparator = java.util.Comparator;

export interface SetElement {
    setHtml(e: HTMLElement): void;
}

export interface StyleCmd {
    (): string;
}


export abstract class BaseTypeHasStyle implements HasStyle {

    protected readonly styleCmd: StyleCmd;

    constructor(type: StyleCmd) {
        this.styleCmd = type;
    }

    getStyle(): string {
        return this.styleCmd();
    }
}

export abstract class BaseTypeStringHasStyle implements HasStyle {
    protected name: string;

    constructor(name: string) {
        this.name = name;
    }

    getStyle(): string {
        return this.name;
    }
}

export function getDefaultComparator<T>(fieldGetter: (p1: T) => any): Comparator<T> {
    return (a, b) => {
        let val1 = fieldGetter(a);
        let val2 = fieldGetter(b);
        let res = nullComparator(val1, val2);
        if (res != null)
            return res;
        if (typeof val1 == 'string') {
            return val1.localeCompare(<any>val2);
        } else if (typeof val1 == 'boolean') {
            return defaultComparator(val1, val2);
        } else if (typeof val1 == 'number') {
            return defaultComparator(val1, val2);
        } else if (val1 instanceof Date) {
            return defaultComparator(val1, val2);
        } else {
            throw new Error('You must define comparator');
        }
    };
}

let defaultComparator: (val1: any, val2: any) => number = (val1, val2) => {
    if (val1 === val2)
        return 0;
    if (val1 > val2)
        return 1;
    else
        return -1;
};
let nullComparator: (val1: any, val2: any) => number = (val1, val2) => {
    if (val1 == null && val2 == null)
        return 0;
    if (val1 == null && val2 != null)
        return 1;
    if (val1 != null && val2 == null)
        return -1;
    return null;
};

