const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const bodyParser = require('body-parser');
const session = require("express-session");
const cors = require("cors");

const { initRoomService } = require('./services/room');
const { initChatService } = require('./services/chat');
const { initPlaylistService, initPlayerService } = require('./services/player');
const { initUserService } = require('./services/user');

const app = express();
// set up security
app.use(cors({
  origin: "http://localhost:3000",
  methods: [ "GET", "POST" ],
  credentials: true,
}));
app.use(
  session({
    secret: "secret",
    resave: false,
    cookie: { secure: false, path: "/" }, // cookie expires in 8 hours
    saveUninitialized: false,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

initUserService(app);

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Run when client connects
io.on('connection', socket => {
  initRoomService(io, socket);
  initChatService(io, socket);
  initPlaylistService(io, socket);
  initPlayerService(io, socket);
});

const PORT = process.env.PORT || 4001;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
