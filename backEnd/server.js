const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const server = http.createServer(app);
const Events = require("../src/Events");

app.use(express.static("build"));

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, '../build','index.html'));
});

const io = new Server(server);

const userSocketMap = {};

function getAllClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
}

io.on("connection", (socket) => {
  console.log(`socket connected and id is ${socket.id}`);

  socket.on(Events.Join, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const client = getAllClients(roomId);
    client.forEach(({ socketId }) => {
      io.to(socketId).emit(Events.Joined, {
        client,
        username: username,
        socketId: socket.id,
      });
    });
  });

  // sharing code here...

  socket.on(Events.Code_Change, ({ roomId, code }) => {
    console.log(code);
    socket.in(roomId).emit(Events.Code_Change, { code });
  });

  socket.on(Events.Sync_Code, (code, sockeId) => {
    io.to(sockeId).emit(Events.Sync_Code, { code });
  });

  // disconntecting here...

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(Events.Disconnected, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
    socket.leave();
    console.log(userSocketMap[socket.id]);
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
