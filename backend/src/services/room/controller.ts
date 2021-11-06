/**
 * Controller for the Room Service
 * Interfaces with subsystems of the backend.
 */

import {generateRoomCode} from "./utils";
import RoomRepo from "./roomRepo";
import {NO_USERNAME_PROVIDED, NO_ROOM_PROVIDED, ERROR_JOINING_ROOM,MISSING_ROOM_CODE_USERNAME,ROOM_NOT_FOUND, SUCCESSFUL_LEFT_ROOM, ERROR_LEFT_ROOM} from "./constants";
import {IO, SocketType} from "src/server";

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
  io: IO;
  socket: SocketType;
  constructor(io: IO, socket: SocketType) {
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
    while (await RoomRepo.doesRoomExist(generatedCode)) {
      generatedCode = generateRoomCode();
    }
    RoomRepo.addUserToRoom(this.socket.id, generatedCode)
      .then(() => RoomRepo.addUserToRoomCache(this.socket.id, username, generatedCode))
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
  
    const roomExists = await RoomRepo.doesRoomExist(room);
    if (!roomExists) {
      return callback({
        status: 400,
        isSuccessful: false,
        message: ROOM_NOT_FOUND,
      });
    }
  
    try {
      await RoomRepo.addUserToRoom(this.socket.id, room);
      await RoomRepo.addUserToRoomCache(this.socket.id, username, room);
      const users = await RoomRepo.getUsersInRoom(room);
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

  handleLeaveRoom = async (_: unknown, callback) => {
    try {
      const {room} = await RoomRepo.getUser(this.socket.id);
      const isOwnerOfRoom = await RoomRepo.isOwner(this.socket.id, room);
      if (isOwnerOfRoom) {
        const users = await RoomRepo.getUsersInRoom(room);
        for (const user of users) {
          await RoomRepo.removeUserFromRoom(user, room);
          await RoomRepo.removeUserFromRoomCache(user);
        }
        this.io.in(room).emit("leaveRoom");
        this.io.in(room).socketsLeave(room);
        callback({
          status: 200,
          isSuccessful: true,
          message: SUCCESSFUL_LEFT_ROOM,
        });
      } else {
        await RoomRepo.removeUserFromRoom(this.socket.id, room);
        await RoomRepo.removeUserFromRoomCache(this.socket.id);
        this.socket.leave(room);
        const roomStatus = await RoomRepo.getRoomStatus(room);
        this.io.to(room).emit("room/update", JSON.stringify(roomStatus));
      }
    } catch {
      return callback({
        status: 400,
        isSuccessful: false,
        message: ERROR_LEFT_ROOM,
      });
    }
  }
}

export default RoomController;