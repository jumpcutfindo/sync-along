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

import {ROOM_NOT_FOUND} from "./constants";

const redisClient = RedisConnection.getConnection();

export const doesRoomExist = async (room) => {
  return new Promise((resolve, reject) =>
    redisClient.exists(`ROOM:${room}`, (err, reply) => {
      if (err) {
        reject(err);
      } else {
        if (reply === 1) {
          resolve(true);
        } else {
          resolve(false);
        }
      }
    })
  );
};

export const addUserToRoom = async (username, room) => {
  return new Promise((resolve, reject) => {
    redisClient.scard(`ROOM:${room}`, (err, reply) => {
      if (err) {
        reject(err);
      }
      if (reply === 0) {
        redisClient.set(`OWNER:${room}`, username);
      }
      redisClient.sadd(`ROOM:${room}`, username);
      resolve(room);
    }
    );
  });
};

export const getUsersInRoom = async (room) => {
  return new Promise((resolve, reject) => {
    redisClient.smembers(`ROOM:${room}`, (err, reply) => 
    {
      if (err) {
        reject(err);
      }
      if (!reply) {
        reject(new Error(ROOM_NOT_FOUND))
      }
      resolve(reply);
    })
  })
}

export const addUserToRoomCache = async (id, username, room) => {
  return new Promise((resolve, reject) => {
    redisClient.set(`USER:${id}`, JSON.stringify({
      id,
      username,
      room
    }), (err, reply) => {
      if (err) {
        reject(err);
      }
      resolve(true);
    });
  });
}
