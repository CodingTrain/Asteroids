// Daniel Shiffman
// http://codingrainbow.com
// http://patreon.com/codingrainbow
// Code for: https://youtu.be/hacZU523FyM

var ship;
var hud;
var asteroids = [];
var lasers = [];
var laserSoundEffects = [];
var dust = [];
var explosionSoundEffects = [];
var canPlay = true;
var shieldTime = 180;

function preload() {
  // Laser and Explosion Sound Effects are loaded here as opposed to the laser
  // or asteroid files because the asteroid destruction logic is here and it
  // also reduces redundancy of each asteroid or laser containing sound data.
  for (var i =0; i < 3; i++){
    laserSoundEffects[i] = loadSound('audio/pew-'+i+'.mp3');
  }
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
  // Handles the round loss, destruction of ship and round restart when the
  // ship contacts an asteroid.
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

  // Update the lasers' positions
  for(var i = lasers.length - 1; i >= 0; i--) {
    lasers[i].update();
    if(lasers[i].offscreen()) {
      // Destroy lasers that go off screen.
      lasers.splice(i, 1);

      continue;
    }

    for (var j = asteroids.length - 1; j >= 0; j--) {
      if (lasers[i].hits(asteroids[j])) {
        // Handle laser contact with asteroids - handles graphics and sounds -
        // including asteroids that result from being hit.
        asteroids[j].playSoundEffect(explosionSoundEffects);
        score += points[asteroids[j].size];
        var dustVel = p5.Vector.add(lasers[i].vel.mult(0.2), asteroids[j].vel);
        var dustNum = (asteroids[j].size + 1) * 5;
        addDust(asteroids[j].pos, dustVel, dustNum);
        // The new smaller asteroids broken lasers are added to the same list
        // of asteroids, so they can be referenced the same way as their full
        // asteroid counterparts.
        var newAsteroids = asteroids[j].breakup();
        asteroids = asteroids.concat(newAsteroids);
        // Laser and previous asteroid are removed as per the rules of the game.
        asteroids.splice(j, 1);
        lasers.splice(i, 1);
        if(asteroids.length == 0) {
          // Next level
          level++;
          spawnAsteroids();
          ship.shields = shieldTime;
        }
        break;
      }
    }
  }

  ship.update();

  for (var i = dust.length - 1; i >= 0; i--) {
    dust[i].update();
    if (dust[i].transparency <= 0) {
      dust.splice(i, 1);
    }
  }

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

  for (var i = dust.length - 1; i >= 0; i--) {
    dust[i].render();
  }
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
