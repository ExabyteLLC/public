import { ShaderNode } from "../../../core/index.js";

const vs = `
  attribute vec3 aPosition;
  attribute vec3 aEuler;
  attribute vec2 aMisc;

  uniform mat4 uProjection;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uSizeScale;

  varying vec3 vNormal;
  varying vec2 vMisc;
  varying vec3 vPos;
  varying vec3 vNormX;
  varying vec3 vNormY;
  varying vec3 vNormZ;

  void main() {
    vec3 s = sin(aEuler + uTime * 0.5);
    vec3 c = cos(aEuler + uTime * 0.5);
    
    // Build rotation matrix
    mat3 rotx = mat3(
        1.0, 0.0, 0.0,
        0.0, c.x, s.x,
        0.0, -s.x, c.x
    );
    mat3 roty = mat3(
        c.y, 0.0, -s.y,
        0.0, 1.0, 0.0,
        s.y, 0.0, c.y
    );
    mat3 rotz = mat3(
        c.z, s.z, 0.0,
        -s.z, c.z, 0.0,
        0.0, 0.0, 1.0
    );
    mat3 rotmat = rotx * roty * rotz;
    vNormal = rotmat[2];

    // Transposed rotation for normals
    mat3 trrotm = mat3(
        rotmat[0][0], rotmat[1][0], rotmat[2][0],
        rotmat[0][1], rotmat[1][1], rotmat[2][1],
        rotmat[0][2], rotmat[1][2], rotmat[2][2]
    );
    vNormX = trrotm[0];
    vNormY = trrotm[1];
    vNormZ = trrotm[2];
    
    vMisc = aMisc;
    
    vec3 pos = aPosition;
    pos.y = (mod(pos.y - uTime * 0.4, 2.0) - 1.0); 
    pos.x += (sin(uTime + aPosition.z) * 0.2);

    gl_Position = uProjection * vec4(pos, 1.0);
    gl_PointSize = max(1.0, aMisc.x * (uResolution.y * 0.02 * uSizeScale) / max(0.1, -gl_Position.w));
    vPos = pos;
  }
`;

const fs = `
  precision highp float;
  varying vec3 vNormal;
  varying vec2 vMisc;
  varying vec3 vNormX;
  varying vec3 vNormY;
  varying vec3 vNormZ;
  uniform float uPetalScale;
  
  float ellipse(vec2 p, vec2 o, vec2 r) {
    vec2 lp = (p - o) / r;
    return length(lp) - 1.0;
  }

  void main() {
    // 3D ray intersection code
    vec3 p = vec3(gl_PointCoord - vec2(0.5, 0.5), 0.0) * 2.0;
    vec3 d = vec3(0.0, 0.0, -1.0);
    float nd = vNormZ.z;
    
    if(abs(nd) < 0.0001) discard;

    float np = dot(vNormZ, p);
    vec3 tp = p + d * np / nd;
    vec2 coord = vec2(dot(vNormX, tp), dot(vNormY, tp));

    // Petal shape with rotation (15 degrees)
    const float flwrsn = 0.258819045102521;
    const float flwrcs = 0.965925826289068;
    mat2 flwrm = mat2(flwrcs, -flwrsn, flwrsn, flwrcs);
    vec2 flwrp = vec2(abs(coord.x), coord.y) * flwrm;

    // This defines the petal boundary
    float r;
    if(flwrp.x < 0.0) {
      r = ellipse(flwrp, vec2(0.065, 0.024), vec2(0.36, 0.96) * 0.5 * uPetalScale);
    } else {
      r = ellipse(flwrp, vec2(0.065, 0.024), vec2(0.58, 0.96) * 0.5 * uPetalScale);
    }

    if(r > 0.0) discard; // Cut out the petal shape

    // Color gradient: light pink to deep sakura
    vec3 col = mix(vec3(1.0, 0.8, 0.75), vec3(1.0, 0.9, 0.87), -r);
    gl_FragColor = vec4(col, vMisc.y);
  }
`;

