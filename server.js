import WebSocket, { WebSocketServer } from 'ws';
import dotenv from "dotenv";
import express from 'express';
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;
const httpServer = app.listen(port,()=>console.log(`WebSocket server is running on ws://localhost:${port}`));

const wss = new WebSocketServer({ server: httpServer });

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
        console.log('Received: %s', data);
        const message = JSON.parse(data);

        // Broadcast the message to all clients except the sender
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message));
            }
        });
    });
});

