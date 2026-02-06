class CanvasEffect {
    #lastTime = 0;
    #fps = 60;
    #timer = 0;
    #animationFrame = null;
    #effect;
    #canvas;
    #context;

    /**
     * Constructor to initialize CanvasEffect
     * @param {HTMLCanvasElement} canvas - Canvas element
     * @param {CanvasObject} effect - Effect to be applied on canvas
     * @param {Object} options - Configuration options
     */
    constructor(canvas, effect, { fps = 30 } = {}) {
        this.#canvas = canvas;
        this.#context = this.#canvas.getContext("2d");
        this.#fps = fps;
        this.#effect = effect;

        window.addEventListener('resize', this.#debounce(() => this.#resize(), 100));
    }

    /**
     * Start the canvas animation
     */
    async start() {
        await this.#initiate();
        this.#animate(0);
    }

    /**
     * Stop the canvas animation
     */
    stop() {
        if (this.#animationFrame) {
            cancelAnimationFrame(this.#animationFrame);
        }
    }

    /**
     * Restart the canvas animation
     */
    async restart() {
        this.stop();
        await this.#resize();
        await this.start();
    }

    /**
     * Get the current effect
     * @returns {CanvasObject} - Current effect
     */
    getEffect() {
        return this.#effect;
    }

    /**
     * Set a new effect
     * @param {CanvasObject} effect - New effect to set
     */
    async setEffect(effect) {
        this.stop();
        this.#effect = effect;
        await this.start();
    }

    /**
     * Set the frames per second (FPS)
     * @param {number} fps - Frames per second
     */
    setFPS(fps) {
        this.#fps = fps;
    }

    /**
     * Initialize the canvas and effect
     */
    async #initiate() {
        this.#resizeCanvas();
        await this.#initObj(this.#effect);
    }

    /**
     * Resize the canvas to match its offset dimensions
     */
    #resizeCanvas() {
        this.#canvas.width = this.#canvas.offsetWidth;
        this.#canvas.height = this.#canvas.offsetHeight;
        this.#context = this.#canvas.getContext("2d");
    }

    /**
     * Handle window resize event
     */
    async #resize() {
        this.#resizeCanvas();
        await this.#initObj(this.#effect);
    }

    /**
     * Animation loop
     * @param {DOMHighResTimeStamp} timeStamp - Current time stamp
     */
    #animate = (timeStamp) => {
        const deltaTime = timeStamp - this.#lastTime;
        const nextFrame = 1000 / this.#fps;

        if (this.#timer > nextFrame) {
            this.#drawObj(this.#effect);
            this.#updateObj(this.#effect);
            this.#timer = 0;
        } else {
            this.#timer += deltaTime;
        }

        this.#lastTime = timeStamp;
        this.#animationFrame = requestAnimationFrame(this.#animate);
    }

    /**
     * Get object parameters
     * @param {Object} data - Additional data
     * @returns {Object} - Object parameters
     */
    #objParams(data) {
        return {
            canvas: this.#canvas,
            width: this.#canvas.width,
            height: this.#canvas.height,
            centerX: this.#canvas.width / 2,
            centerY: this.#canvas.height / 2,
            initObj: this.#initObj.bind(this),
            drawObj: this.#drawObj.bind(this),
            updateObj: this.#updateObj.bind(this),
            drawSave: this.#drawSave.bind(this),
            data,
        };
    }

    /**
     * Initialize the object
     * @param {CanvasObject} obj - Object to initialize
     * @param {Object} data - Additional data
     */
    async #initObj(obj, data) {
        if (obj?.init) {
            await obj.init(this.#context, this.#objParams(data), obj);
        }
    }

    /**
     * Update the object
     * @param {CanvasObject} obj - Object to update
     * @param {Object} data - Additional data
     */
    #updateObj(obj, data) {
        if (obj?.update) {
            obj.update(this.#objParams(data), obj);
        }
    }

    /**
     * Draw the object
     * @param {CanvasObject} obj - Object to draw
     * @param {Object} data - Additional data
     */
    #drawObj(obj, data) {
        if (obj?.draw) {
            obj.draw(this.#context, this.#objParams(data), obj);
        }
    }

    /**
     * Save and restore canvas context state
     * @param {Function} draw - Draw function
     */
    #drawSave(draw) {
        this.#context.save();
        if (draw) {
            draw(this.#context);
        }
        this.#context.restore();
    }

    /**
     * Generate a random number
     * @param {number} [min=0] - Minimum value
     * @param {number} [max=1] - Maximum value
     * @param {string} [operation] - Math operation
     * @returns {number} - Random number
     */
    static rand(min = 0, max = 1, operation) {
        let rand = (Math.random() * (max - min)) + min;
        if (Math?.[operation]) {
            rand = Math[operation](rand);
        }
        return rand;
    }

    /**
     * Debounce function to limit the rate at which a function can fire
     * @param {Function} func - Function to debounce
     * @param {number} wait - Time to wait in milliseconds
     * @returns {Function} - Debounced function
     */
    #debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
}

class CanvasObject {
    parent;

    /**
     * Constructor to initialize CanvasObject
     * @param {CanvasObject} [parent] - Parent object
     */
    constructor(parent) {
        this.parent = parent;
    }

    /**
     * Initialize the object (to be overridden)
     */
    init() { }

    /**
     * Update the object (to be overridden)
     */
    update() { }

    /**
     * Draw the object (to be overridden)
     */
    draw() { }
}