export default class SakuraPetalsShader extends ShaderNode {
  constructor({ canvas }) {
    super(vs, fs);
    this.count = 1600;
    this.canvas = canvas;

    // Camera and projection
    this.modelview = new Float32Array(16);
    this.dof = new Float32Array([10.0, 4.0, 8.0]);
    this.fade = new Float32Array([10.0, 10.0, 0.1]);
  }

  onInit(gl) {
    super.onInit(gl);

    const positions = new Float32Array(this.count * 3);
    const eulers = new Float32Array(this.count * 3);
    const misc = new Float32Array(this.count * 2);

    for (let i = 0; i < this.count; i++) {
      // Distribute in a cylinder volume
      const angle = Math.random() * Math.PI * 2;
      const radius = 8 + Math.random() * 4;
      const height = (Math.random() - 0.5) * 15;

      positions[i * 3 + 0] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      eulers[i * 3 + 0] = Math.random() * Math.PI * 2;
      eulers[i * 3 + 1] = Math.random() * Math.PI * 2;
      eulers[i * 3 + 2] = Math.random() * Math.PI * 2;

      misc[i * 2 + 0] = 0.8 + Math.random() * 0.4; // size
      misc[i * 2 + 1] = 0.6 + Math.random() * 0.4; // alpha
    }

    this.createBuffer(gl, 'aPosition', positions, 3);
    this.createBuffer(gl, 'aEuler', eulers, 3);
    this.createBuffer(gl, 'aMisc', misc, 2);

    // Setup modelview matrix (look at from distance)
    this.updateModelview();
  }

  updateModelview() {
    // Simple look-at matrix (camera at (0, 0, 30) looking at origin)
    const m = this.modelview;
    m[0] = 1; m[1] = 0; m[2] = 0; m[3] = 0;
    m[4] = 0; m[5] = 1; m[6] = 0; m[7] = 0;
    m[8] = 0; m[9] = 0; m[10] = 1; m[11] = 0;
    m[12] = 0; m[13] = 0; m[14] = -30; m[15] = 1;
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
    const uTime = gl.getUniformLocation(this.program, 'uTime');
    const uRes = gl.getUniformLocation(this.program, 'uResolution');
    const uProj = gl.getUniformLocation(this.program, 'uProjection');
    const uModelview = gl.getUniformLocation(this.program, 'uModelview');
    const uPetalScale = gl.getUniformLocation(this.program, 'uPetalScale');
    const uSizeScale = gl.getUniformLocation(this.program, 'uSizeScale');
    const uDOF = gl.getUniformLocation(this.program, 'uDOF');
    const uFade = gl.getUniformLocation(this.program, 'uFade');

    if (uTime) {
      gl.uniform1f(uTime, performance.now() / 1000);
    }

    if (uRes) {
      gl.uniform2f(uRes, this.canvas.width, this.canvas.height);
    }

    if (uProj) {
      const aspect = this.canvas.width / this.canvas.height;
      // Perspective projection: 60 deg FOV, near 0.1, far 100
      const fov = 60 * Math.PI / 180;
      const near = 0.1;
      const far = 100.0;
      const yScale = 1.0 / Math.tan(fov / 2);
      const xScale = yScale / aspect;

      const projectionMatrix = new Float32Array([
        xScale, 0, 0, 0,
        0, yScale, 0, 0,
        0, 0, -(far + near) / (far - near), -1,
        0, 0, -(2 * far * near) / (far - near), 0
      ]);
      gl.uniformMatrix4fv(uProj, false, projectionMatrix);
    }

    if (uModelview) {
      gl.uniformMatrix4fv(uModelview, false, this.modelview);
    }

    if (uPetalScale) {
      gl.uniform1f(uPetalScale, 1.0);
    }

    if (uSizeScale) {
      gl.uniform1f(uSizeScale, 1.0);
    }

    if (uDOF) {
      gl.uniform3fv(uDOF, this.dof);
    }

    if (uFade) {
      gl.uniform3fv(uFade, this.fade);
    }
  }

  onDraw(gl) {
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.DEPTH_TEST);

    gl.useProgram(this.program);
    this.setUniforms(gl);

    gl.drawArrays(gl.POINTS, 0, this.count);
  }
}