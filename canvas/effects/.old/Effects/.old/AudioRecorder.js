//==============================================================
class AudioRecorder {
    #fftSize;
    //
    stream;
    context;
    buffer;
    source;
    conn;
    analyser;
    inGain;
    outDelay;
    outGain;
    outBase;
    outTreble;
    outReverb;
    //
    interval;
    //
    //============================
    constructor(fftSize = 64) {
        this.#fftSize = fftSize;
    }

    //============================
    async streamAudio(audio) {
        if (!audio) return;
        await this.#createContextFromStream(audio);
        this.start();
        this.inGain.gain.value = 1;
        this.outGain.gain.value = 1;
    }
    //============================
    async streamMic() {
        await this.#createContextFromStream(
            await navigator.mediaDevices.getUserMedia({
                audio: true
            })
        );
        this.start();
        this.inGain.gain.value = 1;
        this.outGain.gain.value = 0;
    }
    //============================
    async streamFile(file) {
        const data = await fetch(file);
        const buffer = await data.arrayBuffer()
        await this.#createContextFromBuffer(buffer);
        this.start();
        this.inGain.gain.value = 1;
        this.outGain.gain.value = 1;
    }

    //============================
    async start() {
        try {
            // add new
            this.#getInputGain();
            this.#getAnalyzer();
            this.#getOutputDelay();
            this.#getOutGain();
            this.#getOutBase();
            this.#getOutTreble();
            // this.#getOutReverb();
            // output
            this.conn.connect(this.context.destination);
            // data
            return this;
        } catch (e) {
            console.error('Recorder:', e);
        }
    }

    //============================
    sound() {
        if (this.analyser) {
            // frequency
            const frequencies = new Uint8Array(this.analyser.frequencyBinCount);
            this.analyser.getByteFrequencyData(frequencies);
            // waveform
            const waveforms = new Uint8Array(this.analyser.frequencyBinCount);
            this.analyser.getByteTimeDomainData(waveforms);
            // return
            return [frequencies, waveforms]
        }
        return null;
    }

    //============================
    async close() {
        if (this.stream instanceof HTMLMediaElement) this.stream.pause();
        if (!this.context) return;
        await this.context.close();
        this.context = null;
        this.conn = null;
        return this;
    }
    //============================
    async #createContextFromStream(stream) {
        // source
        await this.close();
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        this.stream = stream;
        if (this.stream instanceof HTMLMediaElement) {
            this.source = this.context.createMediaElementSource(this.stream); // audio files
        } else if (this.stream instanceof MediaStream) {
            this.source = this.context.createMediaStreamSource(this.stream); // mic
        }
        //
        this.conn = this.source;
    }
    async #createContextFromBuffer(data) {
        // source
        await this.close();
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        const bufferData = await this.context.decodeAudioData(data);
        this.buffer = this.context.createBufferSource();
        this.buffer.buffer = bufferData;
        this.source = this.buffer;
        //
        this.conn = this.source;
        this.conn.start(this.context.currentTime)
    }
    #getInputGain() {
        // input volume
        this.inGain = this.context.createGain();
        this.inGain.gain.value = 1; // volume
        //
        this.conn.connect(this.inGain);
        this.conn = this.inGain;
    }
    #getAnalyzer() {
        // analyzer
        this.analyser = this.context.createAnalyser();
        // this.analyser.minDecibels = -75;
        // this.analyser.maxDecibels = -25;
        this.analyser.fftSize = this.#fftSize;
        this.analyser.smoothingTimeConstant = 0.85;
        this.conn.connect(this.analyser);
    }
    #getOutputDelay() {
        // output delay
        this.outDelay = this.context.createDelay();
        if (this.stream instanceof MediaStream) this.outDelay.delayTime.value = 1;
        //
        this.conn.connect(this.outDelay);
        this.conn = this.outDelay;
    }
    #getOutGain() {
        // output volume
        this.outGain = this.context.createGain();
        this.outGain.gain.value = 0.5; // volume
        //
        this.conn.connect(this.outGain);
        this.conn = this.outGain;
    }
    #getOutBase() {
        // output base
        this.outBase = this.context.createBiquadFilter();
        this.outBase.type = "lowshelf";
        //this.outBase.frequency.value = 200;
        this.outBase.gain.value = 0;
        //
        this.conn.connect(this.outBase);
        this.conn = this.outBase;
    }
    #getOutTreble() {
        // output treble
        this.outTreble = this.context.createBiquadFilter();
        this.outTreble.type = "highshelf";
        //this.outTreble.frequency.value = 2000;
        this.outTreble.gain.value = 0;
        //
        this.conn.connect(this.outTreble);
        this.conn = this.outTreble;
    }
    #getOutReverb() {
        // output reverb
        this.outReverb = this.context.createConvolver();
        //this.outReverb.buffer = 
        //
        this.conn.connect(this.outReverb);
        this.conn = this.outReverb;
    }
    //============================
    #clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
    #reRange(value, oMin, oMax, nMin, nMax) {
        return ((value - oMin) / (oMax - oMin)) * (nMax - nMin) + nMin;
    }
    #getPercent(value, total) {
        return (value / total) * 100;
    }
    #getFromPercent(value, percent) {
        return (percent / 100) * value;
    }
}