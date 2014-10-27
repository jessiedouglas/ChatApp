;(function () {

  var ChatApp = window.ChatApp = window.ChatApp || {};

  ChatApp.startThings = function () {
    var socket = io();
    var newChat = new ChatApp.Chat(socket);


    var getMessage = function () {
      return $("textarea").val();
    }

    var postMessage = function (data) {
      var li = '<li><span>' + data.nickname + " says:</span> " + data.text;
      $("ul.messages").append(li);
      if (data.text === $('textarea').val()) {
        $('textarea').val('');
      }
    };

    $("form button").on("click", function (event) {
      event.preventDefault();
      var message = getMessage();
      if (message[0] === "/") {
        if (message.slice(1, 5) === "nick") {
          newChat.sendNicknameRequest(message.slice(6));
        } else {
          newChat.joinRoomRequest(message.slice(6));
        }
      } else {
        newChat.sendMessage(message);
      }
    });

    var setNickname = function (event) {
      var nameDisplay = '<h3> Chat nickname: ' + event.message;
      $(".name").prepend(nameDisplay);
    };

    $(".name").on("click", ".get-name-change", function (event) {
      var newNameInput = '<label>Nickname: <input type="text"></input></label>'
      $(".name").html(newNameInput);
      $(".name").append('<button class="name-change">Submit</button>');
    });

    $(".name").on("click", ".name-change", function (event) {
      var nickname = $(".name input").val();
      newChat.sendNicknameRequest(nickname);
    });

    var resetNickname = function (event) {
      if (event.success) {
        $(".name").html('<button class="get-name-change">Change nickname');
        setNickname(event);
        $("textarea").val('');
      } else {
        alert(event.message);
      }
    };

    var addUser = function (event) {
      if (newChat.allUsers.indexOf(event.name) === -1) {
        newChat.allUsers.push(event.name);
        $(".users").append("<li>" + event.name);
      }
    };

    var showAllUsers = function (event) {
      newChat.allUsers = event.allUsers;
      $(".users").empty();
      event.allUsers.forEach(function (user) {
        $(".users").append("<li>" + user);
      });
    };

    var joinRoom = function (event) {
      var room = event.room;
      $(".room > span").html(room);
      $(".messages").empty();
      $("#message").val('')
      updateRooms(event.allRooms);
    }

    var updateRooms = function (rooms) {
      $(".rooms").empty();
      rooms.forEach(function (room) {
        $(".rooms").append("<li>" + room);
      })
    };

    socket.on("nicknameNotification", setNickname);
    socket.on("message", postMessage);
    socket.on('nicknameChangeResult', resetNickname);
    socket.on("newUser", addUser);
    socket.on("allUsersNotification", showAllUsers);
    socket.on("joinRoomResponse", joinRoom);
  };

})();
