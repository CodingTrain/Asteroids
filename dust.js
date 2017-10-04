// Daniel Shiffman
// http://codingrainbow.com
// http://patreon.com/codingrainbow
// Code for: https://youtu.be/hacZU523FyM

function Dust(pos, vel) {
  this.pos = pos.copy();
  this.vel = vel.copy();
  this.vel.add(p5.Vector.random2D().mult(random(0.5, 1.5)));
  this.transparency = random(200, 255);

  this.update = function() {
    this.pos.add(this.vel);
    this.transparency -= 2;
  }

  this.render = function() {
    if (this.transparency > 0) {
      stroke(this.transparency);
      point(this.pos.x, this.pos.y);
    }
  }
}

function addDust(pos, vel, n) {
  for (var i = 0; i < n; i++) {
    dust.push(new Dust(pos, vel));
  }
}
