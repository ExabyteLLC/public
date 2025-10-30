class MatrixRainEffect extends CanvasObject {
    // Public properties
    color;
    grid;
    alpha;
    fade;

    // Private properties
    cols;
    symbols = [];

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
        this.symbols = [];
        this.cols = Math.ceil(width / this.grid) + 1;
        for (let i = -1; i <= this.cols; i++) {
            this.symbols[i] = new MatrixRainSymbol(this, { x: i, y: CanvasEffect.rand(0, height, "round") });
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

        this.symbols.forEach(drawObj);
    }
}

class MatrixRainSymbol extends CanvasObject {
    // Private properties
    x;
    y;

    /**
     * Constructor to initialize the MatrixRainSymbol
     * @param {MatrixRainEffect} parent - Parent MatrixRainEffect object
     * @param {Object} params - Initialization parameters
     */
    constructor(parent, { x, y }) {
        super(parent);
        this.x = x;
        this.y = y;
    }

    /**
     * Draw the matrix rain symbol
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Object} params - Draw parameters
     */
    draw(ctx, { updateObj }) {
        const t = this.symbol();
        const cx = this.x * this.parent.grid;
        const cy = this.y * this.parent.grid;
        ctx.fillText(t, cx, cy);
        //
        updateObj(this);
    }

    update({ height }) {
        // Update symbol position
        if ((this.y * this.parent.grid) > height && Math.random() > 0.98) {
            this.y = 0;
        } else {
            this.y += 1;
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
