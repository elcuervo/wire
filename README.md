# Wire

![Wire](http://www.chainlinkmesh.com/blog/upload/201202082105164812.jpg)

Wire is a little experiment allowing inline workers using Blobs to simulate the
thread experience.

## Examples

```javascript
  // Start a new thread
  new Wire(function() {
    while(true) {
      // Complex operation
    }
  });


  // Comunicate
  var thread = new Wire(function() {
    onmessage = function(message) {
      postMessage("You said: " + message.data);
    };
  });

  thread.onmessage(function(message) {
    console.log("thread said: " + message.data);
  });

  // Name a thread
  var thread = new Wire("my_thread", function() {
    while(true) {
      // Complex operation
    }
  });

  thread.onmessage(function(message) {
    console.log(this.name + " said: " + message.data);
  });

  // Access all the created threads
  for(var i = 0; i < 50; i++) {
    new Wire(function() {
      while(true) {
        // Complex operation
      }
    });
  };

  Wire.threads.length
  // 50
```
