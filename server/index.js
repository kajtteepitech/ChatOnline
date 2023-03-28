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

const cors = require('cors');
app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const fs = require('fs');
const MESSAGE_HISTORY_FILE = './messageHistory.json';

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

const ROOM_ID = 'common-room';

app.use(express.json());
app.use('/auth', authRoutes);

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

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

    socket.to(ROOM_ID).emit('chat message', msg);

    messageHistory.push(msg);
    try {
      fs.writeFileSync(MESSAGE_HISTORY_FILE, JSON.stringify(messageHistory));
      callback(true);
    } catch (err) {
      console.error(err);
      callback(false);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

http.listen(4242, () => {
  console.log('Server started on port 4242');
});