import Vector2 from '../math/Vector2.js';
import { MathUtils } from '../math/MathUtils.js';
import Bounds2 from '../math/Bounds2.js';

// Collision manifold
export class CollisionManifold {
    constructor() {
        this.colliding = false;
        this.normal = new Vector2(0, 0);
        this.penetration = 0;
        this.contactPoint = new Vector2(0, 0);
        this.relativeVelocity = new Vector2(0, 0);
    }

    reset() {
        this.colliding = false;
        this.normal.set(0, 0);
        this.penetration = 0;
        this.contactPoint.set(0, 0);
        this.relativeVelocity.set(0, 0);
    }
}

// Shape base class
export class Shape {
    constructor(type, position = new Vector2()) {
        this.type = type;
        this.position = position.copy();
    }

    getAABB() {
        throw new Error('getAABB must be implemented');
    }

    constrainToBounds(bounds, velocity = new Vector2(), bounce = 0.5, friction = 0.5) {
        throw new Error('constrainToBounds must be implemented');
    }
}

// Circle shape
export class Circle extends Shape {
    constructor(position, radius) {
        super('circle', position);
        this.radius = radius;
    }

    getAABB() {
        return {
            min: new Vector2(this.position.x - this.radius, this.position.y - this.radius),
            max: new Vector2(this.position.x + this.radius, this.position.y + this.radius)
        };
    }

    constrainToBounds(bounds, velocity = new Vector2(), bounce = 0.3, friction = 0.7) {
        const result = {
            collided: false,
            normal: new Vector2(),
            velocity: velocity.copy()
        };

        const epsilon = 0.001;

        // Left edge
        if (this.position.x - this.radius < bounds.min.x) {
            this.position.x = bounds.min.x + this.radius + epsilon;
            result.collided = true;
            result.normal.x += 1;
            result.velocity.x = Math.abs(result.velocity.x) * bounce;
        }
        // Right edge
        if (this.position.x + this.radius > bounds.max.x) {
            this.position.x = bounds.max.x - this.radius - epsilon;
            result.collided = true;
            result.normal.x -= 1;
            result.velocity.x = -Math.abs(result.velocity.x) * bounce;
        }
        // Top edge
        if (this.position.y - this.radius < bounds.min.y) {
            this.position.y = bounds.min.y + this.radius + epsilon;
            result.collided = true;
            result.normal.y += 1;
            result.velocity.y = Math.abs(result.velocity.y) * bounce;
        }
        // Bottom edge
        if (this.position.y + this.radius > bounds.max.y) {
            this.position.y = bounds.max.y - this.radius - epsilon;
            result.collided = true;
            result.normal.y -= 1;
            result.velocity.y = -Math.abs(result.velocity.y) * bounce;
        }

        if (result.collided) {
            result.normal.normalize();

            // Strong friction when hitting bounds
            if (friction > 0) {
                const tangent = new Vector2(-result.normal.y, result.normal.x);
                const tangentVel = Vector2.dot(result.velocity, tangent);

                // Apply strong friction to stop sliding
                const frictionFactor = Math.min(1, friction * 2);
                result.velocity.subtract(Vector2.multiply(tangent, tangentVel * frictionFactor));
            }

            // Kill very small velocities
            if (Math.abs(result.velocity.x) < 0.5) result.velocity.x = 0;
            if (Math.abs(result.velocity.y) < 0.5) result.velocity.y = 0;
        }

        return result;
    }
}

// AABB shape
export class AABB extends Shape {
    constructor(position, width, height) {
        super('aabb', position);
        this.width = width;
        this.height = height;
        this.halfExtents = new Vector2(width / 2, height / 2);
    }

    get min() {
        return new Vector2(
            this.position.x - this.halfExtents.x,
            this.position.y - this.halfExtents.y
        );
    }

    get max() {
        return new Vector2(
            this.position.x + this.halfExtents.x,
            this.position.y + this.halfExtents.y
        );
    }

    getAABB() {
        return { min: this.min, max: this.max };
    }

