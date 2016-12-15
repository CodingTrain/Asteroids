var ship;
var asteroids = [];
var lasers = [];
var hud;
var score = 0;
var asteroidPoints = [100, 50, 20]; //points for small med and large asteroids
var lives = 3;
var canplay = true;

function setup() {
    createCanvas(windowWidth, windowHeight);
    ship = new Ship();
    hud = new Hud();
    for (var i = 0; i < 5; i++) {
        asteroids.push(new Asteroid(null, null, 2));
    }
}

function draw() {
    background(0);

    for (var i = 0; i < asteroids.length; i++) {
        if (ship.hits(asteroids[i]) && canplay) {
            canplay = false;
            ship.destroy();
            setTimeout(function () {
                lives--;
                if (lives < 0) {
                    ship = new Ship();
                    canplay = true;
                }
            }, 3000);

        }
        asteroids[i].render();
        asteroids[i].update();
        asteroids[i].edges();
    }

    for (var i = lasers.length - 1; i >= 0; i--) {
        lasers[i].render();
        lasers[i].update();
        if (lasers[i].offscreen()) {
            lasers.splice(i, 1);
        } else {
            for (var j = asteroids.length - 1; j >= 0; j--) {
                if (lasers[i].hits(asteroids[j])) {
                    var points = asteroidPoints[asteroids[j].size];
                    var newAsteroids = asteroids[j].breakup();
                    asteroids = asteroids.concat(newAsteroids);
                    score += points;
                    asteroids.splice(j, 1);
                    lasers.splice(i, 1);
                    break;
                }
            }
        }
    }

    ship.render();
    ship.turn();
    ship.update();
    ship.edges();
    hud.render();

}

function keyReleased() {
    if (keyCode === RIGHT_ARROW || keyCode === LEFT_ARROW)
        ship.setRotation(0);
    if (keyCode === UP_ARROW) {
        ship.boosting(false);
    }
}

function keyPressed() {
    if (canplay) {
        if (key === " ")
            lasers.push(new Laser(ship.pos, ship.heading));
        if (keyCode === RIGHT_ARROW)
            ship.setRotation(0.075);
        if (keyCode === LEFT_ARROW)
            ship.setRotation(-0.075);
        if (keyCode === UP_ARROW)
            ship.boosting(true);
    }
}

