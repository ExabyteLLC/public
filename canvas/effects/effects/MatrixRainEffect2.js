class MatrixRainEffect2 extends CanvasObject {
    // Public properties
    color;
    grid;
    alpha;
    fade;

    // Private properties
    layerCount = 10;
    layers = [];

    /**
     * Constructor to initialize the MatrixRainEffect
     * @param {Object} options - Configuration options
     */
    constructor({
        color = "#5cfc30",
        grid = 25,
        alpha = 0.9,
        fade = 0.15,
    } = {}) {
        super();
        this.color = color;
        this.grid = grid;
        this.alpha = alpha;
        this.fade = fade;
    }

    /**
     * Initialize the matrix rain effect
     * @param {Object} _ - Unused parameter
     * @param {Object} params - Initialization parameters
     */
    init(_, { width, height }) {
        this.layers = [];
        for (let i = 0; i < this.layerCount; i++) {
            const layer = new MatrixRainLayer(this, { layer: i });
            layer.init({ width, height });
            this.layers.push(layer);
        }
    }

    /**
     * Draw the matrix rain effect
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Object} params - Draw parameters
     */
    draw(ctx, { drawSave, drawObj, initObj }) {
        drawSave(() => {
            ctx.globalAlpha = 1;
            ctx.globalCompositeOperation = "destination-in";
            ctx.fillStyle = `rgba(0, 0, 0, ${1 + (-0.5 * this.fade)})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        });

        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.font = `${this.grid}px monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.textRendering = "optimizeSpeed";

        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;

        this.layers.forEach(layer => layer.draw(ctx, canvas));
    }
}

class MatrixRainLayer {
    parent;
    layer;

    depth;
    fontSize;
    gridSpacing;
    speed;
    alpha;
    fade;

    symbols = [];

    constructor(parent, { layer }) {
        this.parent = parent;
        this.layer = layer;

        // 0 (far) → 1 (near)
        this.depth = layer / (parent.layerCount - 1);

        // Far = bigger spacing, smaller font
        this.fontSize = this.lerp(
            parent.grid * 0.6,
            parent.grid * 1.6,
            this.depth
        );

        this.gridSpacing = this.lerp(
            parent.grid * 0.5,   // FAR = dense
            parent.grid * 2.4,   // NEAR = sparse
            this.depth
        );

        this.speed = this.lerp(0.25, 1.2, this.depth);
        this.alpha = this.lerp(0.25, 1.0, this.depth);
        this.fade = this.lerp(0.05, 0.2, this.depth);
    }

    init({ width, height }) {
        const cols = Math.ceil(width / this.gridSpacing) + 1;
        this.symbols.length = 0;

        for (let i = -1; i <= cols; i++) {
            this.symbols.push(
                new MatrixRainSymbol2(this, {
                    x: i,
                    y: CanvasEffect.rand(0, height / this.gridSpacing, "round")
                })
            );
        }
    }

    draw(ctx, canvas) {
        ctx.globalAlpha = this.alpha;
        ctx.font = `${this.fontSize}px monospace`;

        this.symbols.forEach(s => s.draw(ctx, canvas));
    }

    lerp(a, b, t) {
        return a + (b - a) * t;
    }
}

class MatrixRainSymbol2 {
    parent;
    x;
    y;

    constructor(parent, { x, y }) {
        this.parent = parent;
        this.x = x;
        this.y = y;
    }

    draw(ctx, canvas) {
        const t = this.symbol();
        const cx = this.x * this.parent.gridSpacing;
        const cy = this.y * this.parent.gridSpacing;

        ctx.fillText(t, cx, cy);
        this.update(canvas);
    }

    update(canvas) {
        if ((this.y * this.parent.gridSpacing) > canvas.height && Math.random() > 0.98) {
            this.y = 0;
        } else {
            this.y += this.parent.speed;
        }
    }

    /**
     * Get a random symbol from the set
     * @returns {string} - Random symbol
     */
    symbol() {
        const symbols = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ±µΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρστυφχψωЁАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюяё٠١٢٣٤٥٦٧٨٩ابتثجحخدذرزسشصضطظعغفقكلمنهوي∇∑√∞∫≈≠≡≤≥♩♪♫♬♭♮♯あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんァアィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロワヰヱヲンヴ';
        const i = CanvasEffect.rand(0, symbols.length, "floor");
        return symbols.charAt(i);
    }
}