    constrainToBounds(bounds, velocity = new Vector2(), bounce = 0.3, friction = 0.7) {
        const result = {
            collided: false,
            normal: new Vector2(),
            velocity: velocity.copy()
        };

        const min = this.min;
        const max = this.max;
        const epsilon = 0.001;

        if (min.x < bounds.min.x) {
            this.position.x += bounds.min.x - min.x + epsilon;
            result.collided = true;
            result.normal.x += 1;
            result.velocity.x = Math.abs(result.velocity.x) * bounce;
        }
        if (max.x > bounds.max.x) {
            this.position.x -= max.x - bounds.max.x + epsilon;
            result.collided = true;
            result.normal.x -= 1;
            result.velocity.x = -Math.abs(result.velocity.x) * bounce;
        }
        if (min.y < bounds.min.y) {
            this.position.y += bounds.min.y - min.y + epsilon;
            result.collided = true;
            result.normal.y += 1;
            result.velocity.y = Math.abs(result.velocity.y) * bounce;
        }
        if (max.y > bounds.max.y) {
            this.position.y -= max.y - bounds.max.y + epsilon;
            result.collided = true;
            result.normal.y -= 1;
            result.velocity.y = -Math.abs(result.velocity.y) * bounce;
        }

        if (result.collided) {
            result.normal.normalize();

            if (friction > 0) {
                const tangent = new Vector2(-result.normal.y, result.normal.x);
                const tangentVel = Vector2.dot(result.velocity, tangent);

                // Strong friction
                const frictionFactor = Math.min(1, friction * 2);
                result.velocity.subtract(Vector2.multiply(tangent, tangentVel * frictionFactor));
            }

            if (Math.abs(result.velocity.x) < 0.5) result.velocity.x = 0;
            if (Math.abs(result.velocity.y) < 0.5) result.velocity.y = 0;
        }

        return result;
    }
}

// Physics material with better friction defaults
export class PhysicsMaterial {
    constructor({
        density = 1.0,
        restitution = 0.2,      // Less bounce
        friction = 0.7,          // More friction
        staticFriction = 0.8,    // Higher static friction
        dynamicFriction = 0.6,   // Higher dynamic friction
        stickiness = 0.3         // New: helps objects settle
    } = {}) {
        this.density = density;
        this.restitution = Math.min(restitution, 0.6);
        this.friction = friction;
        this.staticFriction = staticFriction;
        this.dynamicFriction = dynamicFriction;
        this.stickiness = stickiness; // How much objects want to stop
    }

    static get BOUNCE() { return new PhysicsMaterial({ restitution: 0.5, friction: 0.5, stickiness: 0.2 }); }
    static get SLIPPERY() { return new PhysicsMaterial({ restitution: 0.2, friction: 0.2, stickiness: 0.1 }); }
    static get ROUGH() { return new PhysicsMaterial({ restitution: 0.1, friction: 0.9, stickiness: 0.5 }); }
    static get BOUNCY_BALL() { return new PhysicsMaterial({ restitution: 0.6, friction: 0.3, stickiness: 0.1 }); }
    static get WOOD() { return new PhysicsMaterial({ restitution: 0.2, friction: 0.7, stickiness: 0.3 }); }
    static get METAL() { return new PhysicsMaterial({ restitution: 0.3, friction: 0.4, stickiness: 0.2 }); }
    static get STICKY() { return new PhysicsMaterial({ restitution: 0.05, friction: 0.95, stickiness: 0.8 }); }
    static get HEAVY() { return new PhysicsMaterial({ restitution: 0.1, friction: 0.8, stickiness: 0.4 }); }
}

// Physics body with resting detection
export class PhysicsBody {
    constructor({
        shape,
        material = new PhysicsMaterial(),
        mass = 1.0,
        velocity = new Vector2(),
        isStatic = false,
        gravityScale = 1.0,
        bounds = null,
        maxSpeed = 400,
        sleepThreshold = 0.1,     // Speed threshold to fall asleep
        sleepTime = 0              // How long to be still before sleeping
    } = {}) {
        this.shape = shape;
        this.material = material;
        this.mass = isStatic ? Infinity : Math.max(mass, 0.1);
        this.invMass = isStatic ? 0 : 1 / this.mass;
        this.velocity = velocity.copy();
        this.isStatic = isStatic;
        this.gravityScale = gravityScale;
        this.force = new Vector2();
        this.bounds = bounds;
        this.maxSpeed = maxSpeed;

        // Sleeping system
        this.sleepThreshold = sleepThreshold;
        this.sleepTime = sleepTime;
        this.isSleeping = false;
        this.oldPosition = shape.position.copy();

        // Contact tracking
        this.contacts = [];
        this.contactNormals = [];
    }

