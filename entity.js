function Entity(x, y, radius)
{
  this.pos = createVector(x, y);
  this.r = radius;
  this.heading = 0;
  this.rotation = 0;
  this.vel = createVector(0, 0);
  this.accelMagnitude = 0;
}

Entity.prototype.update = function() {
  this.heading += this.rotation;

  // Accelerate using the heading and the accelMagnitude
  var force = p5.Vector.fromAngle(this.heading);
  force.mult(this.accelMagnitude);
  this.vel.add(force);

  this.pos.add(this.vel);
  this.edges();
}

Entity.prototype.setAccel = function(magnitude)
{
  this.accelMagnitude = magnitude;
}

Entity.prototype.edges = function() {
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

Entity.prototype.setRotation = function(rot) {
  this.rotation = rot;
}
