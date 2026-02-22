import { MathUtils } from './MathUtils.js';

export default class Vector2 {
    x; y;

    static get Zero() {
        return new Vector2(0, 0);
    }
    static get Left() {
        return new Vector2(-1, 0);
    }
    static get Right() {
        return new Vector2(1, 0);
    }
    static get Up() {
        return new Vector2(0, -1);
    }
    static get Down() {
        return new Vector2(0, 1);
    }

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    // Basic operations with different parameter types
    set(x, y) {
        if (x instanceof Vector2) {
            this.x = x.x;
            this.y = x.y;
        } else {
            this.x = x;
            this.y = y !== undefined ? y : x;
        }
        return this;
    }

    copy() {
        return new Vector2(this.x, this.y);
    }

    // Addition (vector + vector, vector + scalar)
    add(v) {
        if (v instanceof Vector2) {
            this.x += v.x;
            this.y += v.y;
        } else {
            this.x += v;
            this.y += v;
        }
        return this;
    }

    // Subtraction (vector - vector, vector - scalar)
    subtract(v) {
        if (v instanceof Vector2) {
            this.x -= v.x;
            this.y -= v.y;
        } else {
            this.x -= v;
            this.y -= v;
        }
        return this;
    }

    // Multiplication (vector * vector, vector * scalar)
    multiply(v) {
        if (v instanceof Vector2) {
            this.x *= v.x;
            this.y *= v.y;
        } else {
            this.x *= v;
            this.y *= v;
        }
        return this;
    }

    // Division (vector / vector, vector / scalar)
    divide(v) {
        if (v instanceof Vector2) {
            if (v.x !== 0) this.x /= v.x;
            if (v.y !== 0) this.y /= v.y;
        } else if (v !== 0) {
            this.x /= v;
            this.y /= v;
        }
        return this;
    }

    // Scalar operations (for chaining)
    scale(s) {
        return this.multiply(s);
    }

    // Vector math
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    cross(v) {
        return this.x * v.y - this.y * v.x;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    lengthSq() {
        return this.x * this.x + this.y * this.y;
    }

    distance(v) {
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    distanceSq(v) {
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        return dx * dx + dy * dy;
    }

    normalize() {
        const len = this.length();
        if (len > 0) {
            this.x /= len;
            this.y /= len;
        }
        return this;
    }

    normalized() {
        return this.copy().normalize();
    }

    angle() {
        return Math.atan2(this.y, this.x);
    }

    angleTo(v) {
        return Math.atan2(v.y - this.y, v.x - this.x);
    }

    rotate(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const x = this.x * cos - this.y * sin;
        const y = this.x * sin + this.y * cos;
        this.x = x;
        this.y = y;
        return this;
    }

    rotated(angle) {
        return this.copy().rotate(angle);
    }

    perpendicular() {
        return new Vector2(-this.y, this.x);
    }

    floor() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        return this;
    }

    ceil() {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        return this;
    }

    round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this;
    }

