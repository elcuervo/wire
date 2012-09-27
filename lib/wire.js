var Wire = function Wire() {
  var URL = URL || webkitURL;

  var Thread = function Thread(vars) {
    var args = Array.prototype.slice.call(vars);

    if(typeof args[0] === "function") {
      var fn = args[0];
      this.name = null;
    } else if(typeof args[0] === "string" && typeof args[1] === "function") {
      var fn = args[1];
      this.name = args[0];
    } else {
      console.error(arguments);
      console.error(args);
    }

    this.name
    this.state = "dead";

    var wrapper = "(" + fn.toString() + ")();";
    var blob = new Blob([wrapper], { type: "text/javascript" });
    var workerURL = URL.createObjectURL(blob);

    this.currentThread = new Worker(workerURL);
    this.state = "alive";

    Wire.threads.push(this);

    this.wrap = function(fn, context) { return fn.apply(context); };
  };

  Thread.prototype = {
    constructor: Thread,

    onmessage: function(fn) {
      this.currentThread.onmessage = this.wrap(fn, this)
    },

    onerror: function(fn) {
      this.currentThread.onerror = this.wrap(fn, this);
    },

    postMessage: function(message) { this.currentThread.postMessage(message); },
    terminate: function() { this.currentThread.terminate(); }
  };

  if(arguments.length > 0) return new Thread(arguments);
};

Wire.threads = [];
