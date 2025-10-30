export const rand = (min = 0, max = 1) =>
    Math.random() * (max - min) + min;

export const deg2rad = deg => deg * (Math.PI / 180);
export const rad2deg = rad => rad * (180 / Math.PI);

export const vecLen = (x, y) => Math.hypot(x, y);

export function vecNorm(x, y) {
    const len = vecLen(x, y);
    return len === 0 ? { x: 0, y: 0 } : { x: x / len, y: y / len };
}

export function vecFromRad(rad) {
    return { x: Math.cos(rad), y: Math.sin(rad) };
}

export function vecFromDeg(deg) {
    return vecFromRad(deg2rad(deg));
}

export const vecAdd = (a, b) => ({ x: a.x + b.x, y: a.y + b.y });
export const vecSub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y });
export const vecMul = (v, s) => ({ x: v.x * s, y: v.y * s });
export const vecDot = (a, b) => a.x * b.x + a.y * b.y;

export function vecRotate(x, y, rad) {
    return {
        x: x * Math.cos(rad) - y * Math.sin(rad),
        y: x * Math.sin(rad) + y * Math.cos(rad),
    };
}


export const vecToRad = (x, y) => Math.atan2(y, x);
export const vecToDeg = (x, y) => rad2deg(vecToRad(x, y));

export const vecDist = (x1, y1, x2, y2) =>
    Math.hypot(x2 - x1, y2 - y1);

export const clamp = (v, min, max) =>
    Math.min(Math.max(v, min), max);

// Wraps value between min and max smoothly
export const wrap = (v, min, max) =>
    ((v - min) % (max - min) + (max - min)) % (max - min) + min;

export const lerp = (a, b, t) => a + (b - a) * t;

export const damp = (a, b, lambda, dt) =>
    lerp(a, b, 1 - Math.exp(-lambda * dt));

export const smoothstep = (t) =>
    t * t * (3 - 2 * t);

export const smootherStep = (t) =>
    t * t * t * (t * (t * 6 - 15) + 10);
