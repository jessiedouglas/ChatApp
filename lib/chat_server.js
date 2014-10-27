// var io = require("socket.io")(server);
//
// io.on("connection", function (socket) {
//   socket.emit('some_event_name', { hello: "world"});
//   socket.on('some_other_event_name', function (data) {
//     console.log(data);
//   });
// });

var createChat = function (server) {
  var io = require("socket.io")(server);
  var guestnumber = 1;
  var nickname = {};

  io.on("connection", function (socket) {
    nickname[socket.id] = "Guest" + guestnumber;
    guestnumber++;

    var allUsers = function () {
      var allNicknames = [];
      for (var key in nickname) {
        allNicknames.push(nickname[key]);
      };

      return allNicknames;
    };

    socket.emit("allUsersNotification", { allUsers: allUsers() });
    socket.emit("nicknameNotification", { message: nickname[socket.id] });
    io.emit("newUser", { name: nickname[socket.id] })

    socket.on("message", function (data) {
      io.emit("message", {
        text: data.text,
        nickname: nickname[socket.id]
      });
    });

    socket.on("nicknameChangeRequest", function (data) {
      resetNickname(data.text);
    });

    socket.on("disconnect", function (event) {
      delete nickname[socket.id];
      io.emit("allUsersNotification", {
        allUsers: allUsers()
      });
    });

    var resetNickname = function (newName) {
      var firstFive = newName.slice(0, 5);
      if (firstFive.toLowerCase() === "guest") {
        socket.emit('nicknameChangeResult', {
          success: false,
          message: 'Names cannot begin with "Guest".'
        });
      } else if ( allUsers().indexOf(newName) !== -1 ) {
        socket.emit('nicknameChangeResult', {
          success: false,
          message: 'Name already in use.'
        });
      } else {
        nickname[socket.id] = newName;
        socket.emit('nicknameChangeResult', {
          success: true,
          message: newName
        });
        io.emit("allUsersNotification", {
          allUsers: allUsers()
        });
      }
    }
  });
};

module.exports = createChat;