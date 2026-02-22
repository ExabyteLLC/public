import Node from "../nodes/Node.js";
import CanvasLayerManager from "./CanvasLayerManager.js";

export default class MultiCanvasLayerEngine {
    #animationFrame;
    #layerManager = new CanvasLayerManager();
    #rootNode = new Node();
    #running = false;
    #then = 0;
    #fps = 60;
    #initialized = false;

    constructor() {
        this.#rootNode.parent = this;
    }

    get layerManager() { return this.#layerManager; }
    get rootNode() { return this.#rootNode; }

    // Initialize the engine and all nodes
    init() {
        if (this.#initialized) return;

        // Resize layers to match their container
        this.#layerManager.resizeAll();

        // Initialize the root node (which will initialize all children)
        this.#rootNode.init();

        this.#initialized = true;
        return this;
    }

    animate(now) {
        if (!this.#running) return;

        this.#animationFrame = requestAnimationFrame(t => this.animate(t));

        const elapsed = now - this.#then;
        const interval = 1000 / this.#fps;

        if (elapsed > interval) {
            const dt = elapsed / 1000; // delta time in seconds
            this.#then = now - (elapsed % interval);

            // 1. Update layer sizes if needed
            this.#layerManager.resizeAll();

            // 2. Update all nodes
            this.#rootNode.update(dt);

            // 3. Render each layer
            const layers = this.#layerManager.getAllLayers();
            for (const layer of layers) {
                // Get layer's custom render function
                const onRender = this.#layerManager.getLayerCallback(layer.id);

                // Either use custom render function or default behavior
                if (onRender) {
                    // Custom rendering - user has full control
                    onRender({
                        layer,
                        context: layer.context,
                        engine: this,
                        deltaTime: dt
                    });
                } else {
                    // Default behavior: clear and draw all nodes for this layer
                    layer.clear();
                }
            }

            // 3.1. Render root node
            this.#rootNode.draw(dt);
        }
    }

    start() {
        if (!this.#initialized) {
            this.init();
        }

        this.#running = true;
        this.#then = performance.now();
        this.animate(this.#then);
    }

    stop() {
        this.#running = false;
        if (this.#animationFrame) {
            cancelAnimationFrame(this.#animationFrame);
            this.#animationFrame = null;
        }
    }

    destroy() {
        this.stop();
        this.#rootNode.destroy();
        this.#initialized = false;
    }
}