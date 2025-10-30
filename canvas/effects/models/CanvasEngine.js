class CanvasEngine {
    #canvas;
    #context;
    #lastTime = 0;
    #fps = 0;
    #data = {};
    #fpsTimer = 0;
    #fpsInfinite = true;
    #fpsLimit = 60;
    #sizeAuto = false;
    #resolutionWidth = 800;
    #resolutionHeight = 600;
    #animationFrame;
    #objects = new Map(); // Use a Map for efficient object management
    #garbage = [];
    #layers = []; // Support for layered rendering

    onInitiate;
    onRender;

    constructor(canvas, {
        fpsInfinite = true,
        fpsLimit = 60,
        sizeAuto = false,
        resolutionWidth = 800,
        resolutionHeight = 600,
    } = {}) {
        if (!(canvas instanceof HTMLCanvasElement)) {
            throw new Error("Invalid canvas element");
        }
        this.#canvas = canvas;
        this.#context = this.#canvas.getContext("2d");
        if (!this.#context) {
            throw new Error("Failed to get canvas context");
        }
        window.addEventListener('resize', this.#debounce(() => this.#resize(), 100));
        this.#initializeEventListeners();

        this.#fpsInfinite = fpsInfinite;
        this.#fpsLimit = fpsLimit;
        this.#sizeAuto = sizeAuto;
        this.#resolutionWidth = resolutionWidth;
        this.#resolutionHeight = resolutionHeight;
    }

    async start() {
        await this.#initiate();
        this.#render(0);
    }

    stop() {
        if (this.#animationFrame) {
            cancelAnimationFrame(this.#animationFrame);
            this.#animationFrame = null;
        }
    }

    async restart() {
        this.#resize();
        await this.start();
    }

    async settings({
        fpsInfinite,
        fpsLimit,
        sizeAuto,
        resolutionWidth,
        resolutionHeight,
    } = {}) {
        if (fpsInfinite !== undefined) this.#fpsInfinite = fpsInfinite;
        if (fpsLimit !== undefined) this.#fpsLimit = fpsLimit;
        if (sizeAuto !== undefined) this.#sizeAuto = sizeAuto;
        if (resolutionWidth !== undefined) this.#resolutionWidth = resolutionWidth;
        if (resolutionHeight !== undefined) this.#resolutionHeight = resolutionHeight;
        await this.#initiate();
    }

    createObject({ onInitiate, onRender, layer = 0 }) {
        const obj = new CanvasObject(this);
        obj.onInitiate = onInitiate;
        obj.onRender = onRender;
        obj.layer = layer;
        this.#objects.set(obj, obj);
        if (!this.#layers[layer]) {
            this.#layers[layer] = [];
        }
        this.#layers[layer].push(obj);
        return obj;
    }

    deleteObject(object) {
        this.#garbage.push(object);
    }

    async #initiate() {
        this.#resizeCanvas(true);
        const data = {
            ctx: this.#context,
            canvas: this.#canvas,
            width: this.#canvas.width,
            height: this.#canvas.height,
            objects: Array.from(this.#objects.values()),
            ...this.#data,
        };
        for (let obj of this.#objects.values()) {
            await obj?.initiate(data);
        }
        if (this.onInitiate) await this.onInitiate(data);
    }

    #resizeCanvas(init = false) {
        if (this.#sizeAuto) {
            this.#canvas.width = this.#canvas.offsetWidth;
            this.#canvas.height = this.#canvas.offsetHeight;
        } else if (init) {
            this.#canvas.width = this.#resolutionWidth;
            this.#canvas.height = this.#resolutionHeight;
        }
        this.#data.centerX = this.#canvas.width / 2;
        this.#data.centerY = this.#canvas.height / 2;
        this.#data.maxDim = Math.max(this.#canvas.width, this.#canvas.height);
        this.#data.minDim = Math.min(this.#canvas.width, this.#canvas.height);
    }

    #resize() {
        this.#resizeCanvas();
    }

    #render = (timestamp) => {
        const deltaTime = timestamp - this.#lastTime;
        this.#lastTime = timestamp;
        this.#fps = 1000 / deltaTime;

        if (!this.#fpsInfinite && this.#fpsLimit) {
            const nextFrame = 1000 / this.#fpsLimit;
            if (this.#fpsTimer > nextFrame) {
                this.#animate(deltaTime);
                this.#fpsTimer = 0;
            } else {
                this.#fpsTimer += deltaTime;
            }
        } else {
            this.#animate(deltaTime);
        }
        this.#animationFrame = requestAnimationFrame(this.#render);
    }

    #animate(deltaTime) {
        const data = {
            deltaTime,
            fps: this.#fps,
            ctx: this.#context,
            canvas: this.#canvas,
            width: this.#canvas.width,
            height: this.#canvas.height,
            objects: Array.from(this.#objects.values()),
            ...this.#data,
        };
        for (let layer of this.#layers) {
            if (layer) {
                for (let obj of layer) {
                    obj?.render(data);
                }
            }
        }
        if (this.onRender) this.onRender(data);
        this.#recycle();
    }

    #recycle() {
        for (let object of this.#garbage) {
            this.#objects.delete(object);
            const layer = this.#layers[object.layer];
            if (layer) {
                const index = layer.indexOf(object);
                if (index > -1) {
                    layer.splice(index, 1);
                }
            }
        }
        this.#garbage = [];
    }

    #debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    #initializeEventListeners() {
        this.#canvas.addEventListener('click', this.#handleClick.bind(this));
        this.#canvas.addEventListener('contextmenu', this.#handleContextmenu.bind(this));
        this.#canvas.addEventListener('mousedown', this.#handleMouseDown.bind(this));
        this.#canvas.addEventListener('mousemove', this.#handleMouseMove.bind(this));
        this.#canvas.addEventListener('mouseup', this.#handleMouseUp.bind(this));
        window.addEventListener('keydown', this.#handleKeyDown.bind(this));
        window.addEventListener('keyup', this.#handleKeyUp.bind(this));
    }
    #handleClick(event) {
        const { offsetX, offsetY } = event;
        for (let obj of this.#objects.values()) {
            if (obj.handleClick) {
                obj.handleClick({ x: offsetX, y: offsetY });
            }
        }
    }
    #handleContextmenu(event) {
        event.preventDefault();
        const { offsetX, offsetY } = event;
        for (let obj of this.#objects.values()) {
            if (obj.handleRightClick) {
                obj.handleRightClick({ x: offsetX, y: offsetY });
            }
        }
        return false;
    }
    #handleMouseDown(event) {
        const { offsetX, offsetY } = event;
        for (let obj of this.#objects.values()) {
            if (obj.handleMouseDown) {
                obj.handleMouseDown({ x: offsetX, y: offsetY });
            }
        }
    }
    #handleMouseMove(event) {
        const { offsetX, offsetY } = event;
        for (let obj of this.#objects.values()) {
            if (obj.handleMouseMove) {
                obj.handleMouseMove({ x: offsetX, y: offsetY });
            }
        }
    }
    #handleMouseUp(event) {
        const { offsetX, offsetY } = event;
        for (let obj of this.#objects.values()) {
            if (obj.handleMouseUp) {
                obj.handleMouseUp({ x: offsetX, y: offsetY });
            }
        }
    }
    #handleKeyDown(event) {
        for (let obj of this.#objects.values()) {
            if (obj.handleKeyDown) {
                obj.handleKeyDown(event);
            }
        }
    }
    #handleKeyUp(event) {
        for (let obj of this.#objects.values()) {
            if (obj.handleKeyUp) {
                obj.handleKeyUp(event);
            }
        }
    }
}

class CanvasObject {
    #engine;
    onInitiate;
    onRender;

    /**
     * Constructor to initialize CanvasObject
     * @param {CanvasEngine} engine - Engine instance
     */
    constructor(engine) {
        this.#engine = engine;
    }

    /**
     * Initialize the object
     * @param {Object} data - Initialization data
     */
    async initiate(data) {
        if (this.onInitiate) await this.onInitiate(data);
    }

    /**
     * Render the object
     * @param {Object} data - Render data
     */
    render(data) {
        if (this.onRender) this.onRender(data);
    }

    /**
     * Delete the object
     */
    delete() {
        this.#engine.deleteObject(this);
    }
}
