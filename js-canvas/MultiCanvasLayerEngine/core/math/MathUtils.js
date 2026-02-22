// Random number utilities
export const Random = {
    // Random float between min and max
    float: (min = 0, max = 1) => Math.random() * (max - min) + min,

    // Random integer between min and max (inclusive)
    int: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,

    // Random boolean
    bool: (probability = 0.5) => Math.random() < probability,

    // Random sign (-1 or 1)
    sign: () => Math.random() < 0.5 ? -1 : 1,

    // Random point inside circle
    pointInCircle: (radius = 1) => {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random()) * radius;
        return new Vector2(
            Math.cos(angle) * r,
            Math.sin(angle) * r
        );
    },

    // Random point inside rectangle
    pointInRect: (width, height) => new Vector2(
        Math.random() * width,
        Math.random() * height
    ),

    // Random color
    color: (alpha = 1) => {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    },

    // Random hex color
    hexColor: () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'),

    // Random element from array
    fromArray: (arr) => arr[Math.floor(Math.random() * arr.length)],

    // Shuffle array
    shuffle: (arr) => {
        const result = [...arr];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }
};

// Interpolation utilities
export const Interpolation = {
    // Linear interpolation
    lerp: (a, b, t) => a + (b - a) * t,

    // Inverse linear interpolation (find t given value between a and b)
    inverseLerp: (a, b, value) => (value - a) / (b - a),

    // Smooth interpolation (ease in-out)
    smooth: (t) => t * t * (3 - 2 * t),

    // Smoother interpolation (ease in-out, more pronounced)
    smoother: (t) => t * t * t * (t * (t * 6 - 15) + 10),

    // Ease in
    easeIn: (t, power = 2) => Math.pow(t, power),

    // Ease out
    easeOut: (t, power = 2) => 1 - Math.pow(1 - t, power),

    // Ease in-out
    easeInOut: (t, power = 2) => {
        return t < 0.5
            ? Math.pow(2, power - 1) * Math.pow(t, power)
            : 1 - Math.pow(-2 * t + 2, power) / 2;
    },

    // Map value from one range to another
    map: (value, fromMin, fromMax, toMin, toMax, clamp = false) => {
        const t = (value - fromMin) / (fromMax - fromMin);
        const result = toMin + (toMax - toMin) * t;
        return clamp ? MathUtils.clamp(result, toMin, toMax) : result;
    }
};

// Angle utilities
export const Angle = {
    // Convert degrees to radians
    toRadians: (degrees) => degrees * Math.PI / 180,

    // Convert radians to degrees
    toDegrees: (radians) => radians * 180 / Math.PI,

    // Normalize angle to [0, 2PI)
    normalize: (radians) => {
        const twoPI = Math.PI * 2;
        radians = radians % twoPI;
        return radians < 0 ? radians + twoPI : radians;
    },

    // Shortest angular distance between two angles
    distance: (a, b) => {
        const diff = Math.abs(Angle.normalize(a) - Angle.normalize(b));
        return Math.min(diff, Math.PI * 2 - diff);
    },

    // Interpolate between two angles (shortest path)
    lerp: (a, b, t) => {
        a = Angle.normalize(a);
        b = Angle.normalize(b);

        // Calculate shortest direction
        let diff = b - a;
        if (diff > Math.PI) diff -= Math.PI * 2;
        if (diff < -Math.PI) diff += Math.PI * 2;

        return a + diff * t;
    },

    // Get angle between two points (in radians)
    between: (x1, y1, x2, y2) => Math.atan2(y2 - y1, x2 - x1),

    // Rotate point around origin
    rotatePoint: (x, y, angle) => {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Vector2(
            x * cos - y * sin,
            x * sin + y * cos
        );
    }
};

// General math utilities
export const MathUtils = {
    // Clamp value between min and max
    clamp: (value, min, max) => Math.min(Math.max(value, min), max),

    // Wrap value around range
    wrap: (value, min, max) => {
        const range = max - min;
        return min + ((value - min) % range + range) % range;
    },

    // Ping pong between min and max
    pingPong: (value, min, max) => {
        const range = max - min;
        const t = ((value - min) / range) % 2;
        return t <= 1
            ? min + range * t
            : max - range * (t - 1);
    },

    // Linear to gamma space
    toGamma: (linear) => Math.pow(linear, 1 / 2.2),

    // Gamma to linear space
    toLinear: (gamma) => Math.pow(gamma, 2.2),

    // Smoothstep function
    smoothStep: (edge0, edge1, x) => {
        const t = MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
        return t * t * (3 - 2 * t);
    },

    // Check if value is power of two
    isPowerOfTwo: (x) => (x & (x - 1)) === 0 && x !== 0,

    // Nearest power of two
    nearestPowerOfTwo: (x) => Math.pow(2, Math.round(Math.log2(x))),

    // Floating point comparison with epsilon
    approxEqual: (a, b, epsilon = 0.0001) => Math.abs(a - b) < epsilon
};