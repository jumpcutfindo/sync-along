/**
 * A Data Access Layer for interacting with the underlying Room Session Cache - in Redis
 */


/**
 * When refactor to Typescript:
 * interface RoomDao {
 * doesRoomExist;
 * createRoom;
 * addUserToRoom;
 * removeUserFromRoom;
 * removeRoom;
 * getUsersInRoom;
 * } 
 */

/**
 * Schema of room:
 * - roomCode: {list of users...}
 * - need to figure out who is the owner
 * something like: roomCode: {
 *  users: //
 * } -> store it as a set.
 * to store owners: owner[roomCode]: username -> O(1) access
 * online users: JSON.stringify({
 *  user id
 * username
 * })
 */

import RedisConnection from "../../connections/RedisConnection";
import RoomDao from "./roomDao";
import {ROOM_NOT_FOUND} from "./constants";
import Room from "services/room/model";
import UserDao from "services/room/userDao";
import User from "services/room/userModel";

const redisClient = RedisConnection.getConnection();

export const doesRoomExist = async (room) => {
  return RoomDao.exists(room);
};

export const addUserToRoom = async (userId, room) => {
  return new Promise(async (resolve, reject) => {
    const roomExists = await doesRoomExist(room);
    if (roomExists) {
      const roomObj = await RoomDao.find(room);
      roomObj.addUser(userId);
      await RoomDao.save(room);
      resolve(roomObj);
    } else {
      const newRoom = RoomDao.create(userId, room);
      await RoomDao.save(newRoom);
      resolve(newRoom);
    }
  });
};

export const getUsersInRoom = async (roomCode) => {
  return new Promise(async (resolve, reject) => {
    try {
      const room = await RoomDao.find(roomCode);
      resolve(room.getUsers());
    } catch (err) {
      reject(err);
    }
  });
}

export const addUserToRoomCache = async (id, username, room) => {
  return new Promise((resolve, reject) => {
    const user = UserDao.create(id, username, room);
    UserDao.save(user)
    .then((res) => resolve(res))
    .catch((err) => reject(err));
  });
}

export const isOwner = async (userId, room) => {
  return new Promise(async (resolve, reject) => {
    RoomDao.find(room)
      .then((res) => resolve(room.owner === userId))
      .catch((err) => reject(err));
  });
}

export const removeUserFromRoom = async (userId, room) => {
  return new Promise(async (resolve, reject) => {
    try {
      const foundRoom = await RoomDao.find(room);
      foundRoom.removeUser(userId);
      if (foundRoom.empty()) {
        const res = await RoomDao.delete(room);
        resolve(res);
      } else {
        const res = await RoomDao.save(foundRoom);
        resolve(res);
      }
    } catch (err) {
      reject(err);
    }
  })
}
export const removeUserFromRoomCache = async (userId) => {
  return UserDao.delete(userId);
}
