/**
 * Controller for the Room Service
 * Interfaces with subsystems of the backend.
 */

const {generateRoomCode} = require("./utils");
const {doesRoomExist, addUserToRoom} = require("./roomDao");
const NO_USERNAME_PROVIDED = "Please provide a username to create a room";
const ERROR_JOINING_ROOM = "Unable to join a room";
const MISSING_ROOM_CODE_USERNAME = "Please provide a username and room code to join a room";
const ROOM_NOT_FOUND = "The requested room cannot be found.";

/* 
Room Info needed:
number of users in the room
current playlist: []
current song: {
  link: Youtube Link,
  title: Title,
}
player: {
  state: play/pause,
  time: currentTime,
}
*/
class RoomController {
  constructor(socket, io) {
    this.socket = socket;
    this.io = io;
  }
  
  handleCreateRoom = async ({username}, callback) => {
    if (!username) {
      return callback({
        status: 400, 
        isSuccessful: false,
        message: NO_USERNAME_PROVIDED,
      });
    }
  
    let generatedCode = generateRoomCode();
    while (await doesRoomExist(generatedCode)) {
      console.log(generatedCode);
      generatedCode = generateRoomCode();
    }
    addUserToRoom(username, generatedCode)
      .then(() => callback({
        status: 200,
        code: generatedCode,
      }))
      .catch(() =>
        callback({
          status: 400,
          message: ERROR_JOINING_ROOM,
      }));
  };

  handleJoinRoom = async ({username, code}, callback) => {
    if (!(username && code)) {
      return callback({
        status: 400,
        isSuccessful: false,
        message: MISSING_ROOM_CODE_USERNAME,
      });
    }
  
    const roomExists = await roomExists(code);
    if (!roomExists) {
      return callback({
        status: 400,
        isSuccessful: false,
        message: ROOM_NOT_FOUND,
      });
    }
  
    try {
      await addUserToRoom(username, code);
      return callback({
        status: 200,
        isSuccessful: true,
        code,
        users: 1,
        playlist: [],
        songs: "",
        player: {
          state: "pause",
          time: 0,
        }
      });
    } catch (err) {
      return callback({
        status: 400,
        isSuccessful: false,
        message: ERROR_JOINING_ROOM,
      });
    }
  }

}

module.exports = {RoomController};