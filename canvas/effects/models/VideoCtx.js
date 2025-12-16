class VideoCtx {
    #video;
    #stream;
    #started = false;

    get video() { return this.#video; }
    get running() { return this.#started && !this.#video?.paused; }

    // ============================ INIT
    initVideo({ src, srcObject, loop, muted = true } = {}) {
        this.#video = document.createElement('video');
        this.#video.playsInline = true;
        this.#video.muted = muted;
        this.#video.preload = 'auto';

        if (src) this.#video.src = src;
        if (srcObject) this.#video.srcObject = srcObject;
        if (loop) this.#video.loop = loop;

        return this;
    }

    // ============================ SOURCES
    fromFile(src, { loop = true } = {}) {
        return this.initVideo({ src, loop });
    }

    fromMediaElement(videoEl) {
        this.#video = videoEl;
        return this;
    }

    async fromCamera() {
        this.#stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        });
        return this.initVideo({ srcObject: this.#stream });
    }

    // ============================ PLAYBACK
    async start() {
        if (!this.#started) {
            await this.#waitForReady();
            this.#started = true;
            await this.#video.play();
        }
        return this;
    }

    stop() {
        this.#video?.pause();
        this.#started = false;
        return this;
    }

    playing() {
        return !!(
            this.#video
            // &&
            // this.#video.currentTime > 0 &&
            // !this.#video.paused &&
            // !this.#video.ended &&
            // this.#video.readyState > 2
        );
    }

    // ============================ INTERNALS
    async #waitForReady() {
        if (this.#video.readyState >= 1) return;
        await new Promise(res =>
            this.#video.addEventListener('loadedmetadata', res, { once: true })
        );
    }
}
