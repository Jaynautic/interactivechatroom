const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

let clients = [];

server.on('connection', (socket) => {
  clients.push(socket);

  socket.on('message', (msg) => {
    for (let c of clients) {
      if (c !== socket && c.readyState === WebSocket.OPEN) {
        c.send(msg);
      }
    }
  });

  socket.on('close', () => {
    clients = clients.filter(c => c !== socket);
  });
});

console.log("Server running on ws://localhost:8080");