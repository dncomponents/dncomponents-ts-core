import {ColumnConfig} from './TableUtil';
import {FilterPanelView} from './views/TableUi';
import {FilterPanel, HasFilterValue} from './FilterPanel';
import {java} from 'j4ts';
import {CellEditor, DefaultCellEditor} from '../CellEditor';
import {IntegerBox} from '../textbox/IntegerBox';
import {TextBox} from '../textbox/TextBox';
import {DoubleBox} from '../textbox/DoubleBox';
import {CheckBox} from '../checkbox/CheckBox';
import {DateBox} from '../textbox/DateBox';
import NullPointerException = java.lang.NullPointerException;
import List = java.util.List;
import IllegalArgumentException = java.lang.IllegalArgumentException;
import Arrays = java.util.Arrays;
import Objects = java.util.Objects;

export abstract class Comparator<T, U> implements HasBiPredicate<T, U> {
    private comparatorName: string;

    public constructor(comparatorName: string) {
        if (this.comparatorName === undefined) this.comparatorName = null;
        this.comparatorName = comparatorName;
    }

    public getComparatorName(): string {
        return this.comparatorName;
    }

    public toString(): string {
        return this.getComparatorName();
    }

    abstract compare(): BiPredicate<T, U>;
}

export interface BiPredicate<T, U> {
    (p1: T, P2: U): boolean;
}

export interface HasBiPredicate<T, U> {
    compare(): BiPredicate<T, U>;
}


export class StringContainsComparator extends Comparator<string, string> {

    public constructor() {
        super('contains');
    }

    compare(): BiPredicate<string, string> {
        return (s: string, userEnteredValue: string): boolean => {
            if (s == null) return false;
            if (s == null || userEnteredValue == null) return true;
            return s.toLowerCase().includes(userEnteredValue.toLowerCase());
        };
    }
}

// string
export class StringEqualsComparator extends Comparator<string, string> {

    public constructor() {
        super('equals');
    }

    compare(): BiPredicate<string, string> {
        return (s: string, userEnteredValue: string): boolean => {
            return (s != null) && (s === userEnteredValue);
        };
    }
}

export class StringNotEqualsComparator extends Comparator<string, string> {

    public constructor() {
        super('not equal');
    }

    compare(): BiPredicate<string, string> {
        return (s: string, userEnteredValue: string): boolean => {
            return (s == null) || (s !== userEnteredValue);
        };
    }
}

export class StringStartsWithComparator extends Comparator<string, string> {

    public constructor() {
        super('starts with');
    }

    compare(): BiPredicate<string, string> {
        return (s: string, userEnteredValue: string): boolean => {
            return (s != null) && s.startsWith(userEnteredValue);
        };
    }
}

export class StringEndsWithComparator extends Comparator<string, string> {

    public constructor() {
        super('ends with');
    }

    compare(): BiPredicate<string, string> {
        return (s: string, userEnteredValue: string): boolean => {
            return (s != null) && s.endsWith(userEnteredValue);
        };
    }
}

//end string
export class BooleanIsComparator extends Comparator<boolean, boolean> {

    public constructor() {
        super('is');
    }

    compare(): BiPredicate<boolean, boolean> {
        return (o: boolean, userEnteredValue: boolean): boolean => {
            return o != null && (o === userEnteredValue);
        };
    }
}

//number
export class NumberEqualsComparator extends Comparator<number, number> {

    public constructor() {
        super('equals');
    }

    compare(): BiPredicate<number, number> {
        return (o: number, userEnteredValue: number): boolean => {
            return (o != null) && (o === userEnteredValue);
        };
    }
}

export class NumberNotEqualsComparator extends Comparator<number, number> {

    public constructor() {
        super('not equal');
    }

    compare(): BiPredicate<number, number> {
        return (o: number, userEnteredValue: number): boolean => {
            return (o != null) && (o !== userEnteredValue);
        };
    }
}

export class NumberLessThanComparator extends Comparator<number, number> {

    public constructor() {
        super('less than');
    }

    compare(): BiPredicate<number, number> {
        return (o: number, userEnteredValue: number): boolean => {
            return ((o != null) && ((o < userEnteredValue)));
        };
    }
}

export class NumberLessThanOrEqualsComparator extends Comparator<number, number> {

    public constructor() {
        super('less than or equals');
    }

    compare(): BiPredicate<number, number> {
        return (o: number, userEnteredValue: number): boolean => {
            return (o != null) && (o == userEnteredValue || o < userEnteredValue);
        };
    }
}

export class NumberGreaterThanComparator extends Comparator<number, number> {

    public constructor() {
        super('greater than');
    }

    compare(): BiPredicate<number, number> {
        return (o: number, userEnteredValue: number): boolean => {
            return (o != null) && (o > userEnteredValue);
        };
    }
}

export class NumberGreaterThanOrEqualsComparator extends Comparator<number, number> {

    public constructor() {
        super('greater than');
    }

