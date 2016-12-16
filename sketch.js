// Daniel Shiffman
// http://codingrainbow.com
// http://patreon.com/codingrainbow
// Code for: https://youtu.be/hacZU523FyM

var hud;
var entitymanager;
var laserSoundEffect;
var explosionSoundEffects = [];

function preload() {
  laserSoundEffect = loadSound('audio/pew.mp3');
  for (var i =0; i < 3; i++){
    explosionSoundEffects[i] = loadSound('audio/explosion-'+i+'.mp3');
  }
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  ship = new Ship();
  hud = new Hud();
  spawnAsteroids();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  entitymanager = new EntityManager();
  entitymanager.add(new Ship());
}

function draw() {
  // Update
  entitymanager.update();
  entitymanager.checkCollisions();
  levelmanager.check();

  // Render
  background(0);
  entitymanager.render();
  levelmanager.render();
  hud.render();
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
