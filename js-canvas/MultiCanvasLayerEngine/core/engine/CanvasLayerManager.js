import CanvasLayer from "./CanvasLayer.js";

export default class CanvasLayerManager {
    #layers = new Map();
    #layerCallbacks = new Map(); // Store onRender callbacks per layer

    addLayer(id, canvas, options = {}) {
        if (this.#layers.has(id)) throw new Error(`Layer ${id} exists`);

        const layer = new CanvasLayer(id, canvas);
        if (options.styles) Object.assign(canvas.style, options.styles);
        if (options.zIndex) canvas.style.zIndex = options.zIndex;

        this.#layers.set(id, layer);
        this.#layerCallbacks.set(id, options.onRender || null);
        return this;
    }

    getLayer(id) { return this.#layers.get(id); }

    getLayerCallback(id) { return this.#layerCallbacks.get(id); }

    resizeAll() {
        for (const [id, layer] of this.#layers) {
            const canvas = layer.canvas;
            if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
                canvas.width = canvas.clientWidth;
                canvas.height = canvas.clientHeight;
            }
        }
    }

    getAllLayers() {
        return Array.from(this.#layers.values());
    }
}