    compare(): BiPredicate<number, number> {
        return (o: number, userEnteredValue: number): boolean => {
            return (o != null) && (o == userEnteredValue || o > userEnteredValue);
        };
    }
}


//end number
export class EmptyComparator<M> extends Comparator<M, M> {
    public constructor() {
        super('is empty');
    }

    public compare(): BiPredicate<M, M> {
        return (o: M, userEnteredValue: M): boolean => {
            return o == null || o == undefined;
        };
    }

}

export class NonEmptyComparator<M> extends Comparator<M, M> {
    public constructor() {
        super('is not empty');
    }

    public compare(): BiPredicate<M, M> {
        return (o: M, userEnteredValue: M): boolean => {
            return o != null && o != undefined;
        };
    }

}

//collections
export class IsComparator extends Comparator<any, any> {

    public constructor() {
        super('Is');
    }

    compare(): BiPredicate<any, any> {
        return (o: any, userEnteredValue: any): boolean => {
            return Objects.equals(o, userEnteredValue);
        };
    }
}

export class IsNotComparator extends Comparator<any, any> {

    public constructor() {
        super('Is not');
    }

    compare(): BiPredicate<any, any> {
        return (o: any, userEnteredValue: any): boolean => {
            return !Objects.equals(o, userEnteredValue);
        };
    }
}

export class IsAnyOfComparator extends Comparator<any, List<any>> {

    public constructor() {
        super('Is any of');
    }

    compare(): BiPredicate<any, List<any>> {
        return (o: any, objects: List<any>): boolean => {
            return objects.contains(o);
        };
    }
}

export class IsNonOfComparator extends Comparator<any, List<any>> {

    public constructor() {
        super('Is non of');
    }

    compare(): BiPredicate<any, List<any>> {
        return (o: any, objects: List<any>): boolean => {
            return !objects.contains(o);
        };
    }
}

//end collections


export class FilterUtil {

    public static textComparators = Arrays.asList<any>(
        new StringContainsComparator(),
        new StringEqualsComparator(),
        new StringNotEqualsComparator(),
        new StringStartsWithComparator(),
        new StringEndsWithComparator(),
        new EmptyComparator(),
        new NonEmptyComparator()
    );

    public static collectionComparators = Arrays.asList<any>(
        new IsComparator(),
        new IsNotComparator(),
        new IsAnyOfComparator(),
        new IsNonOfComparator(),
        new EmptyComparator(),
        new NonEmptyComparator()
    );

//end collections

    public static booleanComparators = Arrays.asList<any>(
        new BooleanIsComparator(),
        new EmptyComparator(),
        new NonEmptyComparator()
    );
    public static numberComparators = Arrays.asList<any>(
        new NumberEqualsComparator(),
        new NumberNotEqualsComparator(),
        new NumberLessThanComparator(),
        new NumberGreaterThanComparator(),
        new NumberGreaterThanOrEqualsComparator(),
        new NumberLessThanOrEqualsComparator(),
        new EmptyComparator(),
        new NonEmptyComparator()
    );
    public static dateComparators = Arrays.asList<any>(
        // new DateIsComparator(),
        // new EmptyComparator<>(),
        // new NonEmptyComparator<>()
    );


    public static isEmptyComparator(comparator: Comparator<any, any>): boolean {
        return (comparator instanceof EmptyComparator ||
            comparator instanceof NonEmptyComparator);
    }

    public static getFilterValue(column: ColumnConfig<any, any>, view: FilterPanelView<any>): HasFilterValue<any> {
        return new FilterPanel(view, column.getClazz());
    }

    public static getComparators(clzz: string): List<Comparator<any, any>> {
        if (clzz == null)
            throw new NullPointerException('Can\'t be null');
        if (clzz == 'string') {
            return this.textComparators;
        } else if (clzz == 'number' || clzz == 'integer' || clzz == 'double') {
            return this.numberComparators;
        } else if (clzz == 'boolean') {
            return this.booleanComparators;
        } else if (clzz == 'date') {
            return this.dateComparators;
        }
        throw new IllegalArgumentException(clzz + ' has no defined comparators');
    }

    public static getComponent<M>(clzz: string): CellEditor<M> {
        if (clzz == null)
            throw new NullPointerException('Class argument can\'t be null!');
        if (clzz == 'integer') {
            let integerBox = new IntegerBox();
            return new DefaultCellEditor(integerBox);
        } else if (clzz == 'string') {
            let tb = new TextBox();
            return new DefaultCellEditor(tb);
        } else if (clzz == 'double') {
            let doubleBox = new DoubleBox();
            return new DefaultCellEditor(doubleBox);
        } else if (clzz == 'boolean') {
            let cb = new CheckBox();
            return new DefaultCellEditor(cb);
        } else if (clzz == 'date') {
            let dateBox = new DateBox();
            return new DefaultCellEditor(dateBox);
        }
        throw new IllegalArgumentException(clzz + ' has no defined editor!');
    }

}
