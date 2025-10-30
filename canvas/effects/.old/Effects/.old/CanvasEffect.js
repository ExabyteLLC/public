class CanvasEffect {
  #lastTime = 0;
  #fps = 60;
  #timer = 0;
  #animationFrame = null;
  #resizeTimeout = null;
  // effect
  #effect = {};
  // canvas
  canvas;
  context;
  // functions
  constructor(
    canvas,
    {
      fps = 60,
      effect = {},
      styles = {
        background: "",
        filter: ""
      }
    } = {}
  ) {
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d");
    this.#fps = fps;
    this.#effect = effect;
    //
    for (let k in styles) {
      this.canvas.style[k] = styles[k];
    }
    //
    window.addEventListener('resize', this.#resize.bind(this));
  }
  start() {
    this.#initiate();
    this.#animate(0);
  }
  stop() {
    if (this.#animationFrame) {
      cancelAnimationFrame(this.#animationFrame);
    }
  }
  restart() {
    this.#resize();
  }
  // static
  #initiate() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.#initObj(this.#effect);
  }
  #resize() {
    clearTimeout(this.#resizeTimeout);
    this.#resizeTimeout = setTimeout(() => {
      this.#initiate();
    }, 100);
  }
  #animate(timeStamp) {
    const deltaTime = timeStamp - this.#lastTime;
    const nextFrame = 1000 / this.#fps;
    this.#lastTime = timeStamp;
    if (this.#timer > nextFrame) {
      this.#drawObj(this.#effect);
      this.#updateObj(this.#effect);
      this.#timer = 0;
    } else {
      this.#timer += deltaTime;
    }
    this.#animationFrame = requestAnimationFrame(this.#animate.bind(this));
  }
  // object
  #objParams(data) {
    return {
      canvas: this.canvas,
      width: this.canvas.width,
      height: this.canvas.height,
      centerX: this.canvas.width / 2,
      centerY: this.canvas.height / 2,
      initObj: this.#initObj.bind(this),
      drawObj: this.#drawObj.bind(this),
      updateObj: this.#updateObj.bind(this),
      drawSave: this.#drawSave.bind(this),
      data
    }
  }
  #initObj(obj, data) {
    if (obj?.init) obj.init(this.context, this.#objParams(data), obj);
  }
  #updateObj(obj, data) {
    if (obj?.update) obj.update(this.#objParams(data), obj);
  }
  #drawObj(obj, data) {
    if (obj?.draw) obj.draw(this.context, this.#objParams(data), obj);
  }
  #drawSave(draw) {
    this.context.save();
    if (draw) draw(this.context);
    this.context.restore();
  }
  // static
  static createObj({
    init = null,
    draw = null,
    update = null,
  } = {}) {
    return { init, draw, update };
  }
  static rand(min = 0, max = 1, operation) {
    let rand = (Math.random() * max) + min;
    if (Math?.[operation]) rand = Math?.[operation](rand);
    return rand;
  }
}

