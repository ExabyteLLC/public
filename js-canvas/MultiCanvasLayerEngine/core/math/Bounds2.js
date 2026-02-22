import Vector2 from './Vector2.js';
import { MathUtils } from './MathUtils.js';

export default class Bounds2 {
    min; max;

    constructor(
        min = new Vector2(Infinity, Infinity),
        max = new Vector2(-Infinity, -Infinity)
    ) {
        this.min = min.copy();
        this.max = max.copy();
    }

    // Create bounds from width and height
    static fromSize(width, height) {
        return new Bounds2(
            new Vector2(0, 0),
            new Vector2(width, height)
        );
    }

    // Create bounds from center and size
    static fromCenter(center, width, height) {
        const halfW = width / 2;
        const halfH = height / 2;
        return new Bounds2(
            new Vector2(center.x - halfW, center.y - halfH),
            new Vector2(center.x + halfW, center.y + halfH)
        );
    }

    // Create bounds from array of points
    static fromPoints(points) {
        const bounds = new Bounds2();
        points.forEach(point => bounds.expand(point));
        return bounds;
    }

    get width() {
        return this.max.x - this.min.x;
    }

    get height() {
        return this.max.y - this.min.y;
    }

    get size() {
        return new Vector2(this.width, this.height);
    }

    get center() {
        return new Vector2(
            (this.min.x + this.max.x) / 2,
            (this.min.y + this.max.y) / 2
        );
    }

    get area() {
        return this.width * this.height;
    }

    get perimeter() {
        return 2 * (this.width + this.height);
    }

    get topLeft() {
        return this.min.copy();
    }

    get topRight() {
        return new Vector2(this.max.x, this.min.y);
    }

    get bottomLeft() {
        return new Vector2(this.min.x, this.max.y);
    }

    get bottomRight() {
        return this.max.copy();
    }

    get corners() {
        return [
            this.topLeft,
            this.topRight,
            this.bottomRight,
            this.bottomLeft
        ];
    }

    // Check if bounds are valid (min <= max)
    get isValid() {
        return this.min.x <= this.max.x && this.min.y <= this.max.y;
    }

    // Expand bounds to include point
    expand(point) {
        this.min.x = Math.min(this.min.x, point.x);
        this.min.y = Math.min(this.min.y, point.y);
        this.max.x = Math.max(this.max.x, point.x);
        this.max.y = Math.max(this.max.y, point.y);
        return this;
    }

    // Expand bounds by padding
    pad(padding) {
        if (typeof padding === 'number') {
            this.min.x -= padding;
            this.min.y -= padding;
            this.max.x += padding;
            this.max.y += padding;
        } else {
            this.min.x -= padding.x;
            this.min.y -= padding.y;
            this.max.x += padding.x;
            this.max.y += padding.y;
        }
        return this;
    }

    // Translate bounds
    translate(v) {
        this.min.add(v);
        this.max.add(v);
        return this;
    }

    // Scale bounds around center
    scale(s) {
        const center = this.center;
        if (typeof s === 'number') {
            this.min = Vector2.lerp(center, this.min, s);
            this.max = Vector2.lerp(center, this.max, s);
        } else {
            this.min = Vector2.lerp(center, this.min, s.x);
            this.max = Vector2.lerp(center, this.max, s.y);
        }
        return this;
    }

    // Check if bounds contain point
    contains(point) {
        return point.x >= this.min.x && point.x <= this.max.x &&
            point.y >= this.min.y && point.y <= this.max.y;
    }

    // Check if bounds contain other bounds
    containsBounds(other) {
        return this.contains(other.min) && this.contains(other.max);
    }

    // Check if bounds intersect with other bounds
    intersects(other) {
        return !(other.max.x < this.min.x ||
            other.min.x > this.max.x ||
            other.max.y < this.min.y ||
            other.min.y > this.max.y);
    }

