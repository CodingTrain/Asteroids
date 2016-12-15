// Daniel Shiffman
// http://codingrainbow.com
// http://patreon.com/codingrainbow
// Code for: https://youtu.be/hacZU523FyM

var ship;
var asteroids = [];
var lasers = [];
var laserSoundEffect;
var canPlay = true;

function preload() {
  laserSoundEffect = loadSound('audio/pew.mp3');
}
var score = 0;
var points = 5;
var level = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  ship = new Ship();
  spawnAsteroids();
}

function draw() {
  background(0);

  for(var i = 0; i < asteroids.length; i++) {
    if(ship.hits(asteroids[i]) && canPlay) {
      canPlay = false;
      ship.destroy();
      setTimeout(function() {
        ship = new Ship();
        canPlay = true;
      }, 3000);
    }
    asteroids[i].render();
    asteroids[i].update();
    asteroids[i].edges();
  }

  for(var i = lasers.length - 1; i >= 0; i--) {
    lasers[i].render();
    lasers[i].update();
    if(lasers[i].offscreen()) {
      lasers.splice(i, 1);
    } else {
      for(var j = asteroids.length - 1; j >= 0; j--) {
        if(lasers[i].hits(asteroids[j])) {
          if(asteroids[j].r > 10) {
            var newAsteroids = asteroids[j].breakup();
            asteroids = asteroids.concat(newAsteroids);
          }
          asteroids.splice(j, 1);
          lasers.splice(i, 1);
          score += points;
          if(asteroids.length == 0) {
          	level++;
          	spawnAsteroids()
          }
          break;
        }
      }
    }
  }

  ship.render();
  ship.turn();
  ship.update();
  ship.edges();

  textSize(25);
  fill(color(255));
  text(score, 10, 30);
}

function spawnAsteroids() {
  for (var i = 0; i < level + 5; i++) {
    asteroids.push(new Asteroid());
  }
}

function keyReleased() {
  if(keyCode === RIGHT_ARROW || keyCode === LEFT_ARROW)
    ship.setRotation(0);
  if(keyCode === UP_ARROW) {
    ship.boosting(false);
  }
}

function keyPressed() {
  if(!canPlay)
    return;
  if(key === " ") {
    var laser = new Laser(ship.pos, ship.heading);
    laser.playSoundEffect(laserSoundEffect);
    lasers.push(laser);
  }
  if(keyCode === RIGHT_ARROW) {
    ship.setRotation(0.075);
  }
  if(keyCode === LEFT_ARROW) {
    ship.setRotation(-0.075);
  }
  if(keyCode === UP_ARROW) {
    ship.boosting(true);
  }
}

function cross(v1, v2) {
  return v1.x * v2.y - v2.x * v1.y;
}

function lineIntersect(l1v1, l1v2, l2v1, l2v2) {
  var base = p5.Vector.sub(l1v1, l2v1);
  var l1_vector = p5.Vector.sub(l1v2, l1v1);
  var l2_vector = p5.Vector.sub(l2v2, l2v1);
  var direction_cross = cross(l2_vector, l1_vector);
  var t = cross(base, l1_vector) / direction_cross;
  var u = cross(base, l2_vector) / direction_cross;
  if(t >= 0 && t <= 1 && u >= 0 && u <= 1) {
    return true;
  } else {
    return false;
  }
}
