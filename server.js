const http = require("http");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const app = require("./app");
const { initMongoDB } = require("./libs/mongoDB/initMongoDB");
const { initSocketIO } = require("./libs/socketIO/initSocketIO");

const server = http.createServer(app);

const start = async function () {
  await initMongoDB();

  initSocketIO(server);

  server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT} 🚀🚀🚀`);
  });
};

start();

module.exports = server;
