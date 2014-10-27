;(function () {

  var ChatApp = window.ChatApp = window.ChatApp || {};

  ChatApp.startThings = function () {
    var socket = io();
    var newChat = new ChatApp.Chat(socket);


    var getMessage = function () {
      return $("textarea").val();
    }

    var postMessage = function (data) {
      var li = '<li>' + data.nickname + " says: " + data.text;
      $("ul.messages").append(li);
      $('textarea').val('');
    };

    $("form button").on("click", function (event) {
      event.preventDefault();
      var message = getMessage();
      if (message[0] === "/") {
        newChat.sendNicknameRequest(message.slice(6));
      } else {
        newChat.sendMessage(message);
      }
    });

    var setNickname = function (event) {
      var nameDisplay = '<h3> Chat nickname: ' + event.message;
      $(".name").prepend(nameDisplay);
    };

    $(".name").on("click", ".get-name-change", function (event) {
      console.log("0");
      var newNameInput = '<label>Nickname: <input type="text"></input></label>'
      $(".name").html(newNameInput);
      $(".name").append('<button class="name-change">Submit');
    });

    $(".name").on("click", ".name-change", function (event) {
      console.log("1");
      var nickname = $(".name input").val();
      newChat.sendNicknameRequest(nickname);
    });

    var resetNickname = function (event) {
      if (event.success) {
        $(".name").html('<button class="get-name-change"');
        setNickname(event);
        $("textarea").val('');
      } else {
        alert(event.message);
      }
    };

    var addUser = function (event) {
      console.log(newChat.allUsers);
      if (newChat.allUsers.indexOf(event.name) === -1) {
        newChat.allUsers.push(event.name);
        $(".users").append("<li>" + event.name);
      }
    };

    var showAllUsers = function (event) {
      console.log("hi");
      console.log(event.allUsers);
      newChat.allUsers = event.allUsers;
      $(".users").empty();
      event.allUsers.forEach(function (user) {
        console.log(user);
        $(".users").append("<li>" + user);
      });
    };

    socket.on("nicknameNotification", setNickname);
    socket.on("message", postMessage);
    socket.on('nicknameChangeResult', resetNickname);
    socket.on("newUser", addUser);
    socket.on("allUsersNotification", showAllUsers);
  };

})();
