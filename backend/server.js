const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const session = require("express-session");
const cors = require("cors");
const app = express();
require('dotenv/config');



// Import Routes
const { initChatService } = require('./services/chat');
const {  initPlayerService, initPlaylistService } = require('./services/player');
const {initUserService} = require('./services/user/index');
const {initRoomService} = require('./services/room/index');
// const { initRoomManagementService } = require('./services/room-management');
// const {initPlaylistService} = require('./services/playlist');
//const playlistRoute = require('./services/playlist');

// Import Databases and Resources
const {MongodbConnection} = require("./connections/MongodbConnection");

//app.use('/playlist', playlistRoute);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

const redis = require("redis");
const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
})


initUserService(app, redisClient);

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

// Set static folder
// app.use(express.static(path.join(__dirname, 'public')));

// Initialise Connections
const mongodbConnection = MongodbConnection.getInstance();

// Run when client connects
io.on('connection', socket => {
  initRoomService(io, socket);
  initChatService(io, socket);
  initPlaylistService(io, socket);
  initPlayerService(io, socket);
});

const PORT = process.env.PORT || 4001;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
