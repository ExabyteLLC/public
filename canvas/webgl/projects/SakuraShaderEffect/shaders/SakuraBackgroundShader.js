import { ShaderNode } from "../../../core/index.js";

// We're bringing in the big guns: the actual petal math from your file
const vs = `
  attribute vec3 aPosition;
  attribute vec3 aEuler;
  attribute vec2 aMisc; // x: size, y: alpha

  uniform mat4 uProjection;
  uniform float uTime;
  uniform vec2 uResolution;

  varying vec3 vNormal;
  varying vec2 vMisc;
  varying vec3 vPos;

  void main() {
    // 1. Calculate a simple rotation matrix from Euler angles
    vec3 s = sin(aEuler + uTime * 0.5); // Add time to make them spin!
    vec3 c = cos(aEuler + uTime * 0.5);
    
    // Very simplified rotation logic for performance
    vNormal = vec3(s.x * c.y, s.y, c.x * c.y);
    vMisc = aMisc;
    
    // 2. Falling logic
    vec3 pos = aPosition;
    pos.y = mod(pos.y - uTime * 0.4, 2.0) - 1.0; 
    pos.x += sin(uTime + aPosition.z) * 0.2;

    gl_Position = uProjection * vec4(pos, 1.0);
    // Point size based on perspective
    gl_PointSize = aMisc.x * (uResolution.y * 0.02) / -gl_Position.w;
    vPos = pos;
  }
`;

const fs = `
  precision highp float;
  varying vec3 vNormal;
  varying vec2 vMisc;
  
  float ellipse(vec2 p, vec2 o, vec2 r) {
    vec2 lp = (p - o) / r;
    return length(lp) - 1.0;
  }

  void main() {
    // The "Magic" Heart/Petal Shape math from the original file
    float petalScale = 100.0;
    vec2 coord = (gl_PointCoord - vec2(0.5)) / petalScale;
    
    // Angle and mirroring to create the heart notch
    float r;
    vec2 flwrp = vec2(abs(coord.x), coord.y);
    
    // This defines the petal boundary
    if(flwrp.x < 0.0) {
      r = ellipse(flwrp, vec2(0.065, 0.024), vec2(0.36, 0.96) * 0.5);
    } else {
      r = ellipse(flwrp, vec2(0.065, 0.024), vec2(0.58, 0.96) * 0.5);
    }

    if(r > 0.0) discard; // Cut out the petal shape

    // Color gradient: light pink to deep sakura
    vec3 col = mix(vec3(1.0, 0.8, 0.75), vec3(1.0, 0.9, 0.87), -r);
    gl_FragColor = vec4(col, vMisc.y);
  }
`;

export default class SakuraBackgroundShader extends ShaderNode {
  constructor({ canvas }) {
    super(vs, fs);
    this.count = 1600;
    this.canvas = canvas;
  }

  onInit(gl) {
    console.log('init')
    const positions = new Float32Array(this.count * 3);
    const eulers = new Float32Array(this.count * 3);
    const misc = new Float32Array(this.count * 2);

    for (let i = 0; i < this.count; i++) {
      positions[i * 3 + 0] = Math.random() * 2 - 1;
      positions[i * 3 + 1] = Math.random() * 2 - 1;
      positions[i * 3 + 2] = Math.random() * 2 - 1;
      eulers[i * 3 + 0] = Math.random() * Math.PI * 2;
      eulers[i * 3 + 1] = Math.random() * Math.PI * 2;
      eulers[i * 3 + 2] = Math.random() * Math.PI * 2;
      misc[i * 2 + 0] = 0.5 + Math.random() * 1.0;
      misc[i * 2 + 1] = 0.4 + Math.random() * 0.6;
    }

    this.createBuffer(gl, 'aPosition', positions, 3);
    this.createBuffer(gl, 'aEuler', eulers, 3);
    this.createBuffer(gl, 'aMisc', misc, 2);
  }

  createBuffer(gl, name, data, size) {
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    const loc = gl.getAttribLocation(this.program, name);
    if (loc === -1) {
      console.warn(`Attribute ${name} not found in shader`);
      return;
    }

    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
  }

  setUniforms(gl) {
    // Debug: Check uniform locations
    const uTime = this.getUniformLocation(gl, 'uTime');
    const uRes = this.getUniformLocation(gl, 'uResolution');
    const uProj = this.getUniformLocation(gl, 'uProjection');

    // Set uniforms
    if (uProj) {
      const aspect = this.canvas.width / this.canvas.height;
      const projectionMatrix = new Float32Array([
        1 / aspect, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      ]);
      gl.uniformMatrix4fv(uProj, false, projectionMatrix);
    }

  }

  onDraw(gl) {
    gl.enable(gl.PROGRAM_POINT_SIZE);


    // Debug: Check if anything is being drawn
    const error = gl.getError();
    if (error !== gl.NO_ERROR) {
      console.error('WebGL error:', error);
    }

    gl.drawArrays(gl.POINTS, 0, this.count);
  }
}