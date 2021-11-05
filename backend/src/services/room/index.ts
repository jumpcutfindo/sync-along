const CREATE_ROOM_EVENT = "room/create";
const JOIN_ROOM_EVENT = "room/join";
const LEAVE_ROOM_EVENT = "room/leave";

import {ServiceEntryHandler} from "server";
import RoomController from "./controller";

const initRoomService: ServiceEntryHandler = (io, socket) => {
  const roomController = new RoomController(io, socket);
  socket.on(CREATE_ROOM_EVENT, roomController.handleCreateRoom);
  socket.on(JOIN_ROOM_EVENT, roomController.handleJoinRoom);
}

export default initRoomService;