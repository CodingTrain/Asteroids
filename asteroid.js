function Asteroid(pos, r) {
  if (pos) {
    this.pos = pos.copy();
  } else {
    this.pos = createVector(random(width), random(height))
  }
  if (r) {
    this.r = r * 0.5;
  } else {
    this.r = random(15, 50);
  }


  this.vel = p5.Vector.random2D();
  this.total = floor(random(5, 15));
  this.offset = [];
  for (var i = 0; i < this.total; i++) {
    this.offset[i] = random(-this.r * 0.5, this.r * 0.5);
  }

  this.update = function() {
    this.pos.add(this.vel);
  }

  this.render = function() {
    push();
    stroke(255);
    noFill();
    translate(this.pos.x, this.pos.y);
    //ellipse(0, 0, this.r * 2);
    beginShape();
    for (var i = 0; i < this.total; i++) {
      var angle = map(i, 0, this.total, 0, TWO_PI);
      var r = this.r + this.offset[i];
      var x = r * cos(angle);
      var y = r * sin(angle);
      vertex(x, y);
    }
    endShape(CLOSE);
    pop();
  }

  this.breakup = function() {
    var newA = [];
    newA[0] = new Asteroid(this.pos, this.r);
    newA[1] = new Asteroid(this.pos, this.r);
    return newA;
  }

  this.edges = function() {
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

  this.vertices = function() {
    var vertices = []
    for(var i = 0; i < this.total; i++) {
      var angle = map(i, 0, this.total, 0, TWO_PI);
      var r = this.r + this.offset[i];
      var x = r * cos(angle);
      var y = r * sin(angle);
      vertices.push(createVector(x, y).add(this.pos));
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
      var x = r * cos(angle);
      var y = r * sin(angle);
      vertices.push(createVector(x, y).add(this.pos));
    }

    return vertices;
  }

}
