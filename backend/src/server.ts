import http from "http";
import express, { Express } from "express";
import { Server, Socket } from "socket.io";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
const app = express();
dotenv.config();

// Import Routes
import initChatService from "./services/chat";
import initPlayerService from "./services/player";
import initPlaylistService from "./services/playlist";
import initUserService from "./services/user";
import initRoomService from "./services/room";

// Import Databases and Resources
import MongodbConnection from "./connections/MongodbConnection";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// set up security
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"],
        credentials: true,
    })
);
app.use(
    session({
        secret: "secret",
        resave: false,
        cookie: { secure: false, path: "/" }, // cookie expires in 8 hours
        saveUninitialized: false,
    })
);

const server = http.createServer(app);
const io = new Server<any, any>(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"],
    },
});

export type IO = typeof io;
export type SocketType = Socket;
export type ServiceEntryHandler = (io: IO, socket: Socket) => void;

export type AppEntryHandler = (app: Express) => void;

// Initialise Connections
const mongodbConnection = MongodbConnection.getConnection();

initUserService(app);
// Run when client connects
io.on("connection", (socket) => {
    initRoomService(io, socket);
    initChatService(io, socket);
    initPlaylistService(io, socket);
    initPlayerService(io, socket);
});

const PORT = process.env.PORT || 4001;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
