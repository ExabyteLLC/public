// engine.js (improved, simplified, but keeps your old ergonomics)

export class Engine {
    constructor(canvas, { fps = 60, pixelRatio = devicePixelRatio } = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.root = new Node();

        this.fps = fps;
        this.fixedStep = 1000 / fps;
        this.accum = 0;
        this.last = performance.now();

        this.pixelRatio = pixelRatio;
        this.resize();
        window.addEventListener("resize", () => this.resize());
    }

    resize() {
        const w = this.canvas.clientWidth || window.innerWidth;
        const h = this.canvas.clientHeight || window.innerHeight;
        const pr = this.pixelRatio;

        this.canvas.width = w * pr;
        this.canvas.height = h * pr;
        this.ctx.setTransform(pr, 0, 0, pr, 0, 0);

        if (this.root.onResize) this.root.onResize(w, h);
    }

    start() {
        const loop = (t) => {
            const dt = t - this.last;
            this.last = t;
            this.accum += dt;

            while (this.accum >= this.fixedStep) {
                this.root.update(this.fixedStep / 1000);
                this.accum -= this.fixedStep;
            }

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.root.draw(this.ctx);
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }
}