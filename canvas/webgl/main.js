import { WebGLEngine } from "./core/index.js";
import SakuraShaderEffect from "./projects/SakuraShaderEffect/index.js";

(function () {
    const canvas = document.getElementById("canvas");
    const engine = new WebGLEngine(canvas, { fps: 60 });
    engine.add(new SakuraShaderEffect({ canvas, engine }));
    engine.start();
})();