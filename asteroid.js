function Asteroid(pos, r, size) {
    if (pos) {
        this.pos = pos.copy();
    } else {
        do {
            //should never spawn an asteroid on the player
            this.pos = createVector(random(width), random(height));
        } while (Math.abs(this.pos.x - width / 2) < 200 && Math.abs(this.pos.y - height / 2) < 200)
    }
    if (r) {
        this.r = r * 0.5;
    } else {
        this.r = random(50, 70);
    }

    this.size = size;
    this.vel = p5.Vector.random2D();
    this.heading = 0;
    this.rotation = random(-0.02, 0.02);

    //smaller asteroids (generally) go faster (praise to the random gods)
    switch (size) {
        case 0:
            this.vel.x *= 2;
            this.vel.y *= 2;
            this.rotation *= 2;
            break;
        case 1:
            this.vel.x *= 1.5;
            this.vel.y *= 1.5;
            this.rotation *= 1.5;
            break;
        default:
            break;
    }

    this.total = floor(random(10, 15));
    this.offset = [];
    for (var i = 0; i < this.total; i++) {
        this.offset[i] = random(-this.r * 0.3, this.r * 0.3);
    }

    this.update = function () {
        this.heading += this.rotation;
        this.pos.add(this.vel);
    }

    this.render = function () {
        push();
        stroke(255);
        noFill();
        translate(this.pos.x, this.pos.y);
        rotate(this.heading);
        beginShape();
        for (var i = 0; i < this.total; i++) {
            var angle = map(i, 0, this.total, 0, TWO_PI);
            var r = this.r + this.offset[i];
            var x = r * cos(angle);
            var y = r * sin(angle);
            vertex(x, y);
        }
        endShape(CLOSE);
        pop();
    }

    this.breakup = function () {
        var newA = [];
        if (this.size > 0) {
            newA[0] = new Asteroid(this.pos, this.r, this.size - 1);
            newA[1] = new Asteroid(this.pos, this.r, this.size - 1);
        }
        return newA;
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

}
