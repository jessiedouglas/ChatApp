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
    socket.on("message", function (data) {
      io.emit("message", { text: data.text });
    });
    socket.on("nicknameChangeRequest", function (data) {
      if (regexp:test(data.text, /^Guest||^guest/)) {
        socket.emit('nicknameChangeResult', {
          success: false,
          message: 'Names cannot begin with "Guest".'
        });
      } else if ( nickname.keys().indexOf(data.text) !== -1 ) {
        socket.emit('nicknameChangeResult', {
          success: false,
          message: 'Name already in use.'
        });
      }
    });
  });
};

module.exports = createChat;