export interface HasStyle {
    getStyle(): string;
}

export namespace HasStyle {

    export function appendString(hasStyle: HasStyle | string): string {
        if (hasStyle != null) {
            let str;
            if (typeof hasStyle === 'string')
                str = hasStyle;
            else
                str = hasStyle.getStyle();
            return ' ' + str;
        } else {
            return '';
        }
    }
}

export namespace HasStyle {

    export interface StyleCmd {
        getStyle(): string;
    }
}
