function effectsArray() {
    return [
        effect("MatrixRainEffect", ({ } = {}) => new MatrixRainEffect(), {
            ...optionColor("color"),
            ...optionRange("grid", 1, 100, 1, { restart: true }),
            ...optionRange("fade", 0, 1, 0.1),
            ...optionRange("alpha", 0, 1, 0.1),
        }, { background: 'black' }),
        effect("ParticleFlowEffect", ({ } = {}) => new ParticleFlowEffect(), {
            ...optionFile("image", "image/*", {
                emptyValue: true,
                parseVal: (_, el) => {
                    return el.files?.[0];
                },
                restart: true,
            }),
            ...optionRange("particleCount", 1000, 10000, 100, { restart: true }),
            ...optionRange("size", 1, 50, 1, { restart: true }),
            ...optionRange("speed", 0.1, 200, 0.1, { restart: true }),
            ...optionRange("fade", 0.01, 1, 0.01),
            ...optionRange("angle", 0, 360, 1),
        }),
        effect("FlowFieldEffect", ({ } = {}) => new FlowFieldEffect(), {
            ...optionSelect("pattern", [
                "DEFAULT", "polarCoordinates", "simpleHarmonicOscillators", "complexHarmonicOscillators",
                "vortexPattern", "turbulencePattern", "radialGradient", "swirlingPatterns",
                "checkerboardPattern", "wavesInterference", "spiralPattern", "heartbeatPattern",
                "lissajousCurve", "circularWaves", "exponentialPattern", "logarithmicPattern",
                "randomNoise", "fibonacciSpiral", "parabolic", "hyperbolic", "circularHarmonics",
                "roseCurve", "complexNoise", "logisticMap", "henonMap", "lorenzAttractor",
                "duffingMap", "logisticPolar", "sinusoidalWaves", "concentricCircles"
            ], { restart: true }),
            ...optionRange("particles", 100, 10000, 1, { restart: true }),
            ...optionRange("grid", 1, 100, 1, { restart: true }),
            ...optionRange("curve", 0, 5, 0.1, { restart: true }),
            ...optionRange("zoom", 0, 5, 0.1, { restart: true }),
            ...optionRange("rotation", 0, 7, 0.1, { restart: true, parseVal: v => parseFloat(v) }),
            ...optionRange("alpha", 0, 1, 0.1),
        }),
        effect("BarVisualizerEffect", ({ audioCtx } = {}) => new BarVisualizerEffect({ audioCtx }), {
            ...optionRange("volume", 0, 3, 0.1, { emptyValue: true, onchange: ({ el }) => { audioCtx.source.gain.value = el.value; } }),
            ...optionRange("outputVolume", 0, 3, 0.1, { emptyValue: true, onchange: ({ el }) => { audioCtx.output.gain.value = el.value; } }),
            ...optionCheckbox("mic", {
                emptyValue: true, onchange: ({ el }) => {
                    if (el.checked) {
                        AudioSources.connectMic();
                    } else {
                        AudioSources.disconnectMic();
                    }
                }
            }),
            ...optionFile("file", "audio/*", {
                emptyValue: true, onchange: ({ el }) => {
                    if (el.files?.[0]) {
                        AudioSources.connectFile(el.files[0]);
                    } else {
                        AudioSources.disconnectFile();
                    }
                }
            })
        }),
        effect("SpeechVisualizerEffect", ({ audioCtx } = {}) => new SpeechVisualizerEffect({ audioCtx }), {
            ...optionRange("waves", 4, 100, 2),
            ...optionCheckbox("smooth"),
            ...optionRange("topHue", 0, 360, 1),
            ...optionRange("bottomHue", 0, 360, 1),
            ...optionRange("volume", 0, 3, 0.1, { emptyValue: true, onchange: ({ el }) => { audioCtx.source.gain.value = el.value; } }),
            ...optionRange("outputVolume", 0, 3, 0.1, { emptyValue: true, onchange: ({ el }) => { audioCtx.output.gain.value = el.value; } }),
            ...optionCheckbox("mic", {
                emptyValue: true, onchange: ({ el }) => {
                    if (el.checked) {
                        AudioSources.connectMic();
                    } else {
                        AudioSources.disconnectMic();
                    }
                }
            }),
            ...optionFile("file", "audio/*", {
                emptyValue: true, onchange: ({ el }) => {
                    if (el.files?.[0]) {
                        AudioSources.connectFile(el.files[0]);
                    } else {
                        AudioSources.disconnectFile();
                    }
                }
            })
        })
    ];
}