    // Get intersection bounds with other bounds
    intersection(other) {
        if (!this.intersects(other)) {
            return new Bounds2(); // Empty bounds
        }

        return new Bounds2(
            new Vector2(
                Math.max(this.min.x, other.min.x),
                Math.max(this.min.y, other.min.y)
            ),
            new Vector2(
                Math.min(this.max.x, other.max.x),
                Math.min(this.max.y, other.max.y)
            )
        );
    }

    // Get union bounds with other bounds
    union(other) {
        return new Bounds2(
            new Vector2(
                Math.min(this.min.x, other.min.x),
                Math.min(this.min.y, other.min.y)
            ),
            new Vector2(
                Math.max(this.max.x, other.max.x),
                Math.max(this.max.y, other.max.y)
            )
        );
    }

    // Clamp point to bounds
    clampPoint(point) {
        return new Vector2(
            MathUtils.clamp(point.x, this.min.x, this.max.x),
            MathUtils.clamp(point.y, this.min.y, this.max.y)
        );
    }

    // Wrap point around bounds
    wrapPoint(point) {
        return new Vector2(
            MathUtils.wrap(point.x, this.min.x, this.max.x),
            MathUtils.wrap(point.y, this.min.y, this.max.y)
        );
    }

    // Get normalized position of point within bounds
    normalizePoint(point) {
        return new Vector2(
            (point.x - this.min.x) / this.width,
            (point.y - this.min.y) / this.height
        );
    }

    // Get point from normalized coordinates
    denormalizePoint(normalized) {
        return new Vector2(
            this.min.x + normalized.x * this.width,
            this.min.y + normalized.y * this.height
        );
    }

    // Get random point inside bounds
    randomPoint() {
        return new Vector2(
            MathUtils.clamp(Math.random() * this.width + this.min.x, this.min.x, this.max.x),
            MathUtils.clamp(Math.random() * this.height + this.min.y, this.min.y, this.max.y)
        );
    }

    // Get random point on edge of bounds
    randomEdgePoint() {
        const edge = Math.floor(Math.random() * 4);
        const t = Math.random();

        switch (edge) {
            case 0: // Top
                return new Vector2(
                    this.min.x + t * this.width,
                    this.min.y
                );
            case 1: // Right
                return new Vector2(
                    this.max.x,
                    this.min.y + t * this.height
                );
            case 2: // Bottom
                return new Vector2(
                    this.min.x + t * this.width,
                    this.max.y
                );
            case 3: // Left
                return new Vector2(
                    this.min.x,
                    this.min.y + t * this.height
                );
        }
    }

    // Split bounds into grid
    split(rows, cols) {
        const cellWidth = this.width / cols;
        const cellHeight = this.height / rows;
        const cells = [];

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                cells.push(new Bounds2(
                    new Vector2(
                        this.min.x + col * cellWidth,
                        this.min.y + row * cellHeight
                    ),
                    new Vector2(
                        this.min.x + (col + 1) * cellWidth,
                        this.min.y + (row + 1) * cellHeight
                    )
                ));
            }
        }

        return cells;
    }

    // Draw bounds (useful for debugging)
    draw(context, color = 'red') {
        context.strokeStyle = color;
        context.lineWidth = 2;
        context.strokeRect(
            this.min.x,
            this.min.y,
            this.width,
            this.height
        );
    }

    // Fill bounds
    fill(context, color = 'rgba(255,0,0,0.2)') {
        context.fillStyle = color;
        context.fillRect(
            this.min.x,
            this.min.y,
            this.width,
            this.height
        );
    }

    copy() {
        return new Bounds2(this.min.copy(), this.max.copy());
    }

    equals(other, epsilon = 0.0001) {
        return this.min.equals(other.min, epsilon) &&
            this.max.equals(other.max, epsilon);
    }

    toString() {
        return `Bounds2(min=${this.min.toString()}, max=${this.max.toString()})`;
    }
}