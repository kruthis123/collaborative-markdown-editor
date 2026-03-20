const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: process.env.WEBSOCKET_PORT || 8000 });

wss.on('connection', (ws) => {
  console.log('Client connected');
  
  ws.on('message', (message) => {
    console.log('Received:', message.toString());
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server running on ws://localhost:' + (process.env.WEBSOCKET_PORT || 8000));