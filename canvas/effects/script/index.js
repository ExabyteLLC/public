// canvas
const canvas = document.getElementById("canvas");
const canvasEffect = new CanvasEffect(canvas);
const audioCtx = new AudioCtx();

// append effects
appendSamples({
    data: effectsArray(),
    sample: createEl("option"),
    output: "effectsList",
    empty: true,
    children: {
        ".": (el, { row: { name } }) => {
            el.value = name;
            el.innerHTML = name;
        }
    },
    root: (el) => {
        const hash = location.hash.replace('#', '');
        if (hash) el.value = hash;
        el.onchange = ({ target: { value } }) => {
            setEffect(value);
            location.replace(`#${value}`);
        }
        setEffect(el.value);
    }
});

function setEffect(effect) {
    const { name, init, options, background } = effectsArray().find(e => e.name === effect);
    const instance = init({ audioCtx: audioCtx });
    canvasEffect.setEffect(instance);
    canvas.style.background = background;
    // options
    appendSamples({
        data: options,
        sample: createEl("tr", {}, [
            createEl("td", {
                class: "py-1",
                input: "",
            },
                [
                    createEl("label", {
                        class: "w-100",
                        label: "",
                    }),
                ])
        ]),
        output: "optionsList",
        empty: true,
        children: {
            '[label]': (el, { index: name }) => {
                el.innerHTML = name;
            },
            '[input]': (el, { index: name, row: field }) => {
                appendSample({
                    output: el,
                    sample: inputTypeSample(field.type),
                    parent: (el) => {
                        // props
                        for (let k in field.attrs) {
                            el.setAttribute(k, field.attrs[k]);
                        }
                        // value
                        if (!field.emptyValue) {
                            if (field.type === 'checkbox') {
                                el.checked = instance?.[name];
                            } else {
                                el.setAttribute("value", instance?.[name]);
                                el.value = instance?.[name];
                            }
                        }
                        // change
                        el.onchange = () => {
                            if (field?.onchange) {
                                field.onchange({ el: el, instance: instance });
                            } else {
                                if (field?.parseVal) {
                                    instance[name] = field?.parseVal(el.value, el);
                                } else {
                                    if (field.type === 'checkbox') {
                                        instance[name] = el.checked;
                                    } else {
                                        instance[name] = el.value;
                                    }
                                }
                                if (field?.restart) {
                                    canvasEffect.restart();
                                }
                            }
                        }
                        // options
                        if (field?.options) {
                            el.innerHTML = field?.options.map((v) => (`<option value="${v}">${v}</option>`)).join("");
                        }
                    },
                });
            }
        },
    });
}

function inputTypeSample(type) {
    switch (type) {
        case "select":
            return createEl("select", {
                class: "form-select form-select-sm",
            });
        case "range":
            return createEl("input", {
                class: "form-range form-range-sm",
                type: "range",
            });
        case "checkbox":
            return createEl("input", {
                class: "form-check-input",
                type: "checkbox",
            });
        default:
            return createEl("input", {
                class: "form-control form-control-sm",
            });
    }
}

// init audio ctx
document.addEventListener('click', () => {
    audioCtx.init({});
    audioCtx.output.gain.value = 0;
}, { once: true });

// toggle fullscreen
document.getElementById('fullscreen').addEventListener('click', () => {
    document.getElementById('controls').classList.toggle('d-none');
});
