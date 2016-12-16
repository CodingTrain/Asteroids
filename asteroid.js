// Daniel Shiffman
// http://codingrainbow.com
// http://patreon.com/codingrainbow
// Code for: https://youtu.be/hacZU523FyM

function Asteroid(pos, r) {
  if (pos === undefined) {
    pos = createVector(random(width), random(height))
  }

  r = r !== undefined ? r * 0.5 : random(15, 30);
  Entity.call(this, pos.x, pos.y, r);

  this.vel = p5.Vector.random2D();
  this.total = floor(random(5, 15));
  this.offset = [];
  for (var i = 0; i < this.total; i++) {
    this.offset[i] = random(-this.r * 0.5, this.r * 0.5);
  }

  Entity.prototype.setRotation.call(this, random(-0.05, 0.05));

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
    return [new Asteroid(this.pos, this.r), new Asteroid(this.pos, this.r)];
  }

  this.vertices = function() {
    var vertices = []
    for(var i = 0; i < this.total; i++) {
      var angle = map(i, 0, this.total, 0, TWO_PI);
      var r = this.r + this.offset[i];
      vertices.push(p5.Vector.add(createVector(r * cos(angle), r * sin(angle)), this.pos));
    }

    return vertices;
  }

  this.verticesFromAngles = function(first_angle, second_angle) {
    var angle_difference = atan2(sin(second_angle-first_angle), cos(second_angle-first_angle));
    if(angle_difference < 0) return this.verticesFromAngles(second_angle, first_angle);
    var lowest_node = floor(map(first_angle, -TWO_PI, TWO_PI, 0, 2*this.total));
    var highest_node = ceil(map(second_angle, -TWO_PI, TWO_PI, 0, 2*this.total));
    if(highest_node < lowest_node) highest_node += this.total;

    var vertices = []
    for(var i = lowest_node; i <= highest_node; i++) {
      var angle = map(i % this.total, 0, this.total, 0, TWO_PI);
      var r = this.r + this.offset[i % this.total];
      vertices.push(createVector(r * cos(angle), r * sin(angle)).add(this.pos));
    }

    return vertices;
  }
}

Asteroid.prototype = Object.create(Entity.prototype);
