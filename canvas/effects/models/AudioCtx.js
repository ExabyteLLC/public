class AudioCtx {
    #context;
    #analyzer;
    #source;
    #output;
    //============================
    get running() {
        return this.#context.state === 'running';
    }
    get context() {
        return this.#context;
    }
    get source() {
        return this.#source;
    }
    get output() {
        return this.#output;
    }
    //============================
    constructor(autoInit = false, { fftSize, gain } = {}) {
        if (autoInit) {
            // init audio ctx
            document.addEventListener('click', () => {
                this.init({ fftSize, gain });
                this.output.gain.value = 0;
            }, { once: true });
        }
    }
    //============================
    init({ fftSize, gain } = {}) {
        this.#context = new (window.AudioContext || window.webkitAudioContext)();
        this.#analyzer = this.#context.createAnalyser();
        if (fftSize) this.#analyzer.fftSize = fftSize;
        this.#analyzer.smoothingTimeConstant = 0.85;

        // create gain
        this.#source = this.#context.createGain();
        if (gain) this.#source.gain.value = gain;
        // connect analyzer
        this.#source.connect(this.#analyzer);
        // output
        this.#output = this.#context.createGain();
        this.#source.connect(this.#output);
        // connect gain
        this.#output.connect(this.#context.destination);
    }
    //============================
    getFrequencies() {
        if (this.#analyzer) {
            const array = new Uint8Array(this.#analyzer.frequencyBinCount);
            this.#analyzer.getByteFrequencyData(array);
            return array;
        }
        return null;
    }
    getWaveform() {
        if (this.#analyzer) {
            const array = new Uint8Array(this.#analyzer.frequencyBinCount);
            this.#analyzer.getByteTimeDomainData(array);
            return array;
        }
        return null;
    }
    //============================ data
    static get tones() {
        return {
            C: [
                16.35, 32.7, 65.41, 130.81, 261.63, 523.25, 1046.5, 2093.0, 4186.01,
            ],
            Db: [
                17.32, 34.65, 69.3, 138.59, 277.18, 554.37, 1108.73, 2217.46, 4434.92,
            ],
            D: [
                18.35, 36.71, 73.42, 146.83, 293.66, 587.33, 1174.66, 2349.32,
                4698.64,
            ],
            Eb: [
                19.45, 38.89, 77.78, 155.56, 311.13, 622.25, 1244.51, 2489.02,
                4978.03,
            ],
            E: [20.6, 41.2, 82.41, 164.81, 329.63, 659.26, 1318.51, 2637.02],
            F: [21.83, 43.65, 87.31, 174.61, 349.23, 698.46, 1396.91, 2793.83],
            Gb: [23.12, 46.25, 92.5, 185.0, 369.99, 739.99, 1479.98, 2959.96],
            G: [24.5, 49.0, 98.0, 196.0, 392.0, 783.99, 1567.98, 3135.96],
            Ab: [25.96, 51.91, 103.83, 207.65, 415.3, 830.61, 1661.22, 3322.44],
            A: [27.5, 55.0, 110.0, 220.0, 440.0, 880.0, 1760.0, 3520.0],
            Bb: [29.14, 58.27, 116.54, 233.08, 466.16, 932.33, 1864.66, 3729.31],
            B: [30.87, 61.74, 123.47, 246.94, 493.88, 987.77, 1975.53, 3951.07],
        }
    };

}

class AudioCtxSource {
    #context;
    #source;
    #started = false;
    //============================
    constructor(context, source) {
        this.#context = context;
        this.#source = source;
    }
    //============================
    fromOscillator({ type = 'sine', frequency = 440, detune = 0 } = {}) {
        this.#source = this.#context.createOscillator();
        this.#source.type = type;
        this.#source.frequency.value = frequency;
        this.#source.detune.value = detune;
        return this;
    }
    fromSineWave({ frequency = 440, detune = 0 } = {}) {
        return this.fromOscillator({ type: 'sine', frequency, detune });
    }
    fromSquareWave({ frequency = 440, detune = 0 } = {}) {
        return this.fromOscillator({ type: 'square', frequency, detune });
    }
    fromTriangleWave({ frequency = 440, detune = 0 } = {}) {
        return this.fromOscillator({ type: 'triangle', frequency, detune });
    }
    fromSawtoothWave({ frequency = 440, detune = 0 } = {}) {
        return this.fromOscillator({ type: 'sawtooth', frequency, detune });
    }
    fromAudio(audio) {
        this.#source = this.#context.createMediaElementSource(audio);
        return this;
    }
    async fromFilePath(path) {
        const data = await fetch(path);
        const arrayBuffer = await data.arrayBuffer();
        const bufferData = await this.#context.decodeAudioData(arrayBuffer);
        const buffer = this.#context.createBufferSource();
        buffer.buffer = bufferData;
        this.#source = buffer;
        return this;
    }
    async fromFile(file) {
        const arrayBuffer = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = function () {
                resolve(reader.result);
            }
            reader.readAsArrayBuffer(file);
        })
        const bufferData = await this.#context.decodeAudioData(arrayBuffer);
        const buffer = this.#context.createBufferSource();
        buffer.buffer = bufferData;
        this.#source = buffer;
        return this;
    }
    async fromMic() {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true
        });
        this.#source = this.#context.createMediaStreamSource(stream);
        return this;
    }
    //============================
    addBiquadFilter({ type, frequency, gain, Q } = {}) {
        const filter = this.#context.createBiquadFilter();
        if (type) filter.type = type;
        if (frequency) filter.frequency.value = frequency;
        if (Q) filter.Q.value = Q;
        if (gain) filter.gain.value = gain;
        //connect
        this.#source.connect(filter);
        this.#source = filter;
        return this;
    }
    addLowPassFilter({ frequency, Q } = {}) {
        return this.addBiquadFilter({ type: "lowpass", frequency, Q });
    }
    addHighPassFilter({ frequency, Q } = {}) {
        return this.addBiquadFilter({ type: "highpass", frequency, Q });
    }
    addBandPassFilter({ frequency, Q } = {}) {
        return this.addBiquadFilter({ type: "bandpass", frequency, Q });
    }
    addBassFilter({ gain } = {}) {
        return this.addBiquadFilter({ type: "lowshelf", frequency: 500, gain });
    }
    addMidFilter({ gain } = {}) {
        return this.addBiquadFilter({ type: "peaking", frequency: 1500, Q: Math.SQRT1_2, gain });
    }
    addTrebleFilter({ gain } = {}) {
        return this.addBiquadFilter({ type: "highshelf", frequency: 3000, gain });
    }
    addGainFilter({ gain } = {}) {
        const filter = this.#context.createGain();
        if (gain) filter.gain.value = gain;
        //connect
        this.#source.connect(filter);
        this.#source = filter;
        return this;
    }
    addDelayFilter({ delayTime } = {}) {
        const filter = this.#context.createDelay();
        if (delayTime) filter.delayTime.value = delayTime;
        //connect
        this.#source.connect(filter);
        this.#source = filter;
        return this;
    }
    //============================
    connect(audioCtx) {
        if (this.#source) {
            this.#source.connect(audioCtx.source);
        }
        return this;
    }
    disconnect(audioCtx) {
        if (this.#source) {
            this.#source.disconnect(audioCtx.source);
        }
        return this;
    }
    //============================
    start(when = 0) {
        if (this.#source && !this.#started) {
            this.#started = true;
            this.#source.start(when);
        }
        return this;
    }
    stop(when = 0) {
        if (this.#source) {
            this.#source.stop(when)
        }
        return this;
    }
}