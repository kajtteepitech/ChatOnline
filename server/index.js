const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
  }
});

const fs = require('fs');
const MESSAGE_HISTORY_FILE = './messageHistory.json';

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

const ROOM_ID = 'common-room';

io.on('connection', (socket) => {
  console.log('A user connected');

  let messageHistory = [];
  try {
    const data = fs.readFileSync(MESSAGE_HISTORY_FILE, 'utf8');
    messageHistory = JSON.parse(data);
  } catch (err) {
    console.error(err);
  }
  socket.emit('message history', messageHistory);

  socket.on('join room', (roomId) => {
    socket.join(roomId);
  });

  socket.on('chat message', (msg, callback) => {
    console.log('message: ' + msg);

    // Broadcast the message to other clients
    socket.to(ROOM_ID).emit('chat message', msg);

    messageHistory.push(msg);
    try {
      fs.writeFileSync(MESSAGE_HISTORY_FILE, JSON.stringify(messageHistory));
      callback(true); // Send confirmation to the client
    } catch (err) {
      console.error(err);
      callback(false); // Send failure to the client
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

http.listen(4242, () => {
  console.log('Server started on port 4242');
});
