import { Node } from "../../core/index.js";
import SakuraPetalsShader from "./shaders/SakuraPetalsShader.js";

export default class SakuraShaderEffect extends Node {
    constructor({ canvas } = {}) {
        super();
        this.addChild(new SakuraPetalsShader({ canvas: canvas }));
    }

    onDraw(gl) {
        // Clear to black at the start of each frame
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
}