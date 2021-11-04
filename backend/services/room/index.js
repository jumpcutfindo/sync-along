const CREATE_ROOM_EVENT = "/room/create";
const JOIN_ROOM_EVENT = "/room/join";
const DELETE_ROOM_EVENT = "/room/delete";
const LEAVE_ROOM_EVENT = "/room/leave";

const {RoomController} = require("./controller");
const initRoomService = (socket, io) => {
  const roomController = new RoomController(socket, io);
  socket.on(CREATE_ROOM_EVENT, roomController.handleCreateRoom);
  socket.on(JOIN_ROOM_EVENT, roomController.handleJoinRoom);
}

module.exports = {initRoomService};