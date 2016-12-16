// Daniel Shiffman
// http://codingrainbow.com
// http://patreon.com/codingrainbow
// Code for: https://youtu.be/hacZU523FyM

function Asteroid(pos, r, life) {
  if (pos === undefined) {
    pos = createVector(random(width), random(height))
  }

  if (life === undefined) {
    life = 1;
  }

  r = r !== undefined ? r : random(30, 60);
  Entity.call(this, pos.x, pos.y, r);

  this.life = life;
  this.vel = p5.Vector.random2D();
  this.total = floor(random(7, 15));

  //smaller asteroids go a bit faster
  switch(life) {
    case 0:
      this.vel.mult(2); break;
    case 1:
      this.vel.mult(1.5); break;
    default:
      this.vel.mult(1); break;
  }


  this.offset = [];
  for (var i = 0; i < this.total; i++) {
    this.offset[i] = random(-this.r * 0.75, 0);
  }

  Entity.prototype.setRotation.call(this, random(-0.03, 0.03));

  this.render = function() {
    push();
    stroke(255);
    noFill();
    translate(this.pos.x, this.pos.y);
    rotate(this.heading);
    beginShape();
    for (var i = 0; i < this.total; i++) {
      var angle = map(i, 0, this.total, 0, TWO_PI);
      var r = this.r + this.offset[i];
      vertex(r * cos(angle), r * sin(angle));
    }
    endShape(CLOSE);
    pop();
  }

  this.playSoundEffect = function(soundArray){
    soundArray[floor(random(0,soundArray.length))].play();
  }

  this.breakup = function() {
    if (this.life === 0) {
      return [];
    } else {
      return [new Asteroid(this.pos, this.r * 0.5, this.life - 1), new Asteroid(this.pos, this.r * 0.5, this.life - 1)];
    }
  }

  this.vertices = function() {
    var vertices = []
    for(var i = 0; i < this.total; i++) {
      var angle = this.heading + map(i, 0, this.total, 0, TWO_PI);
      var r = this.r + this.offset[i];
      vertices.push(p5.Vector.add(createVector(r * cos(angle), r * sin(angle)), this.pos));
    }

    return vertices;
  }

  this.verticesFromAngles = function(first_angle, second_angle) {
    var angle_difference = atan2(sin(second_angle-first_angle), cos(second_angle-first_angle));
    if(angle_difference < 0) return this.verticesFromAngles(second_angle, first_angle);
    var lowest_node = floor(map(first_angle - this.heading, -TWO_PI, TWO_PI, 0, 2*this.total));
    var highest_node = ceil(map(second_angle - this.heading, -TWO_PI, TWO_PI, 0, 2*this.total));
    if(highest_node < lowest_node) highest_node += this.total;

    var vertices = []
    for(var i = lowest_node; i <= highest_node; i++) {
      var angle = this.heading + map(i % this.total, 0, this.total, 0, TWO_PI);
      var r = this.r + this.offset[i % this.total];
      vertices.push(createVector(r * cos(angle), r * sin(angle)).add(this.pos));
    }

    return vertices;
  }

  // Asteroid only cares about lasers and they do the check.
  this.collides = function() {}

  this.collision = function(entity) {
    if (entity.toString() === "[object Laser]") {
      this.dead = true;
      var newAsteroids = this.breakup();
      for (var i = 0; i < newAsteroids.length; i++) {
        entitymanager.add(newAsteroids[i]);
      }
      levelmanager.scoreKill(newAsteroids.length);
    }
  }

  this.toString = function() { return "[object Asteroid]"; }
}

Asteroid.prototype = Object.create(Entity.prototype);
