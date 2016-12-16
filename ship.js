// Daniel Shiffman
// http://codingrainbow.com
// http://patreon.com/codingrainbow
// Code for: https://youtu.be/hacZU523FyM

function Ship(pos, r) {
  Entity.call(this, width / 2, height / 2, 20);
  this.inFlux = false;
  this.lives = 3;
  var destroyFramesReset = 200;
  var respawnFramesReset = 300;
  var destroyFrames;
  var respawnFrames;

  this.registerId = function(id) {
    Entity.prototype.registerId.call(this, id);
    var scope = this;
    input.registerListener(id, " ".charCodeAt(0), function(char, code, press) {
      if (!press) {
        return;
      }

      var offset = p5.Vector.fromAngle(scope.heading);
      offset.mult(scope.r);
      var laser = new Laser(p5.Vector.add(scope.pos, offset), scope.heading);
      laser.playSoundEffect(laserSoundEffect);
      entitymanager.add(laser);
    });
    input.registerListener(id, RIGHT_ARROW, function(char, code, press) { scope.setRotation(press ? 0.08 : 0); });
    input.registerListener(id, LEFT_ARROW, function(char, code, press) { scope.setRotation(press ? -0.08 : 0); });
    input.registerListener(id, UP_ARROW, function(char, code, press) { scope.setAccel(press ? 0.1 : 0); });
  }

  this.update = function() {
    if(this.inFlux) {
      if (destroyFrames > 0) {
        for(var i = 0; i < this.brokenParts.length; i++) {
          this.brokenParts[i].pos.add(this.brokenParts[i].vel);
          this.brokenParts[i].heading += this.brokenParts[i].rot;
        }
      }

      if (respawnFrames <= 0) {
        this.inFlux = false;
        this.brokenParts.length = 0;
        this.pos.set(width / 2, height / 2);
        this.vel.set(0, 0);
      }

      respawnFrames--;
    } else {
      var dead = Entity.prototype.update.call(this);
      this.vel.mult(0.99);
      if (dead) {
        input.deregisterListener(id, " ".charCodeAt(0));
        input.deregisterListener(id, RIGHT_ARROW);
        input.deregisterListener(id, LEFT_ARROW);
        input.deregisterListener(id, UP_ARROW);
      }

      return dead;
    }
  }

  this.brokenParts = [];

  this.collides = function(entity) {
    if (this.inFlux ||
        entity.toString() !== "[object Asteroid]" ||
        !Entity.prototype.collides.call(this, entity)){
      return false;
    }

    var vertices = [
      createVector(this.pos.x - this.r, this.pos.y - this.r),
      createVector(this.pos.x - this.r, this.pos.y + this.r),
      createVector(this.pos.x + this.r, this.pos.y + 0)
    ];
    var asteroid_vertices = entity.vertices();
    for(var i = 0; i < asteroid_vertices.length; i++) {
      for(var j = 0; j < vertices.length; j++) {
        var opposite = vertices.slice(0);
        opposite.splice(j, 1);
        if(lineIntersect(opposite[0], opposite[1], asteroid_vertices[i], asteroid_vertices[(i + 1) % asteroid_vertices.length])) {
          return true;
        }
      }
    }
    return false;
  }

  this.collision = function(entity) {
    if (entity.toString(entity) === "[object Asteroid]") {
      if (this.lives === 0) {
        this.dead = true;
        // TODO: Do something with this variable.
        levelmanager.gameover = true;
      } else {
        this.inFlux = true;
        this.lives--;
        destroyFrames = destroyFramesReset;
        respawnFrames = respawnFramesReset;
        for(var i = 0; i < 4; i++) {
          this.brokenParts[i] = {
            pos: this.pos.copy(),
            vel: p5.Vector.random2D(),
            heading: random(0, 360),
            rot: random(-0.07, 0.07)
          };
        }
      }
    }
  }

  this.render = function() {
    if(this.inFlux) {
      if (destroyFrames > 0) {
        for(var i = 0; i < this.brokenParts.length; i++) {
          push();
          stroke(floor(255 * (destroyFrames / destroyFramesReset)));
          var bp = this.brokenParts[i];
          translate(bp.pos.x, bp.pos.y);
          rotate(bp.heading);
          line(-this.r / 2, -this.r / 2, this.r / 2, this.r / 2);
          pop();
        }
        destroyFrames--;
      }
    } else {
      push();
      translate(this.pos.x, this.pos.y);
      rotate(this.heading);
      fill(0);
      stroke(255);
      triangle(-this.r, -this.r, -this.r, this.r, this.r, 0);
      if(this.accelMagnitude !== 0) {
        translate(-this.r, 0);
        rotate(random(PI / 4, 3 * PI / 4));
        line(0, 0, 0, 10);
      }

      pop();
    }
  }

  this.toString = function() { return "[object Ship]"; }
}

Ship.prototype = Object.create(Entity.prototype);
