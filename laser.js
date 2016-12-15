function Laser(spos, angle) {
  this.pos = createVector(spos.x, spos.y);
  this.vel = p5.Vector.fromAngle(angle);
  this.vel.mult(10);

  this.update = function() {
    this.pos.add(this.vel);
  }
  this.render = function() {
    push();
    stroke(255);
    strokeWeight(4);
    point(this.pos.x, this.pos.y);
    pop();
  }

  this.hits = function(asteroid) {
    var last_pos = p5.Vector.sub(this.pos, this.vel);
    var last_angle = p5.Vector.sub(last_pos, asteroid.pos).heading();
    var new_angle = p5.Vector.sub(this.pos, asteroid.pos).heading();
    var asteroid_vertices = asteroid.verticesFromAngles(last_angle, new_angle);
    for(var i = 0; i < asteroid_vertices.length - 1; i++) {
      if(lineIntersect(last_pos, this.pos, asteroid_vertices[i], asteroid_vertices[i + 1])) {
        return true;
      }
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
