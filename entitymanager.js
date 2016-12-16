function EntityManager() {
  var entities = {};
  var nextId = 0;

  this.add = function(entity) {
    entity.id = nextId;
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
    for (var i in entities) {
      for (var j in entities) {
        if (i !== j && entities[j].collides(entities[i])) {
          entities[i].collision(entities[j]);
          entities[j].collision(entities[i]);
        }
      }
    }
  }
}