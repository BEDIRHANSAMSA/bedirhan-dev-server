module.exports = function waitForSocketConnection(socket, callback) {
  setTimeout(function () {
    if (socket.readyState === 1) {
      console.log("Connection is made");
      if (callback != null) {
        callback();
      }
    } else {
      console.log("wait for connection...");
      waitForSocketConnection(socket, callback);
    }
  }, 5); // wait 5 milisecond for the connection...
};
