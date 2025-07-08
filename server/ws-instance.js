// web socket server instance
import WebSocket, { WebSocketServer } from 'ws';
import {httpServer} from './server.js';

const wss = new WebSocketServer({ server: httpServer });

const rooms ={};

wss.on('connection', function connection(ws) {
    ws.on('error', console.error);
    ws.on('message', function message(data) {
          // console.log('Received: %s', data);
          const message = JSON.parse(data);
          console.log(message);

          switch (message.type) {
            case 'join-room':
                console.log(`joining room ${message.roomid}`);
                if(message.roomid in rooms) rooms[message.roomid].push(ws);
                else rooms[message.roomid]=[ws];
                break;
                
            default:
                console.log(`Broadcasting message in the room`);
                rooms[message.roomid].forEach((client)=>{
                    if(client!=ws && client.readyState===WebSocket.OPEN){
                        client.send(JSON.stringify(message));
                    }
                });
                break;
          }
  
        // Broadcast the message to all clients except the sender
        //   wss.clients.forEach(function each(client) {
        //       if (client !== ws && client.readyState === WebSocket.OPEN) {
        //           client.send(JSON.stringify(message));
        //       }
        //   });
      });

    ws.send(JSON.stringify({type:'chat',text:'Welcome to Duoflix, Chat with everyone present in the room'}));
  });

export {wss};