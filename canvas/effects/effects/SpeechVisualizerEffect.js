class SpeechVisualizerEffect extends CanvasObject {
    // Public properties
    audioCtx;
    waves;
    smooth;
    topHue;
    bottomHue;

    /**
     * Constructor to initialize the SpeechVisualizerEffect
     * @param {Object} options - Configuration options
     */
    constructor({ audioCtx, waves = 4, smooth = true, topHue = 240, bottomHue = 0 } = {}) {
        super();
        this.audioCtx = audioCtx;
        this.waves = waves;
        this.smooth = smooth;
        this.topHue = topHue;
        this.bottomHue = bottomHue;
    }

    /**
     * Draw the speech visualizer effect
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Object} params - Draw parameters
     */
    draw(ctx, { width, height, centerY }) {
        ctx.clearRect(0, 0, width, height);
        if (!this.audioCtx) return;

        // generate waves
        const { pointsX, pointsY } = this.generateControlPoints(this.waves);

        // Get the frequency data and normalize it
        const frequencies = this.audioCtx.getFrequencies();
        const amp = this.normalizeArray(frequencies, Math.ceil(pointsX.length / 2));
        const waves = [...amp.reverse()];
        amp.pop();
        amp.reverse();
        waves.push(...amp);

        // Configure canvas drawing properties
        ctx.lineJoin = 'round';
        ctx.lineCap = 'butt';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 2;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        const lightness = (waves.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / waves.length) / 255;

        // Draw the visualizer lines
        for (let i = 0.1; i <= 1; i += 0.2) {
            const subW = (i / 10)
            this.drawLine(ctx, 2, 0.85 - subW, this.bottomHue, lightness, -i * 0.9, waves, pointsX, pointsY, width, centerY);
            this.drawLine(ctx, -2, 0.9 - subW, this.topHue, lightness, i * 1, waves, pointsX, pointsY, width, centerY);
        }
    }

    /**
     * Generate control points for the visualizer based on the wave count
     * @param {number} waveCount - Number of waves to generate
     * @returns {Object} - Control points { pointsX, pointsY }
     */
    generateControlPoints(waveCount) {
        var pointsX = [0, 0.05]; // Starting points
        var pointsY = [0, 0]; // Starting points

        var wavesX = [];
        var wavesY = [];
        var gridX = (0.8 / waveCount);
        var gridY = (0.9 / waveCount);
        for (let i = 1; i <= waveCount; i++) {
            wavesX.push((0.05 + (i * gridX)) / 2);
            wavesY.push(((i * gridY)) * (i % 2 === 0 ? 1 : -1));
        }
        //
        pointsX.push(...wavesX, 0.5); // Ending points
        pointsY.push(...wavesY, (waveCount % 2 === 0 ? -1 : 1));
        //
        wavesX.reverse();
        wavesY.reverse();
        pointsY.push(...wavesY);
        for (let i = 0; i < wavesX.length; i++) {
            pointsX.push(1 - (wavesX[i]));
        }
        pointsX.push(0.95, 1); // Ending points
        pointsY.push(0, 0);

        return { pointsX, pointsY };
    }

    /**
     * Normalize frequency values into a smaller array of given length
     * @param {Uint8Array} array - Original frequency array
     * @param {number} length - Desired length of the normalized array
     * @returns {Array} - Normalized array
     */
    normalizeArray(array, length) {
        const factor = Math.floor(array.length / length);
        const normalizedArray = [];
        for (let i = 0; i < length; i++) {
            const start = i * factor;
            const end = start + factor;
            const slice = array.slice(start, end);
            const avg = slice.reduce((acc, val) => acc + val, 0) / slice.length;
            normalizedArray.push(avg);
        }
        return normalizedArray;
    }

    /**
     * Draw a smooth line for the visualizer
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} offsetY - Vertical offset for the line
     * @param {number} widthPerc - Percentage of canvas width to use
     * @param {string} color - Stroke color
     * @param {number} sign - Direction multiplier (-1 or 1)
     * @param {Array} waves - Amplitude values for the wave
     * @param {Array} pointsX - X control points
     * @param {Array} pointsY - Y control points
     * @param {number} width - Canvas width
     * @param {number} centerY - Center Y coordinate
     */
    drawLine(ctx, offsetY, widthPerc, hue, lightness, sign, waves, pointsX, pointsY, width, centerY) {
        const lineWidth = widthPerc * width;
        const widthDiff = (width - lineWidth) / 2;
        const Y = centerY + offsetY;
        const X1 = widthDiff;
        const X2 = lineWidth + widthDiff;
        ctx.beginPath();
        ctx.moveTo(X1, Y);
        for (let i = 0; i < pointsX.length; i++) {
            const x = X1 + (pointsX[i] * lineWidth);
            const y = Y + (pointsY[i] * sign * waves[i]);
            if (this.smooth) {
                if (i < pointsX.length - 1) {
                    const nextX = X1 + (pointsX[i + 1] * lineWidth);
                    const nextY = Y + (pointsY[i + 1] * sign * waves[i + 1]);
                    const cpX = (x + nextX) / 2;
                    const cpY = (y + nextY) / 2;
                    ctx.quadraticCurveTo(x, y, cpX, cpY);
                }
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.lineTo(X2, Y);
        ctx.strokeStyle = `hsl(${hue}, 100%, ${50 + (lightness * 25)}%)`;
        ctx.shadowColor = `hsl(${hue}, 100%, ${40 + (lightness * 25)}%)`;
        ctx.stroke();
    }
}
/*
    const pointsX = [0, 0.075, 0.125, 0.25, 0.35, 0.5, 0.65, 0.75, 0.875, 0.925, 1];
    const pointsY = [0, 0, 0.25, -0.45, 0.6, -1, 0.6, -0.45, 0.25, 0, 0];
*/