// Daniel Shiffman
// http://codingrainbow.com
// http://patreon.com/codingrainbow
// Code for: https://youtu.be/hacZU523FyM

function Ufo(speed_range, freq_range) {
  
  // Set speed and range
  var speed = random(0.5, speed_range);
  var freq = random(freq_range, freq_range * 2);
  
  // Choose a random starting side and appropriate velocity
  this.pos = createVector(-50, random(0, height));
  if (random() > 0.5) {
    this.vel = createVector(speed, random(-2 * speed, 2 * speed));
  } else {
    this.pos.x = width + 50;
    this.vel = createVector(-speed, random(-2 * speed, 2 * speed));
  }
  
  this.counter = 0;
  
  this.render = function() {
    image(ufo, this.pos.x, this.pos.y, 100, 100);
  }
  
  this.update = function() {
    this.pos.add(this.vel);
    this.counter += 1;
    if (this.counter >= freq) {
      seekers.push(new Seeker(this.pos, ship.pos, 3 * speed));
      this.counter = 0;
    }
    
    // Check edges
    if (this.pos.y < -50) {
      this.pos.y = height + 50;
    }
    if (this.pos.y > height + 50) {
      this.pos.y = -50;
    }
    
    // Once in a while, change direction
    if (random() < 0.005 * speed) {
      this.vel.y = random(-2 * speed, 2 * speed);
    }
  }
}