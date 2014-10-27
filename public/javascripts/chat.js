;(function () {
  var ChatApp = window.ChatApp = window.ChatApp || {};

  ChatApp.Chat = function (socket) {
    this.socket = socket;
    this.allUsers = [];
  };

  ChatApp.Chat.prototype.sendMessage = function (message) {
    this.socket.emit("message", { text: message });
  };

  ChatApp.Chat.prototype.sendNicknameRequest = function (nickname) {
    console.log("2")
    this.socket.emit("nicknameChangeRequest", { text: nickname });
  };

  // ChatApp.Chat.prototype.getMessage = function () {
//     return $("input").text();
//   }
//
//   ChatApp.Chat.prototype.postMessage = function () {
//     var li = '<li>' + message;
//     $("ul.messages").prepend(li);
//   };

})();