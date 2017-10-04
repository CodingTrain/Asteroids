// Daniel Shiffman
// http://codingrainbow.com
// http://patreon.com/codingrainbow
// Code for: https://youtu.be/hacZU523FyM

// Array of RGB color choices that will be selected randomly for the laser color
var colors = [
  [248, 12, 18],
  [238, 17, 0],
  [255, 51, 17],
  [255, 68, 34],
  [255, 102, 68],
  [255, 153, 51],
  [254, 174, 45],
  [204, 187, 51],
  [208, 195, 16],
  [170, 204, 34],
  [105, 208, 37],
  [34, 204, 170],
  [18, 189, 185],
  [17, 170, 187],
  [68, 68, 221],
  [51, 17, 187],
  [59, 12, 189],
  [68, 34, 153]
]

function Laser(spos, svel, angle) {
  // Create an instance of laser from its super class Entity. This is done
  // instead of creating its own seperate object type because there is a large
  // overlap in terms of properties.
  Entity.call(this, spos.x, spos.y, 4);

  this.pos = createVector(spos.x, spos.y);
  this.vel = p5.Vector.fromAngle(angle);
  this.vel.mult(10);
  this.vel.add(svel);
  this.color = colors[floor(random(0, colors.length - 1))];

  this.render = function() {
    push();
    stroke(this.color[0], this.color[1], this.color[2]);
    strokeWeight(this.r);
    point(this.pos.x, this.pos.y);
    pop();
  }

  this.playSoundEffect = function(sound) {
    if (!sound.isPlaying()) {
      sound.play();
    }
  }

  this.hits = function(asteroid) {
    // Evaluate if the asteroid was hit based on the range of the laser if one
    // of these conditions hold, then there is no need to check that the laser
    // intersected the asteroid.
    dist2 = (this.pos.x - asteroid.pos.x) * (this.pos.x - asteroid.pos.x)
          + (this.pos.y - asteroid.pos.y) * (this.pos.y - asteroid.pos.y);
    if (dist2 <= asteroid.rmin2) {
      return true;
    }
    if (dist2 >= asteroid.rmax2) {
      return false;
    }

    // Evaluate if the laser intersected the asteroid, hit detection is
    // evaluated based on hitting the line between adjacent vertices as these
    // are the edges that form the asteroid.
    var last_pos = p5.Vector.sub(this.pos, this.vel);
    var asteroid_vertices = asteroid.vertices();
    for (var i = 0; i < asteroid_vertices.length - 1; i++) {
      if (lineIntersect(last_pos,
                        this.pos,
                        asteroid_vertices[i],
                        asteroid_vertices[i + 1])) {
        return true;
      }
    }
    if (lineIntersect(last_pos,
                      this.pos,
                      asteroid_vertices[0],
                      asteroid_vertices[asteroid_vertices.length - 1])) {
      return true;
    }
    return false;
  }

  this.offscreen = function() {
    if (this.pos.x > width || this.pos.x < 0) {
      return true;
    }
    if (this.pos.y > height || this.pos.y < 0) {
      return true;
    }
    return false;
  }


}

Laser.prototype = Object.create(Entity.prototype);
