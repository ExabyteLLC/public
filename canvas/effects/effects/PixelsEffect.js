class PixelsEffect extends CanvasObject {
    // Public 
    image;
    cell;
    amount;
    filter;
    hover;
    hoverRadius;
    hoverStrength;
    fade;
    alpha;

    // Private properties
    img;
    imgData;
    imgMap;
    particles = [];

    /**
     * Constructor to initialize the FlowFieldEffect
     * @param {Object} options - Configuration options
     */
    constructor({
        image = "../../favicon.png",
        cell = 10,
        amount = 5000,
        filter = null, // grayscale, invert, sepia
        hover = null, // repulse, zoom, displace
        hoverRadius = 100,
        hoverStrength = 5,
        fade = 0.25,
        alpha = 0.9,
    } = {}) {
        super();
        this.image = image;
        this.cell = cell;
        this.amount = amount;
        this.filter = filter;
        this.hover = hover;
        this.hoverRadius = hoverRadius;
        this.hoverStrength = hoverStrength;
        this.fade = fade;
        this.alpha = alpha;
    }

    /**
     * Initialize the flow field
     * @param {Object} _ - Unused parameter
     * @param {Object} params - Initialization parameters
     */
    async init(_, { width, height, initObj }) {
        this.img = await Loader.loadImage(this.image);
        this.imgData = Loader.canvasImageData(this.img, width, height);
        this.imgMap = [];
        for (let y = 0; y < height; y++) {
            var row = [];
            for (let x = 0; x < width; x++) {
                const c = [
                    this.imgData.data[(y * width + x) * 4 + 0],
                    this.imgData.data[(y * width + x) * 4 + 1],
                    this.imgData.data[(y * width + x) * 4 + 2],
                    this.imgData.data[(y * width + x) * 4 + 3]
                ];
                const b = Math.sqrt(
                    c[0] * c[0] * 0.299 +
                    c[1] * c[1] * 0.587 +
                    c[2] * c[2] * 0.114
                ) / 100;
                row.push({ b, c, rgba: `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${c[3] / 255})` });
            }
            this.imgMap.push(row);
        };
        for (let i = 0; i < this.amount; i++) {
            this.particles.push(new PixelsParticle(this, {
                x: CanvasEffect.rand(0, width, "round"),
                y: CanvasEffect.rand(0, height, "round")
            }));
        }
    }

    /**
     * Draw the flow field
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

        this.particles.forEach(drawObj);
    }

}
class PixelsParticle extends CanvasObject {
    // Private properties
    x;
    y;
    acc;
    vel;
    size;
    cell;

    /**
     * Constructor to initialize the MatrixRainSymbol
     * @param {MatrixRainEffect} parent - Parent MatrixRainEffect object
     * @param {Object} params - Initialization parameters
     */
    constructor(parent, { x, y }) {
        super(parent);
        this.x = x;
        this.y = y;
        this.acc = 0;
        this.vel = CanvasEffect.rand(0.1, 1.5);
        this.size = CanvasEffect.rand(1, 3.5);
    }

    /**
     * Draw the matrix rain symbol
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Object} params - Draw parameters
     */
    draw(ctx, { updateObj }) {
        ctx.fillStyle = this.cell?.rgba ?? "transparent";
        ctx.fillRect(this.x, this.y, this.size, this.size);
        //
        updateObj(this);
    }

    update({ width, height }) {
        this.cell = this.parent.imgMap?.[Math.floor(this.y)]?.[Math.floor(this.x)] ?? { b: 0 };
        this.acc = this.cell.b;
        var move = (2.5 - this.acc) + this.vel;

        // Update symbol position
        if (this.y >= height) {
            this.y = 0;
            this.x = CanvasEffect.rand(0, width, "round");
        } else {
            this.y += move;
        }

        if (this.x >= width) {
            this.x = 0;
            this.y = CanvasEffect.rand(0, height, "round");
        } else {
            this.x += move;
        }
    }
}