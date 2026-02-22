import Node from "./Node.js";

export default class CustomNode extends Node {
    constructor({
        layerId = 'default',
        onInit = () => { },
        onUpdate = () => { },
        onDraw = () => { },
        onDestroy = () => { },
    } = {}) {
        super({ layerId });

        // Bind methods to this instance
        this.onInit = onInit.bind(this);
        this.onUpdate = onUpdate.bind(this);
        this.onDraw = onDraw.bind(this);
        this.onDestroy = onDestroy.bind(this);
    }
}