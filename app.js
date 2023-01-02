const http = require('http');
const sockjs = require('sockjs');
const express = require('express');

const wss = sockjs.createServer();
const clients = [];

port = 3000;

wss.on('connection', (ws) => {
    console.log("connected");

     const id = clients.push(ws) - 1;
     console.log("client " + id);

    ws.on('data', (msg) => {
    //   const message = JSON.parse(messageAsString);
    //   const metadata = clients.get(ws);

    //   message.sender = metadata.id;
    //   message.color = metadata.color;

    //   const outbound = JSON.stringify(message);

    //   [...clients.keys()].forEach((client) => {
    //     client.write(outbound);
    //   });
        
        console.log(msg);
        clients.forEach(client => {
            client.write(msg);
        })
    });

    ws.on("close", () => {
        console.log("client " + id + "left");
        clients.splice(id,1);
    });
});

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
const app = express();

const server = http.createServer(app);

wss.installHandlers(server, {prefix: '/ws'});
// server.listen(7071, '0.0.0.0');

console.log("wss up");

server.listen(process.env.PORT || port, () => {
    console.log(`we live at port ${process.env.PORT || port}`);
});

// const express = require('express');
// const app = express();
// app.use(express.urlencoded({extended: true}))
// app.use(express.json())
// const http = require('http');
// const server = http.createServer(app);
// var WebSocketServer = require('websocket').server;

// const port = 3000;
// var clients = [];

// server.listen(process.env.PORT || port, () => {
//     console.log(`we live at port ${process.env.PORT || port}`);
// });

// wsServer = new WebSocketServer({
//   httpServer: server,
// });

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// wsServer.on('request', (request) => {
//   var connection = request.accept(null, request.origin);
//   let index = clients.push(connection) - 1;
//   console.log(index + " connected");

//   connection.on('message', (message) => {
//     if (message.type === 'utf8') {
//       console.log(index + " send " + message.utf8Data);
//       clients.forEach(client => {
//         client.sendUTF(message.utf8Data);
//       });
//     }
//   });

//   connection.on('close', (connection) => {
//     console.log(index + " disconnected")
//     clients.splice(index, 1);
//   });
// });