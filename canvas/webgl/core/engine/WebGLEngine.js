import { Node } from "../index.js";

export default class WebGLEngine {
    #canvas;
    #gl;
    #rootNode;
    #animationFrame;
    #fps = 60;
    #then = 0;
    #interval = 1000 / 60;

    constructor(canvas, options = {}) {
        this.#canvas = canvas;
        this.#gl = this.#canvas.getContext('webgl');
        this.#rootNode = new Node();
        this.#rootNode.parent = this;

        if (options.fps) {
            this.#fps = options.fps;
            this.#interval = 1000 / this.#fps;
        }
    }

    setResolution(width, height) {
        this.#canvas.width = width;
        this.#canvas.height = height;
        this.#gl.viewport(0, 0, width, height);
    }

    add(node) {
        this.#rootNode.addChild(node);
    }

    handleResize() {
        const gl = this.#gl;
        const canvas = this.#canvas;
        if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        }
    }

    animate(now) {
        this.#animationFrame = requestAnimationFrame((t) => this.animate(t));

        const elapsed = now - this.#then;
        if (elapsed > this.#interval) {
            const deltaTime = elapsed / 1000;
            this.#then = now - (elapsed % this.#interval);
            this.handleResize();
            this.#rootNode.update(deltaTime);
            this.render();
        }
    }

    render() {
        const gl = this.#gl;
        // Let nodes handle clearing and state
        this.#rootNode.draw(gl);
    }

    start() {
        this.end();
        this.#rootNode.init(this.#gl);
        this.#then = performance.now();
        this.animate(this.#then);
    }

    end() {
        if (this.#animationFrame) {
            cancelAnimationFrame(this.#animationFrame);
            this.#animationFrame = null;
        }
    }
}