    abs() {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);
        return this;
    }

    min(v) {
        if (v instanceof Vector2) {
            this.x = Math.min(this.x, v.x);
            this.y = Math.min(this.y, v.y);
        } else {
            this.x = Math.min(this.x, v);
            this.y = Math.min(this.y, v);
        }
        return this;
    }

    max(v) {
        if (v instanceof Vector2) {
            this.x = Math.max(this.x, v.x);
            this.y = Math.max(this.y, v.y);
        } else {
            this.x = Math.max(this.x, v);
            this.y = Math.max(this.y, v);
        }
        return this;
    }

    clamp(min, max) {
        if (min instanceof Vector2) {
            this.x = MathUtils.clamp(this.x, min.x, max.x);
            this.y = MathUtils.clamp(this.y, min.y, max.y);
        } else {
            this.x = MathUtils.clamp(this.x, min, max);
            this.y = MathUtils.clamp(this.y, min, max);
        }
        return this;
    }

    wrap(min, max) {
        if (min instanceof Vector2) {
            this.x = MathUtils.wrap(this.x, min.x, max.x);
            this.y = MathUtils.wrap(this.y, min.y, max.y);
        } else {
            this.x = MathUtils.wrap(this.x, min, max);
            this.y = MathUtils.wrap(this.y, min, max);
        }
        return this;
    }

    lerp(v, t) {
        if (v instanceof Vector2) {
            this.x += (v.x - this.x) * t;
            this.y += (v.y - this.y) * t;
        } else {
            this.x += (v - this.x) * t;
            this.y += (v - this.y) * t;
        }
        return this;
    }

    lerped(v, t) {
        return this.copy().lerp(v, t);
    }

    // Check if vector is zero
    isZero() {
        return this.x === 0 && this.y === 0;
    }

    // Check if vector is finite
    isFinite() {
        return isFinite(this.x) && isFinite(this.y);
    }

    // Check if vector is NaN
    isNaN() {
        return isNaN(this.x) || isNaN(this.y);
    }

    equals(v, epsilon = 0.0001) {
        if (v instanceof Vector2) {
            return Math.abs(this.x - v.x) < epsilon &&
                Math.abs(this.y - v.y) < epsilon;
        }
        return Math.abs(this.x - v) < epsilon &&
            Math.abs(this.y - v) < epsilon;
    }

    // Convert to different formats
    toString() {
        return `Vector2(${this.x.toFixed(2)}, ${this.y.toFixed(2)})`;
    }

    toArray() {
        return [this.x, this.y];
    }

    toObject() {
        return { x: this.x, y: this.y };
    }

    // Static methods for creating vectors
    static get zero() { return new Vector2(0, 0); }
    static get one() { return new Vector2(1, 1); }
    static get up() { return new Vector2(0, -1); }
    static get down() { return new Vector2(0, 1); }
    static get left() { return new Vector2(-1, 0); }
    static get right() { return new Vector2(1, 0); }

    static fromAngle(angle, length = 1) {
        return new Vector2(
            Math.cos(angle) * length,
            Math.sin(angle) * length
        );
    }

    static fromArray(arr) {
        return new Vector2(arr[0] || 0, arr[1] || 0);
    }

    static fromObject(obj) {
        return new Vector2(obj.x || 0, obj.y || 0);
    }

    static random(scale = 1) {
        return new Vector2(
            (Math.random() - 0.5) * 2 * scale,
            (Math.random() - 0.5) * 2 * scale
        );
    }

    static randomDirection() {
        const angle = Math.random() * Math.PI * 2;
        return new Vector2(Math.cos(angle), Math.sin(angle));
    }

    // Static math operations (return new vectors)
    static add(a, b) {
        if (a instanceof Vector2 && b instanceof Vector2) {
            return new Vector2(a.x + b.x, a.y + b.y);
        }
        return new Vector2(a.x + b, a.y + b);
    }

    static subtract(a, b) {
        if (a instanceof Vector2 && b instanceof Vector2) {
            return new Vector2(a.x - b.x, a.y - b.y);
        }
        return new Vector2(a.x - b, a.y - b);
    }

    static multiply(a, b) {
        if (a instanceof Vector2 && b instanceof Vector2) {
            return new Vector2(a.x * b.x, a.y * b.y);
        }
        return new Vector2(a.x * b, a.y * b);
    }

    static divide(a, b) {
        if (a instanceof Vector2 && b instanceof Vector2) {
            return new Vector2(
                b.x !== 0 ? a.x / b.x : 0,
                b.y !== 0 ? a.y / b.y : 0
            );
        }
        return new Vector2(
            b !== 0 ? a.x / b : 0,
            b !== 0 ? a.y / b : 0
        );
    }

    static dot(a, b) {
        return a.x * b.x + a.y * b.y;
    }

    static cross(a, b) {
        return a.x * b.y - a.y * b.x;
    }

    static distance(a, b) {
        return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
    }

    static distanceSq(a, b) {
        return (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
    }

    static min(a, b) {
        if (a instanceof Vector2 && b instanceof Vector2) {
            return new Vector2(
                Math.min(a.x, b.x),
                Math.min(a.y, b.y)
            );
        }
        return new Vector2(
            Math.min(a.x, b),
            Math.min(a.y, b)
        );
    }

    static max(a, b) {
        if (a instanceof Vector2 && b instanceof Vector2) {
            return new Vector2(
                Math.max(a.x, b.x),
                Math.max(a.y, b.y)
            );
        }
        return new Vector2(
            Math.max(a.x, b),
            Math.max(a.y, b)
        );
    }

    static clamp(v, min, max) {
        return new Vector2(
            MathUtils.clamp(v.x, min instanceof Vector2 ? min.x : min, max instanceof Vector2 ? max.x : max),
            MathUtils.clamp(v.y, min instanceof Vector2 ? min.y : min, max instanceof Vector2 ? max.y : max)
        );
    }

    static wrap(v, min, max) {
        return new Vector2(
            MathUtils.wrap(v.x, min instanceof Vector2 ? min.x : min, max instanceof Vector2 ? max.x : max),
            MathUtils.wrap(v.y, min instanceof Vector2 ? min.y : min, max instanceof Vector2 ? max.y : max)
        );
    }

    static lerp(a, b, t) {
        if (a instanceof Vector2 && b instanceof Vector2) {
            return new Vector2(
                a.x + (b.x - a.x) * t,
                a.y + (b.y - a.y) * t
            );
        }
        return new Vector2(
            a.x + (b - a.x) * t,
            a.y + (b - a.y) * t
        );
    }

    static project(vector, onto) {
        const dot = vector.dot(onto);
        const ontoLengthSq = onto.lengthSq();
        if (ontoLengthSq === 0) return Vector2.zero;
        const scale = dot / ontoLengthSq;
        return Vector2.multiply(onto, scale);
    }

    static reject(vector, onto) {
        return Vector2.subtract(vector, Vector2.project(vector, onto));
    }

    static reflect(vector, normal) {
        const dot = vector.dot(normal);
        return Vector2.subtract(vector, Vector2.multiply(normal, 2 * dot));
    }
}