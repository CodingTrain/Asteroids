var colors = [[248, 12, 18], [238, 17, 0], [255, 51, 17], [255, 68, 34], [255, 102, 68], [255, 153, 51], [254, 174, 45], [204, 187, 51], [208, 195, 16], [170, 204, 34], [105, 208, 37], [34, 204, 170], [18, 189, 185], [17, 170, 187], [68, 68, 221], [51, 17, 187], [59, 12, 189], [68, 34, 153]]

function Laser(spos, angle) {
  this.pos = createVector(spos.x, spos.y);
  this.vel = p5.Vector.fromAngle(angle);
  this.vel.mult(10);
  this.color = colors[floor(random(0,colors.length-1))];

  this.update = function() {
    this.pos.add(this.vel);
  }
  this.render = function() {
    push();
    stroke(this.color[0], this.color[1], this.color[2]);
    strokeWeight(4);
    point(this.pos.x, this.pos.y);
    pop();
  }

  this.hits = function(asteroid) {
    var d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
    if (d < asteroid.r) {
      return true;
    } else {
      return false;
    }
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
