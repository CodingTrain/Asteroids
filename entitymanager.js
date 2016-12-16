function EntityManager() {
  var entities = {};
  var nextId = 0;

  this.add = function(entity) {
    entity.registerId(nextId);
    entities[nextId++] = entity;
  }

  this.update = function() {
    for (var index in entities) {
      if (entities[index].update()) {
        // Deletes the index property from the entities object.
        delete entities[index];
      }
    }
  }

  this.render = function() {
    for (var index in entities) {
      entities[index].render();
    }
  }

  this.checkCollisions = function() {
    var x = 1;
    for (var i in entities) {
      var y = x;
      for (var j in entities) {
        // Skip all the collisions we have already done.
        if (y !== 0) {
          y--;
          continue;
        }

        if (entities[j].collides(entities[i]) || entities[i].collides(entities[j])) {
          entities[i].collision(entities[j]);
          entities[j].collision(entities[i]);
        }
      }
      x++;
    }
  }
}