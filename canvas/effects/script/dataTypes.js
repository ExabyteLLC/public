// Factory functions for effects and options
function effect(name, init, options = {}, {
    background = 'white'
} = {}) {
    return { name, init, options, background };
}

// Central effect option factory
function effectOption(
    name,
    {
        type = "input",
        restart = false,
        attrs = {},
        parseVal,
        onchange,
        emptyValue = false,
        options
    }
) {
    return {
        [name]: {
            type,
            restart,
            attrs,
            parseVal,
            onchange,
            emptyValue,
            options
        }
    };
}

// Option types

function optionColor(name, { restart = false, attrs = {}, parseVal, onchange, emptyValue = false } = {}) {
    return effectOption(name, {
        type: "input",
        restart,
        attrs: { ...attrs, type: "color" },
        parseVal,
        onchange,
        emptyValue
    });
}

function optionRange(name, min, max, step = 1, { restart = false, attrs = {}, parseVal, onchange, emptyValue = false } = {}) {
    return effectOption(name, {
        type: "range",
        restart,
        attrs: { ...attrs, min, max, step },
        parseVal,
        onchange,
        emptyValue
    });
}

function optionCheckbox(name, { restart = false, attrs = {}, parseVal, onchange, emptyValue = false } = {}) {
    return effectOption(name, {
        type: "checkbox",
        restart,
        attrs,
        parseVal,
        onchange,
        emptyValue
    });
}

function optionSelect(name, optionsArray, { restart = false, attrs = {}, parseVal, onchange, emptyValue = false } = {}) {
    return effectOption(name, {
        type: "select",
        restart,
        attrs,
        options: optionsArray,
        parseVal,
        onchange,
        emptyValue
    });
}

function optionFile(name, accept, { restart = false, attrs = {}, parseVal, onchange, emptyValue = false } = {}) {
    return effectOption(name, {
        type: "file",
        restart,
        attrs: { ...attrs, type: "file", accept },
        parseVal,
        onchange,
        emptyValue
    });
}

// audio functions
class AudioSources {
    static mic;
    static file;

    static connectMic() {
        this.disconnectMic();
        if (!this.mic) {
            this.mic = new AudioCtxSource(audioCtx.context);
            this.mic.fromMic().then(src => src.addDelayFilter({ delayTime: 1 }).connect(audioCtx));
        }
    }
    static disconnectMic() {
        if (this.mic) {
            this.mic.disconnect(audioCtx);
            this.mic = null;
        }
    }

    static connectFile(file) {
        this.disconnectFile();
        if (!this.file) {
            this.file = new AudioCtxSource(audioCtx.context);
            this.file.fromFile(file).then(src => src.connect(audioCtx).start());
        }
    }
    static disconnectFile() {
        if (this.file) {
            this.file.stop();
            this.file.disconnect(audioCtx);
            this.file = null;
        }
    }
}