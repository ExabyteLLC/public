export default class CanvasLayer {
    #id; #canvas; #context;

    constructor(id, canvas) {
        this.#id = id;
        this.#canvas = canvas;
        this.#context = canvas.getContext('2d');
    }

    get id() { return this.#id; }
    get canvas() { return this.#canvas; }
    get context() { return this.#context; }

    clear() {
        this.#context.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
    }
}