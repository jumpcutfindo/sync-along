const CREATE_ROOM_API = "/room/create";
const JOIN_ROOM_API = "/room/join";
const DELETE_ROOM_API = "/room/delete";
const LEAVE_ROOM_API = "/room/leave";

const {handleCreateRoom} = require("./controller");
const initRoomService = (app) => {
  app.post(CREATE_ROOM_API, handleCreateRoom);
}

module.exports = {initRoomService};