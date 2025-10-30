function appendSample({ sample, output, parent, root, children, data = {} }) {
    const smpl = (sample instanceof HTMLElement ? sample : document.getElementById(sample)).cloneNode(true);
    const otpt = (output && (output instanceof HTMLElement ? output : document.getElementById(output)));
    smpl.removeAttribute('id');
    if (parent) parent(smpl, { ...data });
    if (children) {
        for (let childID in children) {
            var child;
            if (childID === '..') child = otpt;
            else if (childID === '.') child = smpl;
            else child = smpl.querySelector(childID);
            if (child) {
                if (child != smpl) child.removeAttribute('id');
                if (children[childID]) children[childID](child, { parent: smpl, ...data });
            }
        }
    }
    if (root) root(otpt, { ...data });
    if (otpt) {
        otpt.append(smpl);
    }
    return smpl;
}
function appendSamples({ data, sample, output, parent, root, sampleRoot, children, empty = true }) {
    const smpl = (sample instanceof HTMLElement ? sample : document.getElementById(sample));
    const otpt = (output && (output instanceof HTMLElement ? output : document.getElementById(output)));
    //data
    const samples = [];
    if (empty) otpt.innerHTML = "";
    for (let i in data) {
        samples.push(appendSample({ sample: smpl, output: otpt, parent, root: sampleRoot, children, data: { index: i, row: data[i] } }));
    }
    if (root) root(otpt, { data });
    return samples;
}
function createEl(tag, { ...props } = {}, children) {
    const el = document.createElement(tag);
    if (props.style) {
        var styles = props.style;
        delete props.style;
        styles = styles.split(";").reduce((acc, style) => {
            const [key, value] = style.split(":").map(s => s.trim());
            el.style[key] = value;
        });
    }
    if (props.class) {
        var classes = props.class;
        delete props.class;
        classes = classes.split(" ");
        for (let cls of classes) {
            el.classList.add(cls);
        }
    }
    if (props) {
        for (let attr in props) {
            el.setAttribute(attr, props[attr]);
        }
    }
    if (children && Array.isArray(children)) {
        for (let child of children) {
            el.append(child);
        }
    }
    return el;
}