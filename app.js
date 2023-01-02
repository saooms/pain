const express = require('express');
const app = express();
app.use(express.urlencoded({extended: true}))
app.use(express.json())
const http = require('http');
const server = http.createServer(app);
var WebSocketServer = require('websocket').server;

const port = 3000;
var clients = [];

server.listen(process.env.PORT || port, () => {
    console.log(`we live at port ${process.env.PORT || port}`);
});

wsServer = new WebSocketServer({
  httpServer: server
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

wsServer.on('request', (request) => {
  var connection = request.accept(null, request.origin);
  let index = clients.push(connection) - 1;
  console.log(index + " connected");

  connection.on('message', (message) => {
    if (message.type === 'utf8') {
      console.log(index + " send " + message.utf8Data);
      clients.forEach(client => {
        client.sendUTF(message.utf8Data);
      });
    }
  });

  connection.on('close', (connection) => {
    console.log(index + " disconnected")
    clients.splice(index, 1);
  });
});