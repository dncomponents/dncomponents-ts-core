import {java} from 'j4ts';
import {HasIcon} from '../tree/HasIcon';
import List = java.util.List;

export class ItemBase {
    id: string;

    constructor();
    constructor(id: string) ;
    constructor(id?: string) {
        this.id = id;
    }

    setId(elementId: string) {
        this.id = elementId;
    }

    getId(): string {
        return this.id;
    }

}

export class ItemId extends ItemBase implements HasIcon {
    content: string;
    icon: string;

    constructor()
    constructor(id: string, content: string) ;
    constructor(id?: string, content?: string) {
        super(id);
        this.setContent(content);
    }

    setContent(content: string) {
        this.content = content;
    }

    getContent() {
        return this.content;
    }

    getIcon(): string {
        return this.icon;
    }

    setIcon(icon: string): void {
        this.icon = icon;
    }

    toString(): string {
        return this.getContent();
    }
}

export class ItemIdTitle extends ItemId {
    title: string;

    setTitle(title: string) {
        this.title = title;
    }

    getTitle(): string {
        return this.title;
    }

}

export class RowItemId extends ItemBase {

    constructor() {
        super();
    }

    cells: List<ItemId>;
}