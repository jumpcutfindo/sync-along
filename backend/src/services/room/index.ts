const CREATE_ROOM_EVENT = "room/create";
const JOIN_ROOM_EVENT = "room/join";
const LEAVE_ROOM_EVENT = "room/leave";
const DISCONNECT_EVENT = "disconnect";

import { ServiceEntryHandler } from "src/server";
import RoomController from "./controller";

const initRoomService: ServiceEntryHandler = (io, socket) => {
    const roomController = new RoomController(io, socket);
    socket.on(CREATE_ROOM_EVENT, roomController.handleCreateRoom);
    socket.on(JOIN_ROOM_EVENT, roomController.handleJoinRoom);
    socket.on(LEAVE_ROOM_EVENT, roomController.handleLeaveRoom);
    socket.on(DISCONNECT_EVENT, roomController.handleDisconnect);
};

export default initRoomService;
