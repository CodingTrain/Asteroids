function Hud(ship) {
  var asteroids = 0;
  var score = 0;
  var points = [100, 50, 20];
  var level = 0;

  var size = 20;
  var padding = 10;
  var lifeWidth = 20;

  /*
   --0--
   1   2
   --3--
   4   5
   --6--
  */
  var digitMaps = [
    //return a digit map
    [true, true, true, false, true, true, true], //0
    [false, false, true, false, false, true, false], //1
    [true, false, true, true, true, false, true], //2
    [true, false, true, true, false, true, true], //3
    [false, true, true, true, false, true, false], //4
    [true, true, false, true, false, true, true], //5
    [true, true, false, true, true, true, true], //6
    [true, false, true, false, false, true, false], //7
    [true, true, true, true, true, true, true], //8
    [true, true, true, true, false, true, true] //9

  ];

  this.gameover = false;

  this.scoreKill = function(newAsteroids, size) {
    asteroids += newAsteroids - 1;
    if (points[size] === undefined) {
      console.log("Points are not defined for this size of asteroid.");
    } else {
      score += points[size];
    }
  }

  this.check = function() {
    if (asteroids === 0) {
      asteroids = level + 5;
      for (var i = 0; i < asteroids; i++) {
        entitymanager.add(new Asteroid());
      }
      level++;
    }
  }

  this.render = function() {
    var scoreString = "" + score;
    var digitPos = createVector((width / 2 - (scoreString.length * (size + padding) - padding) / 2), padding);
    for(var i = 0; i < scoreString.length; i++) {
      var dmap = digitMaps[scoreString.charAt(i)];
      drawDigit(dmap, i, digitPos);
      digitPos.x += size + padding;
    }
    drawLives();
    if(ship.lives <= 0) {
      push();
      textSize(32);
      fill(255);
      text("GAME OVER", (width / 2) - 100, height / 2);
    }
  }

  function drawLives() {
    push();
    stroke(255);
    fill(0);
    var top = createVector((width / 2) + lifeWidth * ship.lives / 2, padding * 2 + size * 2);
    for(var i = 0; i < ship.lives; i++) {
      triangle(top.x, top.y, top.x - lifeWidth / 2, top.y + 25, top.x + lifeWidth / 2, top.y + 25);
      top.x -= 20 + padding;
    }
    pop();
  }

  //draws the digit based on the digit map
  function drawDigit(digitMap, index, pos) {
    push();
    stroke(255);
    for(var i = 0; i < digitMap.length; i++) {
      if(digitMap[i] === true)
        drawLine(i, pos);
    }
    pop();
  }

  //draws a line based on the line map
  function drawLine(lineMap, pos) {
    switch(lineMap) {
      case 0:
        line(pos.x, pos.y, pos.x + size, pos.y);
        break;
      case 1:
        line(pos.x, pos.y, pos.x, pos.y + size);
        break;
      case 2:
        line(pos.x + size, pos.y, pos.x + size, pos.y + size);
        break;
      case 3:
        line(pos.x, pos.y + size, pos.x + size, pos.y + size);
        break;
      case 4:
        line(pos.x, pos.y + size, pos.x, pos.y + 2 * size);
        break;
      case 5:
        line(pos.x + size, pos.y + size, pos.x + size, pos.y + 2 * size);
        break;
      case 6:
        line(pos.x, pos.y + size * 2, pos.x + size, pos.y + 2 * size);
        break;
      default:
        console.log("line map is invalid");
        break;
    }
  }
}
