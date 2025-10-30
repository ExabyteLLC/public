class FlowFieldEffect extends CanvasObject {
    // Public properties
    pattern;
    patternProps;
    particles;
    grid;
    curve;
    zoom;
    rotation;
    alpha;

    // Private properties
    cols = 0;
    rows = 0;
    field = [];
    lines = [];

    /**
     * Constructor to initialize the FlowFieldEffect
     * @param {Object} options - Configuration options
     */
    constructor({
        pattern = "DEFAULT",
        patternProps = {},
        particles = 1000,
        grid = 20,
        curve = 2,
        zoom = 0.2,
        rotation = 0,
        alpha = 1
    } = {}) {
        super();
        this.pattern = pattern;
        this.patternProps = patternProps;
        this.particles = particles;
        this.grid = grid;
        this.curve = curve;
        this.zoom = zoom;
        this.rotation = rotation;
        this.alpha = alpha;
    }

    /**
     * Initialize the flow field
     * @param {Object} _ - Unused parameter
     * @param {Object} params - Initialization parameters
     */
    init(_, { width, height, initObj }) {
        // Flow field initialization
        this.rows = Math.ceil(height / this.grid);
        this.cols = Math.ceil(width / this.grid);
        this.field = [];
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                const angle = this.flowEquations(this.pattern, { x, y, width, height });
                this.field.push([Math.cos(angle), Math.sin(angle)]);
            }
        }

        // Initialize lines
        this.lines = [];
        for (let i = 0; i < this.particles; i++) {
            if (!this.lines[i]) {
                this.lines[i] = new FlowFieldLine(this);
                initObj(this.lines[i]);
            }
        }
    }

    /**
     * Draw the flow field
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Object} params - Draw parameters
     */
    draw(ctx, { width, height, drawObj }) {
        ctx.clearRect(0, 0, width, height);
        ctx.globalAlpha = this.alpha;
        this.lines.forEach(drawObj);
    }

    /**
     * Flow equations for different patterns
     * @param {string} type - Pattern type
     * @param {Object} params - Parameters for the flow equation
     * @returns {number} - Calculated angle
     */
    flowEquations(type, { x, y, z = 0, width, height }) {
        let dx, dy, distance, theta, radius, a, b, k, r, goldenRatio, sigma, rho, beta, alpha;
        switch (type) {
            case "polarCoordinates":
                radius = Math.sqrt(x * x + y * y);
                theta = Math.atan2(y, x);
                return (((Math.sin(radius * this.zoom) + Math.cos(theta * this.zoom)) * this.curve) + this.rotation);
            case "simpleHarmonicOscillators":
                return (((Math.sin(x * this.zoom) * Math.cos(y * this.zoom)) * this.curve) + this.rotation);
            case "complexHarmonicOscillators":
                return (((Math.sin(x * this.zoom) + Math.sin(y * this.zoom) + Math.cos(x * this.zoom) + Math.cos(y * this.zoom)) * this.curve) + this.rotation);
            case "vortexPattern":
                dx = x - width / 2;
                dy = y - height / 2;
                distance = Math.sqrt(dx * dx + dy * dy);
                return (((Math.atan2(dy, dx) + distance * this.zoom) * this.curve) + this.rotation);
            case "turbulencePattern":
                return (((Math.sin(x * this.zoom) + Math.cos(y * this.zoom * 0.5) + Math.sin(x * this.zoom * 0.5) + Math.cos(y * this.zoom)) * this.curve) + this.rotation);
            case "radialGradient":
                dx = x - width / 2;
                dy = y - height / 2;
                return (((Math.sin(dx * this.zoom) + Math.cos(dy * this.zoom)) * this.curve) + this.rotation);
            case "swirlingPatterns":
                return (Math.sin(x * this.zoom + y * this.zoom) + Math.cos(y * this.zoom - x * this.zoom)) * this.curve + this.rotation;
            case "checkerboardPattern":
                return ((Math.floor(x * this.zoom) % 2) ^ (Math.floor(y * this.zoom) % 2)) * Math.PI * this.curve + this.rotation;
            case "wavesInterference":
                return (((Math.sin(x * this.zoom) + Math.sin(y * this.zoom * 1.5) + Math.cos(x * this.zoom * 1.5) + Math.cos(y * this.zoom)) * this.curve) + this.rotation);
            case "spiralPattern":
                dx = x - width / 2;
                dy = y - height / 2;
                distance = Math.sqrt(dx * dx + dy * dy);
                return (((Math.atan2(dy, dx) + distance * this.zoom * Math.sin(distance * this.zoom)) * this.curve) + this.rotation);
            case "heartbeatPattern":
                return ((Math.sin(x * this.zoom * Math.sin(y * this.zoom)) * this.curve) + this.rotation);
            case "lissajousCurve":
                a = this.patternProps?.a ?? 3;
                b = this.patternProps?.b ?? 4;
                return (((Math.sin(a * x * this.zoom) + Math.cos(b * y * this.zoom)) * this.curve) + this.rotation);
            case "circularWaves":
                dx = x - width / 2;
                dy = y - height / 2;
                distance = Math.sqrt(dx * dx + dy * dy);
                return ((Math.sin(distance * this.zoom) * this.curve) + this.rotation);
            case "exponentialPattern":
                return (((Math.exp(x * this.zoom) + Math.exp(y * this.zoom)) * this.curve) + this.rotation);
            case "logarithmicPattern":
                return (((Math.log(x * this.zoom + 1) + Math.log(y * this.zoom + 1)) * this.curve) + this.rotation);
            case "randomNoise":
                return ((Math.random() * 2 * Math.PI * this.curve) + this.rotation);
            case "fibonacciSpiral":
                goldenRatio = (1 + Math.sqrt(5)) / 2;
                return ((Math.atan2(y, x) * goldenRatio * this.curve) + this.rotation);
            case 'parabolic':
                return (((Math.pow(x * this.zoom, 2) + Math.pow(y * this.zoom, 2)) * this.curve) + this.rotation);
            case 'hyperbolic':
                return (((Math.sinh(x * this.zoom) + Math.cosh(y * this.zoom)) * this.curve) + this.rotation);
            case 'circularHarmonics':
                dx = x - width / 2;
                dy = y - height / 2;
                distance = Math.sqrt(dx * dx + dy * dy);
                return (((Math.sin(distance * this.zoom) + Math.cos(distance * this.zoom * 0.5)) * this.curve) + this.rotation);
            case 'roseCurve':
                k = this.patternProps?.k ?? 4;
                return ((Math.sin(k * Math.atan2(y, x)) * this.curve) + this.rotation);
            case 'logisticMap':
                r = this.patternProps?.r ?? 3.9;
                return (r * x * (1 - x)) * this.curve + this.rotation;
            case 'henonMap':
                a = this.patternProps?.a ?? 1.4;
                b = this.patternProps?.b ?? 0.3;
                return (x - a * x * x + y * b) * this.curve + this.rotation;
            case 'lorenzAttractor':
                sigma = this.patternProps?.sigma ?? 10;
                rho = this.patternProps?.rho ?? 28;
                beta = this.patternProps?.beta ?? 8 / 3;
                dx = sigma * (y - x);
                dy = x * (rho - z) - y;
                const dz = x * y - beta * z;
                return ((Math.atan2(dy, dx) * this.curve) + this.rotation);
            case 'duffingMap':
                alpha = this.patternProps?.alpha ?? 2.75;
                beta = this.patternProps?.beta ?? 0.15;
                return (-alpha * x - beta * x * x * x + y) * this.curve + this.rotation;
            case 'logisticPolar':
                radius = Math.sqrt(x * x + y * y);
                theta = Math.atan2(y, x);
                r = this.patternProps?.r ?? 3.9;
                return (r * radius * (1 - radius)) * this.curve + this.rotation + theta;
            case 'sinusoidalWaves':
                return (((Math.sin(x * this.zoom * 1.5) + Math.cos(y * this.zoom * 2)) * this.curve) + this.rotation);
            case 'concentricCircles':
                dx = x - width / 2;
                dy = y - height / 2;
                distance = Math.sqrt(dx * dx + dy * dy);
                return (((Math.sin(distance * this.zoom) + Math.cos(distance * this.zoom * 0.5)) * this.curve) + this.rotation);
            default:
                return (((Math.cos(x * this.zoom) + Math.sin(y * this.zoom)) * this.curve) + this.rotation);
        }
    }

    /**
     * Get flow vector for a given position
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {Array<number>} - Flow vector [cos, sin]
     */
    getFlow(x, y) {
        const cx = Math.floor(x / this.grid);
        const cy = Math.floor(y / this.grid);
        const index = cy * this.cols + cx;
        return this.field?.[index];
    }
}

