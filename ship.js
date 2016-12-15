function Ship() {
    this.pos = createVector(width / 2, height / 2);
    this.r = 20;
    this.heading = 0;
    this.rotation = 0;
    this.vel = createVector(0, 0);
    this.isBoosting = false;
    this.isDestroyed = false;
    this.destroyFrames = 600;

    this.boosting = function (b) {
        this.isBoosting = b;
    }

    this.update = function () {
        if (this.isDestroyed) {
            this.destroyedUpdate();
        } else {
            if (this.isBoosting) {
                this.boost();
            }
            this.pos.add(this.vel);
            this.vel.mult(0.99);
        }
    }

    this.boost = function () {
        var force = p5.Vector.fromAngle(this.heading);
        force.mult(0.1);
        this.vel.add(force);
    }

    this.brokenParts = [];
    this.destroy = function () {
        this.isDestroyed = true;
        this.brokenParts = [
            { pos: this.pos.copy(), vel: p5.Vector.random2D(), heading: random(0, 360), rot: random(-0.07, 0.07) },
            { pos: this.pos.copy(), vel: p5.Vector.random2D(), heading: random(0, 360), rot: random(-0.07, 0.07) },
            { pos: this.pos.copy(), vel: p5.Vector.random2D(), heading: random(0, 360), rot: random(-0.07, 0.07) },
            { pos: this.pos.copy(), vel: p5.Vector.random2D(), heading: random(0, 360), rot: random(-0.07, 0.07) }];
    }

    this.hits = function (asteroid) {
        var d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
        if (d < this.r + asteroid.r) {
            return true;
        } else {
            return false;
        }
    }


    this.pewpew = 0;
    this.render = function () {
        if (this.isDestroyed) {
            this.destroyedRender(this.r);
        } else {
            push();
            fill(0);
            stroke(255);
            translate(this.pos.x, this.pos.y);
            rotate(this.heading + PI / 2);
            triangle(-this.r * 0.7, this.r / 2, this.r * 0.7, this.r / 2, 0, -this.r / 0.75);
            if (this.isBoosting) {
                if (this.pewpew > 5)
                    triangle(-this.r / 3, this.r / 2, this.r / 3, this.r / 2, 0, this.r * (this.pewpew * 0.1));
                if (this.pewpew > 10)
                    this.pewpew = 0;
            } else {
                this.pewpew = 0;
            }
            this.pewpew++;

            pop();
        }
    }


    this.destroyedUpdate = function () {
        for (var i = 0; i < this.brokenParts.length; i++) {
            this.brokenParts[i].pos.add(this.brokenParts[i].vel);
            this.brokenParts[i].heading += this.brokenParts[i].rot;
        }
    }

    this.destroyedRender = function (r) {
        for (var i = 0; i < this.brokenParts.length; i++) {
            push();
            stroke(floor(255 * ((this.destroyFrames--) / 600)));
            var bp = this.brokenParts[i];
            translate(bp.pos.x, bp.pos.y);
            rotate(bp.heading);
            line(-r / 2, -r / 2, r / 2, r / 2);
            pop();
        }
    }

    this.edges = function () {
        if (this.pos.x > width + this.r) {
            this.pos.x = -this.r;
        } else if (this.pos.x < -this.r) {
            this.pos.x = width + this.r;
        }
        if (this.pos.y > height + this.r) {
            this.pos.y = -this.r;
        } else if (this.pos.y < -this.r) {
            this.pos.y = height + this.r;
        }
    }

    this.setRotation = function (a) {
        this.rotation = a;
    }

    this.turn = function () {
        this.heading += this.rotation;
    }

}
