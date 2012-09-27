var Wire = function Wire(fn) {
  var URL = URL || webkitURL;

  var Thread = function Thread(fn) {
    var stringToArrayBuffer = function(string) {
      var string = unescape(encodeURIComponent(string));
      var buffer = new ArrayBuffer(string.length);
      var bufferView = new Uint8Array(buffer);

      for(var i = 0; i < string.length; i++) {
        bufferView[i] = string.charCodeAt(i);
      }
      return bufferView;
    };

    var buffer = stringToArrayBuffer("(" + fn.toString() + ")();");
    var blob = new Blob([buffer], { type: "text/javascript" });
    var workerURL = URL.createObjectURL(blob);

    this.currentThread = new Worker(workerURL);

    Wire.threads.push(this.currentThread);
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
