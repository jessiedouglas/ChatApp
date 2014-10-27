;(function () {

  var ChatApp = window.ChatApp = window.ChatApp || {};

  ChatApp.startThings = function () {
    var socket = io();
    var newChat = new ChatApp.Chat(socket);


    var getMessage = function () {
      return $("textarea").val();
    }

    var postMessage = function (data) {
      var li = '<li>' + data.text;
      $("ul.messages").append(li);
      $('textarea').val('');
    };

    $("form button").on("click", function (event) {
      event.preventDefault();
      var message = getMessage();
      newChat.sendMessage(message);

    });

    socket.on("message", postMessage);
  };

})();
