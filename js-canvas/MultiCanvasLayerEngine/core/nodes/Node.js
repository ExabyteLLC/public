export default class Node {
    parent = null;
    children = [];
    layerId = null;
    #initialized = false;

    constructor(options = {}) {
        if (options.layerId) this.layerId = options.layerId;
    }

    get engine() {
        let curr = this.parent;
        while (curr) {
            if (curr.layerManager) return curr;
            curr = curr.parent;
        }
        return null;
    }

    addChild(node) {
        node.parent = this;
        this.children.push(node);

        // If this node is already initialized, initialize the child
        if (this.#initialized) {
            node.init();
        }
        return node;
    }

    removeChild(node) {
        const index = this.children.indexOf(node);
        if (index > -1) {
            this.children.splice(index, 1);
            node.destroy();
        }
    }

    // Initialize the node and all its children
    init() {
        if (this.#initialized) return;

        const engine = this.engine;
        if (engine) {
            const layer = engine.layerManager.getLayer(this.layerId);
            this.onInit({ layer, engine });
        }

        this.children.forEach(child => child.init());
        this.#initialized = true;
    }

    // Update node and children
    update(dt) {
        const engine = this.engine;
        if (!engine) return;
        const layer = engine.layerManager.getLayer(this.layerId);
        this.onUpdate({ layer, context: layer?.context, engine, deltaTime: dt });
        this.children.forEach(child => child.update(dt));
    }

    // Draw node on specific layer
    draw(dt) {
        const engine = this.engine;
        if (!engine) return;
        const layer = engine.layerManager.getLayer(this.layerId);
        this.onDraw({ layer, context: layer?.context, engine, deltaTime: dt });
        this.children.forEach(child => child.draw(dt));
    }

    // Destroy node and children
    destroy() {
        const engine = this.engine;
        if (engine) {
            const layer = engine.layerManager.getLayer(this.layerId);
            this.onDestroy({ layer, engine });
        }

        this.children.forEach(child => child.destroy());
        this.#initialized = false;
    }

    // Lifecycle hooks (to be overridden)
    onInit(props = {}) { }
    onUpdate(props = {}) { }
    onDraw(props = {}) { }
    onDestroy(props = {}) { }
}