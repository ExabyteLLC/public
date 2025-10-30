class BarVisualizerEffect extends CanvasObject {
    // Public properties
    audioCtx;

    /**
     * Constructor to initialize the MatrixRainEffect
     * @param {Object} options - Configuration options
     */
    constructor({
        audioCtx
    } = {}) {
        super();
        this.audioCtx = audioCtx;
    }

    /**
     * Draw the matrix rain effect
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Object} params - Draw parameters
     */
    draw(ctx, { width, height, centerY }) {
        ctx.clearRect(0, 0, width, height);
        if (!this.audioCtx) return;
        // draw
        const frequencies = this.audioCtx.getFrequencies();
        if (frequencies) {
            // freq
            const array = [...frequencies.reverse(), ...frequencies.reverse()];
            const grid = width / array.length;
            for (let i = 0; i < array.length; i++) {
                const freq = array[i];
                ctx.fillStyle = this.colorHue(freq);
                ctx.fillRect(i * grid, centerY - (freq / 2), grid, freq);
            }
        }

        const waveform = this.audioCtx.getWaveform();
        if (waveform) {
            // wave
            const grid = width / waveform.length;
            for (let i = 0; i < waveform.length; i++) {
                const wave = waveform[i];
                ctx.fillStyle = this.colorHue(wave);
                ctx.fillRect(i * grid, 0, grid, wave - 64);
                ctx.fillRect(i * grid, height - (wave - 64), grid, wave);
            }
        }
    }

    colorHue(val) {
        return `hsl(${200 + ((val / 255) * (360 - 200))},100%,50%)`;
    }
}