    applyForce(force) {
        if (this.isStatic || this.isSleeping) return;
        this.force.add(force);
    }

    applyImpulse(impulse) {
        if (this.isStatic || this.isSleeping || impulse.length() < 0.01) return;
        this.velocity.add(Vector2.multiply(impulse, this.invMass));
        this.wakeUp();
    }

    limitSpeed() {
        const speed = this.velocity.length();
        if (speed > this.maxSpeed) {
            this.velocity.normalize().multiply(this.maxSpeed);
        }
    }

    // Check if body should sleep
    updateSleeping(dt) {
        if (this.isStatic) return;

        const movement = Vector2.distance(this.shape.position, this.oldPosition);
        this.oldPosition.copy(this.shape.position);

        if (movement < this.sleepThreshold && this.velocity.length() < this.sleepThreshold) {
            this.sleepTime += dt;
            if (this.sleepTime > 1.0) { // Sleep after 1 second of stillness
                this.isSleeping = true;
                this.velocity.set(0, 0);
            }
        } else {
            this.sleepTime = 0;
            this.isSleeping = false;
        }
    }

    wakeUp() {
        this.isSleeping = false;
        this.sleepTime = 0;
    }

    update(dt, gravity = new Vector2(0, 500)) {
        if (this.isStatic) return { collided: false };

        dt = Math.min(dt, 0.033);

        // Skip if sleeping
        if (this.isSleeping) return { collided: false };

        // Apply forces
        if (gravity && gravity.length() > 0) {
            this.applyForce(Vector2.multiply(gravity, this.mass * this.gravityScale));
        }

        // Acceleration
        const acceleration = Vector2.multiply(this.force, this.invMass);
        this.velocity.add(Vector2.multiply(acceleration, dt));

        // Strong damping when many contacts (helps settling)
        if (this.contacts.length > 1) {
            this.velocity.multiply(1 - (0.1 * this.material.stickiness));
        }

        this.limitSpeed();

        // Update position
        this.shape.position.add(Vector2.multiply(this.velocity, dt));

        // Constrain to bounds
        let boundsCollision = { collided: false };
        if (this.bounds) {
            boundsCollision = this.shape.constrainToBounds(
                this.bounds,
                this.velocity,
                this.material.restitution,
                this.material.friction
            );

            if (boundsCollision.collided) {
                this.velocity.set(boundsCollision.velocity);
            }
        }

        // Reset forces and contacts
        this.force.set(0, 0);
        this.contacts = [];
        this.contactNormals = [];

        // Check sleeping
        this.updateSleeping(dt);

        return boundsCollision;
    }
}

// Collision detector
export class CollisionDetector {
    static circleVsCircle(circle1, circle2, manifold) {
        manifold.reset();

        const delta = Vector2.subtract(circle2.position, circle1.position);
        const distance = delta.length();
        const radiusSum = circle1.radius + circle2.radius;

        if (distance < radiusSum - 0.001) {
            manifold.colliding = true;

            if (distance > 0.001) {
                manifold.normal = delta.normalize();
                manifold.penetration = radiusSum - distance;
                manifold.contactPoint = Vector2.add(
                    circle1.position,
                    Vector2.multiply(manifold.normal, circle1.radius - manifold.penetration * 0.5)
                );
            } else {
                manifold.normal = new Vector2(1, 0);
                manifold.penetration = circle1.radius;
                manifold.contactPoint = circle1.position.copy();
            }
        }

        return manifold.colliding;
    }
}

