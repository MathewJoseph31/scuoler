const { glob } = require("fs");
const path = require("path");
/*Export method that accepts an http server instance as param and performs the necessary
socket io initialization and message handling definitions*/
exports.handleSocketIO = function (server) {
  var io;
  if (process.env.NODE_ENV === "production") {
    io = require("socket.io")(server, {
      cors: {
        origin: "*",
      },
    });
  } else {
    io = require("socket.io")(server, {
      cors: {
        origin: "*",
      },
    });
  }
  global.peerSocketMap = {};

  /*const io = require("socket.io")({
    transports: ["websocket", "flashsocket", "polling", "xhr-polling"],
    allowEIO3: true, // false by default
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type"],
      credentials: true,
    },
    "polling duration": 10
  });
  io.listen(server);*/

  io.on("connection", (socket) => {
    socket.on("disconnect", () => {
      let roomId = socket?.handshake?.headers?.referer
        ? path.basename(socket.handshake.headers.referer)
        : "errRoom";
      //console.log("disconnect from room: ", socket.handshake.headers.referer);
      console.log("disconnect from room: ", socket.id);
      delete global.peerSocketMap[socket?.id];
    });
    /*socket.on("message", (chatMsg) => {
      console.log("new chat msg", chatMsg);
    });*/

    socket.on("join-room", (roomId, userId, userName) => {
      console.log(
        `user (id: ${userId}, name: ${userName}) joined the room`,
        roomId
      );
      socket.join(roomId);
      global.peerSocketMap[socket.id] = userId;
      //socket.broadcast.emit("joined-room", userId);

      socket.on("stream-close", (userId) => {
        console.log(`peer ${userId} exited`);
      });

      socket.on("message-chat", (chatMsg) => {
        console.log("new chat msg", chatMsg);
        io.to(roomId).emit("create-message", chatMsg);
      });

      socket.on("disconnect", () => {
        console.log("socket disconnect", userId);
        socket.to(roomId).emit("user-disconnected", userId);
      });

      socket.on("introduce-client", (toPeerId, fromPeerId, fromPeerName) => {
        console.log("introduce-client", toPeerId, fromPeerId, fromPeerName);
        for (let [key, value] of Object.entries(global.peerSocketMap)) {
          if (value === toPeerId) {
            io.sockets.sockets
              .get(key)
              .emit("user-introduce", fromPeerId, fromPeerName);
          }
        }
      });

      socket.to(roomId).emit("joined-room", userId, userName);
    });

    socket.on("join-room-stream", (roomId, userId, userName, streamer) => {
      console.log(
        `user (id: ${userId}, name: ${userName})  joined the room stream`,
        roomId,
        streamer
      );
      socket.join(roomId);
      global.peerSocketMap[socket.id] = userId;
      //socket.broadcast.emit("joined-room", userId);

      socket.on("message-stream", (chatMsg) => {
        console.log("new chat msg", chatMsg);
        io.to(roomId).emit("createMessage-stream", chatMsg);
      });

      socket.on("disconnect", () => {
        console.log("socket disconnect", userId);
        socket.to(roomId).emit("user-disconnected-stream", userId);
      });

      socket.on("request-stream", (streamerId, viewerId, viewerName) => {
        console.log("stream requested", streamerId, viewerId, viewerName);
        socket.to(roomId).emit("joined-room-live", viewerId, viewerName);
      });

      socket.on(
        "introduce-client-stream",
        (toPeerId, fromPeerId, fromPeerName) => {
          console.log("introduce-client", toPeerId, fromPeerId, fromPeerName);
          for (let [key, value] of Object.entries(global.peerSocketMap)) {
            if (value === toPeerId) {
              io.sockets.sockets
                .get(key)
                .emit("user-introduce", fromPeerId, fromPeerName);
            }
          }
        }
      );

      if (streamer) {
        socket.to(roomId).emit("joined-room-stream", userId, userName);
      } else {
        socket.to(roomId).emit("joined-room-live", userId, userName);
      }
    });
  });
};
