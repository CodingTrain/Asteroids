// Daniel Shiffman
// http://codingrainbow.com
// http://patreon.com/codingrainbow
// Code for: https://youtu.be/hacZU523FyM

var ship;
var hud;
var asteroids = [];
var lasers = [];
var laserSoundEffect;
var explosionSoundEffects = [];
var canPlay = true;
var shieldTime = 180;

function preload() {
  laserSoundEffect = loadSound('audio/pew.mp3');
  for (var i =0; i < 3; i++){
    explosionSoundEffects[i] = loadSound('audio/explosion-'+i+'.mp3');
  }
}
var score = 0;
var lives = 3;
var points = [100, 50, 20]; // small, med, large points
var level = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  ship = new Ship();
  hud = new Hud();
  spawnAsteroids();
}

function draw() {
  for(var i = 0; i < asteroids.length; i++) {
    if(ship.hits(asteroids[i]) && canPlay) {
      canPlay = false;
      ship.destroy();
      input.reset();
      setTimeout(function() {
        lives--;
        if(lives >= 0) {
          ship = new Ship();
          canPlay = true;
        }
      }, 3000);
    }
    asteroids[i].update();
  }

  for(var i = lasers.length - 1; i >= 0; i--) {
    lasers[i].update();
    if(lasers[i].offscreen()) {
      lasers.splice(i, 1);

      continue;
    }

    for (var j = asteroids.length - 1; j >= 0; j--) {
      if (lasers[i].hits(asteroids[j])) {
        asteroids[j].playSoundEffect(explosionSoundEffects);
        score += points[asteroids[j].size];
        var newAsteroids = asteroids[j].breakup();
        asteroids = asteroids.concat(newAsteroids);
        asteroids.splice(j, 1);
        lasers.splice(i, 1);
        if(asteroids.length == 0) {
          level++;
          spawnAsteroids();
          ship.shields = shieldTime;
        }
        break;
      }
    }
  }

  ship.update();

  // Render
  background(0);

  for (var i = 0; i < asteroids.length; i++) {
    asteroids[i].render();
  }

  for (var i = lasers.length - 1; i >= 0; i--) {
    lasers[i].render();
  }

  ship.render();
  hud.render();
}

function spawnAsteroids() {
  for(var i = 0; i < level + 5; i++) {
    asteroids.push(new Asteroid(null, null, 2));
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