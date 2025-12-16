class ParticleFlowEffect extends CanvasObject {
    videoCtx;
    image;
    particleCount;
    size;
    speed;
    fade;
    alpha;

    img;
    imgData;
    imgMap;
    children = [];

    constructor({
        videoCtx,
        image = "../../favicon.png",
        particles = 5000,
        size = 8,
        speed = 15,
        angle = 45,
        fade = 0.15,
        alpha = 0.9,
    } = {}) {
        super();
        this.videoCtx = videoCtx;
        this.image = image;
        this.particleCount = particles;
        this.size = size;
        this.speed = speed;
        this.fade = fade;
        this.alpha = alpha;
        this.angle = angle; // goes through setter
    }

    // Cache direction so we don't compute sin/cos every frame
    set angle(v) {
        this._angle = v;
        const rad = (v % 360) * Math.PI / 180;
        this.dirX = Math.cos(rad);
        this.dirY = Math.sin(rad);
    }

    get angle() { return this._angle; }

    async init(_, { width, height }) {
        this.img = await Loader.loadImage(this.image);
        this.imgData = Loader.canvasImageData(this.img, width, height);

        this.imgMap = Array.from({ length: height }, (_, y) =>
            Array.from({ length: width }, (_, x) => {
                const i = (y * width + x) * 4;
                const r = this.imgData.data[i];
                const g = this.imgData.data[i + 1];
                const b = this.imgData.data[i + 2];
                const a = this.imgData.data[i + 3];

                // Faster brightness, no sqrt
                const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;

                return {
                    b: brightness,
                    rgba: `rgba(${r}, ${g}, ${b}, ${a / 255})`
                };
            })
        );

        this.particles = Array.from({ length: this.particleCount }, () =>
            new FlowParticle(this, {
                x: CanvasEffect.rand(0, width, "round"),
                y: CanvasEffect.rand(0, height, "round"),
            })
        );
    }

    update({ width, height }) {
        if (this.videoCtx && this.videoCtx?.playing()) {
            this.imgData = Loader.canvasVideoData(this.videoCtx.video, width, height);
            this.imgMap = Array.from({ length: height }, (_, y) =>
                Array.from({ length: width }, (_, x) => {
                    const i = (y * width + x) * 4;
                    const r = this.imgData.data[i];
                    const g = this.imgData.data[i + 1];
                    const b = this.imgData.data[i + 2];
                    const a = this.imgData.data[i + 3];

                    // Faster brightness, no sqrt
                    const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;

                    return {
                        b: brightness,
                        rgba: `rgba(${r}, ${g}, ${b}, ${a / 255})`
                    };
                })
            );
        }
    }

    draw(ctx, { drawSave, drawObj }) {
        drawSave(() => {
            ctx.globalAlpha = 1;
            ctx.globalCompositeOperation = "destination-in";
            ctx.fillStyle = `rgba(0, 0, 0, ${1 - this.fade * 0.5})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        });

        ctx.globalAlpha = this.alpha;

        this.particles.forEach(drawObj);
    }

}

class FlowParticle extends CanvasObject {
    constructor(parent, { x, y }) {
        super(parent);
        this.x = x;
        this.y = y;
        this.vel = CanvasEffect.rand(parent.speed * 0.01, parent.speed * 0.1);
        this.size = CanvasEffect.rand(parent.size * 0.9, parent.size * 1.1);
    }

    draw(ctx, { updateObj }) {
        ctx.fillStyle = this.cell?.rgba ?? "transparent";
        ctx.fillRect(this.x, this.y, this.size, this.size);
        updateObj(this);
    }

    update({ width, height }) {
        this.cell = this.parent.imgMap?.[Math.floor(this.y)]?.[Math.floor(this.x)];
        const brightness = this.cell?.b ?? 0;

        const speed = (2.5 - brightness) + this.vel;

        this.x = (this.x + this.parent.dirX * speed + width) % width;
        this.y = (this.y + this.parent.dirY * speed + height) % height;
    }
}
