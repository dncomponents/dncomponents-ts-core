export interface HasIcon {
    getIcon(): string;
}

export function isHasIconInterface(el: any) {
    return (el && el instanceof Object && 'getIcon' in el);
}
