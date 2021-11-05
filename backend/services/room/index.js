const CREATE_ROOM_EVENT = "room/create";
const JOIN_ROOM_EVENT = "room/join";
const LEAVE_ROOM_EVENT = "room/leave";

const {RoomController} = require("./controller");
const initRoomService = (io, socket) => {
  const roomController = new RoomController(io, socket);
  socket.on(CREATE_ROOM_EVENT, roomController.handleCreateRoom);
  socket.on(JOIN_ROOM_EVENT, roomController.handleJoinRoom);
}

module.exports = {initRoomService};