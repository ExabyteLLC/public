class AudioCtx {
    #context;
    #analyzer;
    #source;
    #filters = [];
    #sound;
    #fftSize;
    //============================
    get running() {
        return this.#context.state === 'running';
    }
    //============================
    constructor(fftSize = 4096) {
        this.#fftSize = fftSize;
    }
    //============================
    #sourceCtx() {
        this.disconnect();
        this.#context = new (window.AudioContext || window.webkitAudioContext)();
        this.#analyzer = this.#context.createAnalyser();
        this.#analyzer.fftSize = this.#fftSize;
        this.#analyzer.smoothingTimeConstant = 0.85;
    }
    sourceFromOscillator(type = 'sine', frequency = 440, detune = 0) {
        this.#sourceCtx();
        const source = this.#context.createOscillator();
        source.type = type;
        source.frequency.value = frequency;
        source.detune.value = detune;
        this.#source = source;
        return this;
    }
    sourceFromSineWave(frequency = 440, detune = 0) {
        return this.sourceFromOscillator('sine', frequency, detune);
    }
    sourceFromSquareWave(frequency = 440, detune = 0) {
        return this.sourceFromOscillator('square', frequency, detune);
    }
    sourceFromTriangleWave(frequency = 440, detune = 0) {
        return this.sourceFromOscillator('triangle', frequency, detune);
    }
    sourceFromSawtoothWave(frequency = 440, detune = 0) {
        return this.sourceFromOscillator('sawtooth', frequency, detune);
    }
    sourceFromAudio(audio) {
        this.#sourceCtx();
        const source = this.#context.createMediaElementSource(audio);
        this.#source = source;
        return this;
    }
    async sourceFromMic() {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true
        });
        this.#sourceCtx();
        const source = this.#context.createMediaStreamSource(stream);
        this.#source = source;
        return this;
    }
    //============================
    addBiquadFilter({ type, frequency, gain, Q } = {}) {
        const filter = this.#context.createBiquadFilter();
        if (type) filter.type = type;
        if (frequency) filter.frequency.value = frequency;
        if (Q) filter.Q.value = Q;
        if (gain) filter.gain.value = gain;
        this.#filters.push(filter);
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
        this.#filters.push(filter);
        return this;
    }
    //============================
    connect() {
        if (this.#source) {
            this.disconnect();
            this.#sound = this.#source;
            this.#sound.connect(this.#analyzer);
            this.#sound = this.#analyzer;
            this.#filters.forEach(filter => {
                this.#sound.connect(filter);
                this.#sound = filter;
            });
            this.#sound.connect(this.#context.destination);
        }
        return this;
    }
    disconnect() {
        if (this.#sound) {
            this.#sound.disconnect(this.#context.destination);
            this.#sound = null;
        }
        return this;
    }
    start(when = 0) {
        if (this.#sound) {
            this.#sound.start(when)
        }
        return this;
    }
    stop(when = 0) {
        if (this.#sound) {
            this.#sound.stop(when)
        }
        return this;
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

}