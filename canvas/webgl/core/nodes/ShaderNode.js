import { Node } from "../index.js";

export default class ShaderNode extends Node {
    constructor(vsSource, fsSource) {
        super();
        this.vsSource = vsSource;
        this.fsSource = fsSource;
        this.program = null;
        this.time = 0;
        this.lastDeltaTime = 0;
        this.uniformLocations = {};
    }

    onInit(gl) {
        const vs = this.compileShader(gl, gl.VERTEX_SHADER, this.vsSource);
        const fs = this.compileShader(gl, gl.FRAGMENT_SHADER, this.fsSource);

        this.program = gl.createProgram();
        gl.attachShader(this.program, vs);
        gl.attachShader(this.program, fs);
        gl.linkProgram(this.program);

        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            console.error("Link failed: " + gl.getProgramInfoLog(this.program));
        }

        // Cache common uniform locations
        this.cacheUniformLocations(gl);
    }

    cacheUniformLocations(gl) {
        const commonUniforms = [
            'uTime',
            'u_time',
            'uResolution',
            'u_resolution',
            'uDeltaTime',
            'u_deltaTime'
        ];
        
        commonUniforms.forEach(uniformName => {
            const location = gl.getUniformLocation(this.program, uniformName);
            if (location !== null) {
                this.uniformLocations[uniformName] = location;
            }
        });
    }

    compileShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(`Shader compile error: ` + gl.getShaderInfoLog(shader));
        }
        
        return shader;
    }

    onUpdate(dt) {
        this.lastDeltaTime = dt;
        this.time += dt;
    }

    onDraw(gl) {
        if (!this.program) return;
        
        gl.useProgram(this.program);
        
        // Set common uniforms
        this.setCommonUniforms(gl);
        
        // Allow subclasses to set additional uniforms
        this.setUniforms(gl);
    }

    setCommonUniforms(gl) {
        // Try both naming conventions
        if (this.uniformLocations['uTime']) {
            gl.uniform1f(this.uniformLocations['uTime'], this.time);
        } else if (this.uniformLocations['u_time']) {
            gl.uniform1f(this.uniformLocations['u_time'], this.time);
        }
        
        if (this.uniformLocations['uDeltaTime']) {
            gl.uniform1f(this.uniformLocations['uDeltaTime'], this.lastDeltaTime);
        } else if (this.uniformLocations['u_deltaTime']) {
            gl.uniform1f(this.uniformLocations['u_deltaTime'], this.lastDeltaTime);
        }
        
        if (this.uniformLocations['uResolution'] || this.uniformLocations['u_resolution']) {
            const canvas = gl.canvas;
            const location = this.uniformLocations['uResolution'] || this.uniformLocations['u_resolution'];
            gl.uniform2f(location, canvas.width, canvas.height);
        }
    }

    getUniformLocation(gl, name) {
        // Check if we already have it cached
        if (this.uniformLocations[name]) {
            return this.uniformLocations[name];
        }
        
        // If not, get it and cache it
        const location = gl.getUniformLocation(this.program, name);
        if (location !== null) {
            this.uniformLocations[name] = location;
        }
        return location;
    }

    setUniforms(gl) {
        // Override this in subclasses
    }
}