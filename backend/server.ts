import path from 'path';
import http from 'http';
import express from 'express';
import { Server } from 'socket.io';
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
const app = express();
dotenv.config();



// Import Routes
import {initChatService} from './services/chat/index';
import {initPlayerService,initPlaylistService} from './services/player';
import {initUserService} from './services/user/index';
import {initRoomService} from './services/room/index';
// const { initRoomManagementService } = require('./services/room-management');
// const {initPlaylistService} = require('./services/playlist');

// Import Databases and Resources
import {MongodbConnection} from "./connections/MongodbConnection";

//app.use('/playlist', playlistRoute);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// set up security
app.use(cors({
  origin: process.env.FRONTEND_URL,
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

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

// Set static folder
// app.use(express.static(path.join(__dirname, 'public')));

// Initialise Connections
const mongodbConnection = MongodbConnection.getConnection();

// Run when client connects
io.on('connection', socket => {
  initRoomService(io, socket);
  initChatService(io, socket);
  initPlaylistService(io, socket);
  initPlayerService(io, socket);
});

const PORT = process.env.PORT || 4001;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
