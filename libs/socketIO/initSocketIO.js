const { Server } = require("socket.io");
const fetch = require("node-fetch");

exports.initSocketIO = function (server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  const tickIntervals = new Map();

  io.on("connection", (socket) => {
    //CONNECTING
    console.log(`User ${socket.id} connected`);

    socket.on("game-start", () => {
      let time = 0;
      const tickInterval = setInterval(() => {
        socket.emit("tick", time);
        time++;
      }, 1000);

      socket.on("game-over", async ({ equationId, answer, userId }) => {
        const res = await fetch(
          `http://localhost:3000/api/v1/equation/confirm/${equationId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              timeTaken: time > 1 ? time - 1 : time,
              answer,
              userId,
            }),
          }
        );

        const { data } = await res.json();

        socket.emit("get-score", data.score);
      });

      tickIntervals.set(socket, tickInterval);
    });

    //DISCONNECTING
    socket.on("disconnect", () => {
      console.log("called");

      clearInterval(tickIntervals.get(socket));
      tickIntervals.delete(socket);
    });
  });

  return io;
};
