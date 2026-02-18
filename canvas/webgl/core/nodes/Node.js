export default class Node {
    parent;
    children;

    constructor() {
        this.parent = null;
        this.children = [];
    }

    addChild(node) {
        if (node instanceof Node) {
            node.parent = this;
            this.children.push(node);
            return node;
        }
        throw new Error("Can only add instances of Node");
    }

    removeChild(node) {
        const index = this.children.indexOf(node);
        if (index !== -1) {
            this.children[index].parent = null;
            this.children.splice(index, 1);
        }
    }

    // Recursive init
    init(gl) {
        this.onInit(gl);
        this.children.forEach(child => child.init(gl));
    }

    // Recursive update
    update(dt) {
        this.onUpdate(dt);
        this.children.forEach(child => child.update(dt));
    }

    // Recursive draw
    draw(gl, program) {
        this.onDraw(gl, program);
        this.children.forEach(child => child.draw(gl, program));
    }

    // Hooks for the subclasses to override
    onInit(gl) { }
    onUpdate(dt) { }
    onDraw(gl, program) { }
}