var input = {
  listeners: {},

  deregisterListener: function(id, index) {
    delete this.listeners[index][id];
  },

  registerListener: function(id, index, callback) {
    if (this.listeners[index] == undefined) {
      this.listeners[index] = {};
    }
    if (this.listeners[index][id] == undefined) {
      this.listeners[index][id] = [];
    }

    this.listeners[index][id].push(callback);
  },
  
  handleEvent: function(char, code, press) {
    if (this.listeners[code] != undefined) {
      for (var i in this.listeners[code]) {
        for (var j = 0; j < this.listeners[code][i].length; j++) {
          this.listeners[code][i][j](char, code, press);
        }
      }
    }
  }
};

function keyReleased() {
  input.handleEvent(key, keyCode, false);
}

function keyPressed() {
  input.handleEvent(key, keyCode, true);
}
