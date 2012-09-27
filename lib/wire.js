var Wire = function Wire(fn) {
  var URL = URL || webkitURL;

  var Thread = function Thread(fn) {
    this.state = "dead";

    var stringToArrayBuffer = function(string) {
      var normalizedString = unescape(encodeURIComponent(string));
      var buffer = new ArrayBuffer(string.length);
      var bufferView = new Uint8Array(buffer);

      for(var i = 0; i < string.length; i++) {
        bufferView[i] = normalizedString.charCodeAt(i);
      }
      return bufferView;
    };

    var buffer = stringToArrayBuffer("(" + fn.toString() + ")();");
    var blob = new Blob([buffer], { type: "text/javascript" });
    var workerURL = URL.createObjectURL(blob);

    this.currentThread = new Worker(workerURL);
    this.state = "alive";

    Wire.threads.push(this);
  };

  Thread.prototype = {
    constructor: Thread,
    onmessage: function(fn) { this.currentThread.onmessage = fn; },
    onerror: function(fn) { this.currentThread.onerror = fn; },
    postMessage: function(message) { this.currentThread.postMessage(message); },
    terminate: function() { this.currentThread.terminate(); }
  };

  if(fn) return new Thread(fn);
};

Wire.threads = [];
