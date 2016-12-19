// Daniel Shiffman
// http://codingrainbow.com
// http://patreon.com/codingrainbow
// Code for: https://youtu.be/hacZU523FyM

function Seeker(pos, target, speed) {
  Entity.call(this, pos.x, pos.y, 10);
  
  // Set velocity
  this.vel = p5.Vector.sub(target, pos);
  this.vel.normalize();
  this.vel.mult(speed);
  
  this.blink = 1;
  this.d_blink = 1;
  
  this.render = function() {
    push();
    c = map(this.blink, 1, 10, 255, 0);
    stroke(c, 255, c);
    strokeWeight(this.blink);
    point(this.pos.x, this.pos.y);
    pop();
  }
  
  this.update = function() {
    this.pos.add(this.vel)
    this.blink += this.d_blink;
    if (this.blink == 1 | this.blink == 10) {
      this.d_blink *= -1;
    }
  }
}