// Stable collision resolver with better resting
export class CollisionResolver {
    static resolveCollision(bodyA, bodyB, manifold, dt) {
        if (!manifold.colliding) return false;
        if (manifold.penetration < 0.01) return false;

        // Skip if both sleeping
        if (bodyA.isSleeping && bodyB.isSleeping) return false;

        // Wake up bodies
        bodyA.wakeUp();
        bodyB.wakeUp();

        // Track contacts for damping
        bodyA.contacts.push(bodyB);
        bodyA.contactNormals.push(manifold.normal.copy());
        bodyB.contacts.push(bodyA);
        bodyB.contactNormals.push(manifold.normal.copy().multiply(-1));

        // Position correction
        this.positionalCorrection(bodyA, bodyB, manifold);

        // Calculate relative velocity
        const relativeVel = Vector2.subtract(bodyA.velocity, bodyB.velocity);
        const velAlongNormal = Vector2.dot(relativeVel, manifold.normal);

        // Don't resolve if moving apart
        if (velAlongNormal > 0.01) return false;

        // Calculate restitution (reduced when resting)
        let restitution = Math.min(bodyA.material.restitution, bodyB.material.restitution);

        // If body has many contacts, reduce bounce (helps settling)
        if (bodyA.contacts.length > 1 || bodyB.contacts.length > 1) {
            restitution *= 0.3;
        }

        // Calculate impulse
        let impulseScalar = -(1 + restitution) * velAlongNormal;
        impulseScalar /= bodyA.invMass + bodyB.invMass;

        // Apply impulse
        const impulse = Vector2.multiply(manifold.normal, impulseScalar);

        if (!bodyA.isStatic) {
            bodyA.velocity.subtract(Vector2.multiply(impulse, bodyA.invMass));
        }
        if (!bodyB.isStatic) {
            bodyB.velocity.add(Vector2.multiply(impulse, bodyB.invMass));
        }

        // Apply strong friction
        this.applyFriction(bodyA, bodyB, manifold, impulseScalar);

        return true;
    }

    static positionalCorrection(bodyA, bodyB, manifold) {
        const percent = 0.3; // Reduced correction
        const slop = 0.05;
        const correction = Math.max(manifold.penetration - slop, 0) /
            (bodyA.invMass + bodyB.invMass) * percent;

        if (correction < 0.001) return;

        const correctionVec = Vector2.multiply(manifold.normal, correction);

        if (!bodyA.isStatic) {
            bodyA.shape.position.subtract(Vector2.multiply(correctionVec, bodyA.invMass));
        }
        if (!bodyB.isStatic) {
            bodyB.shape.position.add(Vector2.multiply(correctionVec, bodyB.invMass));
        }
    }

    static applyFriction(bodyA, bodyB, manifold, impulseScalar) {
        const tangent = new Vector2(-manifold.normal.y, manifold.normal.x);

        const relativeVel = Vector2.subtract(bodyA.velocity, bodyB.velocity);
        const velAlongTangent = Vector2.dot(relativeVel, tangent);

        if (Math.abs(velAlongTangent) < 0.1) return;

        // Stronger friction
        let frictionImpulseScalar = -velAlongTangent * 0.8; // Increased friction factor
        frictionImpulseScalar /= bodyA.invMass + bodyB.invMass;

        // Higher max friction
        const frictionCoeff = (bodyA.material.friction + bodyB.material.friction) / 2;
        const maxFriction = Math.abs(impulseScalar) * frictionCoeff * 1.5; // Increased

        frictionImpulseScalar = MathUtils.clamp(
            frictionImpulseScalar,
            -maxFriction,
            maxFriction
        );

        const frictionImpulse = Vector2.multiply(tangent, frictionImpulseScalar);

        if (!bodyA.isStatic) {
            bodyA.velocity.subtract(Vector2.multiply(frictionImpulse, bodyA.invMass));
        }
        if (!bodyB.isStatic) {
            bodyB.velocity.add(Vector2.multiply(frictionImpulse, bodyB.invMass));
        }

        // Additional static friction for very slow movement
        if (Math.abs(velAlongTangent) < 1.0) {
            const staticFriction = (bodyA.material.staticFriction + bodyB.material.staticFriction) / 2;
            if (!bodyA.isStatic) {
                bodyA.velocity.x *= (1 - staticFriction * 0.1);
                bodyA.velocity.y *= (1 - staticFriction * 0.1);
            }
            if (!bodyB.isStatic) {
                bodyB.velocity.x *= (1 - staticFriction * 0.1);
                bodyB.velocity.y *= (1 - staticFriction * 0.1);
            }
        }
    }
}