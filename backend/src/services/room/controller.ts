/**
 * Controller for the Room Service
 * Interfaces with subsystems of the backend.
 */

import {generateRoomCode} from "./utils";
import {doesRoomExist,addUserToRoom,getUsersInRoom,addUserToRoomCache} from "./roomDao";
import {NO_USERNAME_PROVIDED,ERROR_JOINING_ROOM,MISSING_ROOM_CODE_USERNAME,ROOM_NOT_FOUND} from "./constants";
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
  constructor(io, socket) {
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
      generatedCode = generateRoomCode();
    }
    addUserToRoom(username, generatedCode)
      .then(() => addUserToRoomCache(this.socket.id, username, generatedCode))
      .then(() => this.socket.join(generatedCode))
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

  handleJoinRoom = async ({username, room}, callback) => {
    if (!(username && room)) {
      return callback({
        status: 400,
        isSuccessful: false,
        message: MISSING_ROOM_CODE_USERNAME,
      });
    }
  
    const roomExists = await doesRoomExist(room);
    if (!roomExists) {
      return callback({
        status: 400,
        isSuccessful: false,
        message: ROOM_NOT_FOUND,
      });
    }
  
    try {
      await addUserToRoom(username, room);
      await addUserToRoomCache(this.socket.id, username, room);
      const users = await getUsersInRoom(room);
      this.socket.join(room);

      return callback({
        status: 200,
        isSuccessful: true,
        room,
        users,
        playlist: [],
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

export default RoomController;