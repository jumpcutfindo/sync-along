const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const session = require("express-session");
const cors = require("cors");
const app = express();
const mongoose = require('mongoose');
require('dotenv/config');



// Import Routes
const { initRoomService } = require('./services/room');
const { initChatService } = require('./services/chat');
const {  initPlayerService, initPlaylistService } = require('./services/player');
const { initUserService } = require('./services/user');
const { initRoomManagementService } = require('./services/room-management');
// const {initPlaylistService} = require('./services/playlist');
//const playlistRoute = require('./services/playlist');


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

initUserService(app);
initRoomManagementService(app);
// initPlaylistService(app);

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Set static folder
// app.use(express.static(path.join(__dirname, 'public')));

// Connect to playlist DB 
mongoose.connect(process.env.DB_CONNECTION ,{useNewUrlParser: true}, () => 
  console.log('Connected to PlaylistDB!')
);

// Run when client connects
io.on('connection', socket => {
  initRoomService(io, socket);
  initChatService(io, socket);
  initPlaylistService(io, socket);
  initPlayerService(io, socket);
});

const PORT = process.env.PORT || 4001;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