const Effects = {
  get matrixRain() {
    return (canvas, {
      fps = 30,
      bgcolor = "rgb(0,0,0,0.05)",
      color = "rgb(92, 252, 48)",
      grid = 12,
      alpha = 0.9
    } = {}) => {
      let symbols = [];

      return new CanvasEffect(canvas, {
        fps,
        effect: CanvasEffect.createObj({
          init: (ctx, { width, height }) => {
            symbols = [];
            const cols = Math.ceil(width / grid) + 1;
            for (let i = -1; i <= cols; i++) {
              symbols[i] = createSymbol(i, CanvasEffect.rand(0, height, "round"));
            }
          },
          draw: (ctx, { width, height }) => {
            ctx.globalAlpha = alpha;
            ctx.fillStyle = bgcolor;
            ctx.fillRect(0, 0, width, height);
            ctx.fillStyle = color;
            ctx.font = grid + "px monospace";
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";
            ctx.textRendering = "optimizeSpeed";
            symbols.forEach(symbol => symbol.draw(ctx, { height }));
          },
        })
      });

      function symbol() {
        const symbols = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ±µΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρστυφχψωЁАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюяё٠١٢٣٤٥٦٧٨٩ابتثجحخدذرزسشصضطظعغفقكلمنهوي∇∑√∞∫≈≠≡≤≥♩♪♫♬♭♮♯あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんァアィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロワヰヱヲンヴ';
        const i = CanvasEffect.rand(0, symbols.length, "floor");
        return symbols.charAt(i);
      }

      function createSymbol(x, y) {
        return CanvasEffect.createObj({
          draw: (ctx, { height }) => {
            const t = symbol();
            const cx = (x * grid);
            const cy = (y * grid);
            ctx.fillText(t, cx, cy);
            // Update symbol position
            y = (y * grid) > height && CanvasEffect.rand() > 0.98 ? 0 : y + 1;
          },
        });
      }
    }
  },
  get flowField() {
    return (canvas, {
      fps = 120,
      pattern = "sinusoidalWaves",
      patternProps = {},
      particles = 5000,
      grid = 20,
      curve = 2,
      zoom = 0.2,
      rotation = 1,
      alpha = 1
    } = {}) => {
      const flowPatternNames = [
        "polarCoordinates",
        "simpleHarmonicOscillators",
        "complexHarmonicOscillators",
        "vortexPattern",
        "turbulencePattern",
        "radialGradient",
        "swirlingPatterns",
        "checkerboardPattern",
        "wavesInterference",
        "spiralPattern",
        "heartbeatPattern",
        "lissajousCurve",
        "circularWaves",
        "exponentialPattern",
        "logarithmicPattern",
        "randomNoise",
        "fibonacciSpiral",
        "parabolic",
        "hyperbolic",
        "circularHarmonics",
        "roseCurve",
        "complexNoise",
        "logisticMap",
        "henonMap",
        "lorenzAttractor",
        "duffingMap",
        "logisticPolar",
        "sinusoidalWaves",
        "concentricCircles"
      ];
      var cols = 0;
      var rows = 0;
      var field = [];
      var lines = [];
      return new CanvasEffect(canvas, {
        fps,
        effect: CanvasEffect.createObj({
          init: (ctx, { width, height, initObj }) => {
            // flow field
            rows = Math.ceil(height / grid);
            cols = Math.ceil(width / grid);
            field = [];
            for (let y = 0; y < rows; y++) {
              for (let x = 0; x < cols; x++) {
                const angle = flowEquations(
                  pattern,
                  {
                    x, y,
                    zoom, curve, rotation, width, height, props: patternProps
                  }
                );
                field.push([Math.cos(angle), Math.sin(angle)]);
              }
            }

            // lines
            for (let i = 0; i < particles; i++) {
              if (!lines[i]) {
                lines[i] = createLine({ width, height });
              }
            }
          },
          update: ({ data, width, height, updateObj, initObj }, self) => {
            lines.forEach(updateObj);
          },
          draw: (ctx, { width, height, drawSave, drawObj }) => {
            ctx.clearRect(0, 0, width, height);
            // lines
            ctx.globalAlpha = alpha;
            lines.forEach(drawObj);
          },
        }),
      });

      function createLine({ width, height }) {
        var x = CanvasEffect.rand(0, width, "floor");
        var y = CanvasEffect.rand(0, height, "floor");
        var color = `hsl(${360 * (x / width)},100%,70%)`;
        var speed = CanvasEffect.rand(2, 10);
        var maxLength = CanvasEffect.rand(10, 200);
        var timer = maxLength * 2;
        var history = [{ x: x, y: y }];
        var flow = getFlow(x, y);
        return CanvasEffect.createObj({
          init: (ctx, { width, height }, self) => {
            x = CanvasEffect.rand(0, width, "floor");
            y = CanvasEffect.rand(0, height, "floor");
            color = `hsl(${360 * (x / width)},100%,70%)`;
            speed = CanvasEffect.rand(1, 5);
            maxLength = CanvasEffect.rand(10, 200);
            timer = maxLength * 2;
            history = [{ x: x, y: y }];
            flow = getFlow(x, y);
          },
          update: ({ width, height, initObj }, self) => {
            timer--;
            if (timer > 0) {
              const f = getFlow(x, y);
              if (f) flow = f;
              const [cos, sin] = flow;
              x += cos * speed;
              y += sin * speed;
              history.push({ x: x, y: y });
              if (history.length > maxLength) {
                history.shift();
              }
            } else if (history.length > 1) {
              history.shift();
            } else {
              initObj(self)
            }
          },
          draw: (ctx, { width, height }, self) => {
            if (history.length > 0) {
              ctx.strokeStyle = color;
              ctx.beginPath();
              ctx.moveTo(history[0].x, history[0].y);
              for (let i = 1; i < history.length; i++) {
                ctx.lineTo(history[i].x, history[i].y);
              }
              ctx.stroke();
            }
          },
        });
        function getFlow(x, y) {
          const cx = Math.floor(x / grid);
          const cy = Math.floor(y / grid);
          const index = cy * cols + cx;
          return field?.[index];
        }
      }
      function flowEquations(type, { x, y, z = 0, zoom, curve, rotation, width, height, props }) {
        switch (type) {
          case "polarCoordinates":
            var radius = Math.sqrt(x * x + y * y);
            var theta = Math.atan2(y, x);
            return ((Math.sin(radius * zoom) + Math.cos(theta * zoom)) * curve) + rotation;
          case "simpleHarmonicOscillators":
            return ((Math.sin(x * zoom) * Math.cos(y * zoom)) * curve) + rotation;
          case "complexHarmonicOscillators":
            return ((Math.sin(x * zoom) + Math.sin(y * zoom) + Math.cos(x * zoom) + Math.cos(y * zoom)) * curve) + rotation;
          case "vortexPattern":
            var dx = x - (width / 2);
            var dy = y - (height / 2);
            var distance = Math.sqrt(dx * dx + dy * dy);
            return ((Math.atan2(dy, dx) + distance * zoom) * curve) + rotation;
          case "turbulencePattern":
            return ((Math.sin(x * zoom) + Math.cos(y * zoom * 0.5) + Math.sin(x * zoom * 0.5) + Math.cos(y * zoom)) * curve) + rotation;
          case "radialGradient":
            var dx = x - (width / 2);
            var dy = y - (height / 2);
            return ((Math.sin(dx * zoom) + Math.cos(dy * zoom)) * curve) + rotation;
          case "swirlingPatterns":
            return ((Math.sin(x * zoom + y * zoom) + Math.cos(y * zoom - x * zoom)) * curve) + rotation;
          case "checkerboardPattern":
            return ((Math.floor(x * zoom) % 2) ^ (Math.floor(y * zoom) % 2)) * Math.PI + rotation;
          case "wavesInterference":
            return ((Math.sin(x * zoom) + Math.sin(y * zoom * 1.5) + Math.cos(x * zoom * 1.5) + Math.cos(y * zoom)) * curve) + rotation;
          case "spiralPattern":
            var dx = x - (width / 2);
            var dy = y - (height / 2);
            var distance = Math.sqrt(dx * dx + dy * dy);
            return ((Math.atan2(dy, dx) + distance * zoom * Math.sin(distance * zoom)) * curve) + rotation;
          case "heartbeatPattern":
            return ((Math.sin(x * zoom * Math.sin(y * zoom))) * curve) + rotation;
          case "lissajousCurve":
            var a = props?.a ?? 3, b = props?.b ?? 4; // Lissajous curve parameters
            return ((Math.sin(a * x * zoom) + Math.cos(b * y * zoom)) * curve) + rotation;
          case "circularWaves":
            var dx = x - (width / 2);
            var dy = y - (height / 2);
            var distance = Math.sqrt(dx * dx + dy * dy);
            return (Math.sin(distance * zoom) * curve) + rotation;
          case "exponentialPattern":
            return ((Math.exp(x * zoom) + Math.exp(y * zoom)) * curve) + rotation;
          case "logarithmicPattern":
            return ((Math.log(x * zoom + 1) + Math.log(y * zoom + 1)) * curve) + rotation;
          case "randomNoise":
            return ((Math.random() * 2 * Math.PI) * curve) + rotation;
          case "fibonacciSpiral":
            var goldenRatio = (1 + Math.sqrt(5)) / 2;
            return ((Math.atan2(y, x) * goldenRatio) * curve) + rotation;
          case 'parabolic':
            return ((Math.pow(x * zoom, 2) + Math.pow(y * zoom, 2)) * curve) + rotation;
          case 'hyperbolic':
            return ((Math.sinh(x * zoom) + Math.cosh(y * zoom)) * curve) + rotation;
          case 'circularHarmonics':
            var dx = x - (width / 2);
            var dy = y - (height / 2);
            var distance = Math.sqrt(dx * dx + dy * dy);
            return ((Math.sin(distance * zoom) + Math.cos(distance * zoom * 0.5)) * curve) + rotation;
          case 'roseCurve':
            var k = props?.k ?? 4;
            return (Math.sin(k * Math.atan2(y, x)) * curve) + rotation;
          case 'logisticMap':
            var r = props?.r ?? 3.9;
            return ((r * x * (1 - x)) * curve) + rotation;
          case 'henonMap':
            var a = props?.a ?? 1.4, b = props?.b ?? 0.3;
            return ((x - a * x * x + y * b) * curve) + rotation;
          case 'lorenzAttractor':
            var sigma = props?.sigma ?? 10, rho = props?.rho ?? 28, beta = props?.beta ?? 8 / 3;
            var dx = sigma * (y - x);
            var dy = x * (rho - z) - y;
            var dz = x * y - beta * z;
            return (((Math.atan2(dy, dx)) * curve)) + rotation;
          case 'duffingMap':
            var alpha = props?.alpha ?? 2.75, beta = props?.beta ?? 0.15;
            return ((-alpha * x - beta * x * x * x + y) * curve) + rotation;
          case 'logisticPolar':
            var radius = Math.sqrt(x * x + y * y);
            var theta = Math.atan2(y, x);
            var r = props?.r ?? 3.9;
            return ((r * radius * (1 - radius)) * curve) + rotation + theta;
          case 'sinusoidalWaves':
            return ((Math.sin(x * zoom * 1.5) + Math.cos(y * zoom * 2)) * curve) + rotation;
          case 'concentricCircles':
            var dx = x - (width / 2);
            var dy = y - (height / 2);
            var distance = Math.sqrt(dx * dx + dy * dy);
            return ((Math.sin(distance * zoom) + Math.cos(distance * zoom * 0.5)) * curve) + rotation;
          default:
            return ((Math.cos(x * zoom) + Math.sin(y * zoom)) * curve) + rotation;
        }
      }
    }
  },
  get barVisualizer() {
    return (canvas, {
      frequencies = () => { },
      waveform = () => { },
      fps = 30,
    } = {}) => {
      return new CanvasEffect(canvas, {
        fps,
        effect: CanvasEffect.createObj({
          draw: (ctx, { width, height, centerY }) => {
            ctx.clearRect(0, 0, width, height);
            // draw
            const fr = frequencies();
            if (fr) {
              // freq
              const freqArr = [...fr.reverse(), ...fr.reverse()];
              const freqGrid = width / freqArr.length;
              for (let i in freqArr) {
                const freq = freqArr[i];
                ctx.fillStyle = colorHue(freq);
                ctx.fillRect(i * freqGrid, centerY - (freq / 2), freqGrid, freq);
              }
            }

            const wf = waveform();
            if (wf) {
              // wave
              const waveArr = wf;
              const waveGrid = width / waveArr.length;
              for (let i in waveArr) {
                const wave = waveArr[i] - 75;
                ctx.fillStyle = colorHue(wave);
                ctx.fillRect(i * waveGrid, 0, waveGrid, wave);
                ctx.fillRect(i * waveGrid, height - wave, waveGrid, wave);
              }
            }
          },
        })
      });

      function colorHue(val) {
        return `hsl(${200 + ((val / 255) * (360 - 200))},100%,50%)`;
      }
    }
  },
  get leafArcVisualizer() {
    return (canvas, {
      frequencies = () => { },
      fps = 120,
    } = {}) => {
      const circle1 = createEffect();
      const circle2 = createEffect({
        spread: 2, pattern: 10, size: 0.55, middle: 4, speed: -0.5,
        hueStart: 180, hueWidth: 50, lightness: 40
      });
      const circle3 = createEffect({
        spread: 0.1, pattern: 15, size: 1.2, middle: 0.1, speed: -2,
        hueStart: 0, hueWidth: 60, lightness: 90
      });
      return new CanvasEffect(canvas, {
        fps,
        effect: CanvasEffect.createObj({
          init: (ctx, { canvas }) => {
            canvas.style.background = "black";
            canvas.style.filter = "blur(3px) contrast(20)";
          },
          draw: (ctx, { width, height, drawObj }) => {
            ctx.clearRect(0, 0, width, height);

            // draw
            const fr = frequencies();
            drawObj(circle2, fr);
            drawObj(circle1, fr);
            drawObj(circle3, fr);
          },
        })
      });

      function colorHue(val, start, width, light = 50) {
        return `hsl(${start + (width * val)},100%,${light}%)`;
      }

      function createEffect({
        middle = 1, spread = 1, pattern = 1, size = 1, speed = 1,
        hueStart = 300, hueWidth = -110, lightness = 75
      } = {}) {
        const centerGap = (0.03 * middle);
        const spreadSize = (0.003 * spread);
        const angleMulti = (3.184 / pattern);
        const angle = Math.PI / (4 / size);
        const rotSpeed = (0.1 * speed);
        var rot = 0;
        return CanvasEffect.createObj({
          draw: (ctx, { data, width, height, centerX, centerY, drawSave }) => {
            // draw
            const center = Math.min(width, height) * centerGap;
            const h = Math.min(width, height) * spreadSize;
            const array = data;
            if (array) {
              // val
              var sum = 0;
              for (let i in array) {
                const val = array[i];
                sum += val;
                const thickness = val * h;
                drawSave(() => {
                  ctx.translate(centerX, centerY);
                  ctx.rotate((i * angleMulti) - rot);
                  ctx.fillStyle = colorHue(val / 255, hueStart, hueWidth, lightness);
                  ctx.beginPath();
                  ctx.arc(center, thickness / 2, thickness / 2, 0, angle);
                  ctx.fill();
                });
              }
              //
              const avg = (sum / array.length) / 255;
              rot += avg * rotSpeed;
            }
          },
        });
      }
    }
  },
  // get warframeOrdis() {
  //   return (canvas, {
  //     recorder,
  //     fps = 30,
  //   } = {}) => {
  //     const cube = createCube();
  //     return new CanvasEffect(canvas, {
  //       fps,
  //       effect: CanvasEffect.createObj({
  //         draw: (ctx, { width, height, drawObj }) => {
  //           ctx.clearRect(0, 0, width, height);
  //           // draw
  //           drawObj(cube)
  //         },
  //       })
  //     });
  //     function createCube() {
  //       const vertices = [
  //         new Point3D(-1, 0.9, -1),
  //         new Point3D(1.1, 1.1, -1),
  //         new Point3D(0.9, -1, -1),
  //         new Point3D(-1, -1, -1),
  //         new Point3D(-1, 1, 1),
  //         new Point3D(1, 1, 1),
  //         new Point3D(1, -1, 1),
  //         new Point3D(-1, -1, 1),
  //       ];
  //       const cubeFaces = [
  //         [0, 4, 5, 1],
  //         [5, 4, 7, 6],
  //         [3, 2, 6, 7],
  //         [4, 0, 3, 7],
  //         [1, 5, 6, 2],
  //         [0, 1, 2, 3],
  //       ];
  //       const yaw = 15;
  //       const pitch = -15;
  //       const roll = 45;

  //       var moveX = 0;
  //       var moveY = 0;
  //       var rotYaw = 0;
  //       var timer = 0;
  //       return CanvasEffect.createObj({

  //         draw: (ctx, { width, height, centerX, centerY }) => {
  //           // gen random move
  //           timer++;
  //           if (timer > 50) {
  //             timer = 0;
  //           } else if (timer > 25) {
  //             moveX -= 0.5;
  //             rotYaw -= 1;
  //           } else {
  //             moveX += 0.5;
  //             rotYaw += 1;
  //           }

  //           //
  //           const size = Math.min(width, height) / 2;
  //           const offsetX = moveX + (centerX - size / 2);
  //           const offsetY = moveY + (centerY - size / 2);
  //           var points = new Array();

  //           vertices.map(function (vertex) {
  //             points.push(
  //               vertex
  //                 .rotateX(yaw + rotYaw)
  //                 .rotateY(pitch + rotYaw)
  //                 .rotateZ(roll)
  //                 .project(size, size, size * 1.1, 5)
  //             );
  //           });

  //           cubeFaces.map(function (cubeFace) {
  //             const xy = [
  //               [offsetX + points[cubeFace[0]].x, offsetY + points[cubeFace[0]].y],
  //               [offsetX + points[cubeFace[1]].x, offsetY + points[cubeFace[1]].y],
  //               [offsetX + points[cubeFace[2]].x, offsetY + points[cubeFace[2]].y],
  //               [offsetX + points[cubeFace[3]].x, offsetY + points[cubeFace[3]].y]
  //             ];
  //             const centerX = (xy[0][0] + xy[1][0] + xy[2][0] + xy[3][0]) / 4
  //             const centerY = (xy[0][1] + xy[1][1] + xy[2][1] + xy[3][1]) / 4

  //             const l = Math.min(xy[0][0], xy[1][0], xy[2][0], xy[3][0]);
  //             const r = Math.max(xy[0][0], xy[1][0], xy[2][0], xy[3][0]);
  //             const b = Math.min(xy[0][1], xy[1][1], xy[2][1], xy[3][1]);
  //             const t = Math.max(xy[0][1], xy[1][1], xy[2][1], xy[3][1]);
  //             const width = r - l;
  //             const height = t - b;
  //             const radius = Math.min(width, height)

  //             const grad = ctx.createRadialGradient(
  //               centerX, centerY, radius / 10, centerX, centerY, radius
  //             );
  //             grad.addColorStop(0, "lightblue");
  //             grad.addColorStop(1, "darkblue");

  //             ctx.fillStyle = grad;
  //             ctx.strokeStyle = "lightblue";

  //             ctx.beginPath();
  //             ctx.moveTo(xy[0][0], xy[0][1]);
  //             ctx.lineTo(xy[1][0], xy[1][1]);
  //             ctx.lineTo(xy[2][0], xy[2][1]);
  //             ctx.lineTo(xy[3][0], xy[3][1]);
  //             ctx.closePath();

  //             ctx.fill();
  //             ctx.stroke();
  //           });
  //         },
  //       });

  //       function Point3D(x, y, z) {
  //         this.x = x;
  //         this.y = y;
  //         this.z = z;

  //         this.rotateX = function (currentAngle) {
  //           var rad = (currentAngle * Math.PI) / 180;
  //           var cosa = Math.cos(rad);
  //           var sina = Math.sin(rad);
  //           var y = this.y * cosa - this.z * sina;
  //           var z = this.y * sina + this.z * cosa;

  //           return new Point3D(this.x, y, z);
  //         };

  //         this.rotateY = function (currentAngle) {
  //           var rad = (currentAngle * Math.PI) / 180;
  //           var cosa = Math.cos(rad);
  //           var sina = Math.sin(rad);
  //           var z = this.z * cosa - this.x * sina;
  //           var x = this.z * sina + this.x * cosa;

  //           return new Point3D(x, this.y, z);
  //         };

  //         this.rotateZ = function (currentAngle) {
  //           var rad = (currentAngle * Math.PI) / 180;
  //           var cosa = Math.cos(rad);
  //           var sina = Math.sin(rad);
  //           var x = this.x * cosa - this.y * sina;
  //           var y = this.x * sina + this.y * cosa;

  //           return new Point3D(x, y, this.z);
  //         };

  //         this.project = function (
  //           viewWidth,
  //           viewHeight,
  //           fieldOfView,
  //           viewDistance
  //         ) {
  //           var factor = fieldOfView / (viewDistance + this.z);
  //           var x = this.x * factor + viewWidth / 2;
  //           var y = this.y * factor + viewHeight / 2;
  //           return new Point3D(x, y, this.z);
  //         };
  //       }
  //     }
  //   }
  // },
}

