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
  var currentRooms = {};

  var allUsers = function (userid) {
    var allRoomNicknames = [];
    var room = currentRooms[userid];
    for (var key in nickname) {
      if (currentRooms[key] === room) {
        allRoomNicknames.push(nickname[key]);
      }
    };

    return allRoomNicknames;
  };

  var emitRoomChange = function () {
    var usedRooms = [];

    for (var key in currentRooms) {
      if (usedRooms.indexOf(currentRooms[key]) === -1) {
        io.to(currentRooms[key]).emit("allUsersNotification", {
          allUsers: allUsers(key),
          allRooms: allRooms()
        });
        usedRooms.push(currentRooms[key]);
      }
    };
  };

  var allRooms = function () {
    var allRooms = [];

    for (var key in currentRooms) {
      if (allRooms.indexOf(currentRooms[key]) === -1) {
        allRooms.push(currentRooms[key]);
      }
    };

    return allRooms;
  };

  io.on("connection", function (socket) {
    nickname[socket.id] = "Guest" + guestnumber;
    guestnumber++;

    var joinRoom = function (room) {
      var prevRoom = currentRooms[socket.id];
      prevRoom && socket.leave(prevRoom);
      socket.join(room);
      currentRooms[socket.id] = room;
    };

    joinRoom("lobby");

    emitRoomChange();
    socket.emit("nicknameNotification", { message: nickname[socket.id] });
    io.to(currentRooms[socket.id]).emit("newUser", { name: nickname[socket.id] })

    socket.on("message", function (data) {
      io.to(currentRooms[socket.id]).emit("message", {
        text: data.text,
        nickname: nickname[socket.id]
      });
    });

    socket.on("nicknameChangeRequest", function (data) {
      resetNickname(data.text);
    });

    socket.on("disconnect", function (event) {
      delete nickname[socket.id];
      emitRoomChange();
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
        emitRoomChange();
      }
    };

    var handleRoomChangeRequests = function (event) {
      joinRoom(event.room);
      socket.emit("joinRoomResponse", { room: event.room })
      emitRoomChange();
    };

    socket.on("joinRoomRequest", handleRoomChangeRequests);
  });
};

module.exports = createChat;