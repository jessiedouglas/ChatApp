;(function () {
  var ChatApp = window.ChatApp = window.ChatApp || {};

  ChatApp.Chat = function (socket) {
    this.socket = socket;
    this.room = null;
    this.allUsers = [];
  };

  ChatApp.Chat.prototype.sendMessage = function (message) {
    this.socket.emit("message", { text: message });
  };

  ChatApp.Chat.prototype.sendNicknameRequest = function (nickname) {
    this.socket.emit("nicknameChangeRequest", { text: nickname });
  };

  ChatApp.Chat.prototype.joinRoomRequest = function (room) {
    this.socket.emit("joinRoomRequest", { room: room });
  };
})();