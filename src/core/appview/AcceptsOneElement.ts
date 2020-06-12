import {IsElement} from '../corecls/IsElement';

export interface AcceptsOneElement {
    setElement(element: IsElement<any>): void;
}