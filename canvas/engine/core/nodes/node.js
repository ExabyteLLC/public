export class Node {
    parent;
    children;
    visible;

    constructor() {
        this.children = [];
        this.parent = null;
        this.visible = true;
    }

    add(child) {
        child.parent = this;
        this.children.push(child);
        return child;
    }

    remove(child) {
        const i = this.children.indexOf(child);
        if (i >= 0) this.children.splice(i, 1);
        child.parent = null;
    }

    update(dt) {
        for (const child of this.children) child.update(dt);
    }

    draw(ctx) {
        if (!this.visible) return;
        for (const child of this.children) child.draw(ctx);
    }
}