class FlowFieldLine extends CanvasObject {
    // Parameters
    x;
    y;
    color;
    speed;
    maxLength;
    timer;
    history;
    flow;

    /**
     * Constructor to initialize the FlowFieldLine
     * @param {FlowFieldEffect} parent - Parent FlowFieldEffect object
     */
    constructor(parent) {
        super(parent);
    }

    /**
     * Initialize the line
     * @param {Object} _ - Unused parameter
     * @param {Object} params - Initialization parameters
     */
    init(_, { height, width }) {
        this.x = CanvasEffect.rand(0, width, "floor");
        this.y = CanvasEffect.rand(0, height, "floor");
        this.color = `hsl(${360 * (this.x / width)},100%,70%)`;
        this.speed = CanvasEffect.rand(2, 10);
        this.maxLength = CanvasEffect.rand(10, 200);
        this.timer = this.maxLength * 2;
        this.history = [{ x: this.x, y: this.y }];
        this.flow = this.parent.getFlow(this.x, this.y);
    }

    /**
     * Draw the line
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    draw(ctx, { updateObj }) {
        if (this.history.length > 0) {
            ctx.strokeStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(this.history[0].x, this.history[0].y);
            for (let i = 1; i < this.history.length; i++) {
                ctx.lineTo(this.history[i].x, this.history[i].y);
            }
            ctx.stroke();
        }
        updateObj(this);
    }

    /**
     * Update the line
     * @param {Object} params - Update parameters
     */
    update({ initObj }) {
        this.timer--;
        if (this.timer > 0) {
            const flow = this.parent.getFlow(this.x, this.y);
            if (flow) this.flow = flow;
            if (!this.flow) return;
            const [cos, sin] = this.flow;
            this.x += cos * this.speed;
            this.y += sin * this.speed;
            this.history.push({ x: this.x, y: this.y });
            if (this.history.length > this.maxLength) {
                this.history.shift();
            }
        } else if (this.history.length > 1) {
            this.history.shift();
        } else {
            initObj(this);
        }
    }
}
