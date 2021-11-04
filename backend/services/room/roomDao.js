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
 */

const redis = require("redis");

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
})

const doesRoomExist = async (code) => {
  return new Promise((resolve, reject) =>
    redisClient.exists(code, (err, reply) => {
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

const addUserToRoom = async (username, room) => {
  return new Promise((resolve, reject) => {
    redisClient.get(room, (err, reply) => {
      if (err) {
        reject(err);
      }
      if (!reply) {
        redisClient.set(`OWNER${room}`, username);
      }
      redisClient.sadd(room, username);
      resolve(room);
    }
    );
  });
};

module.exports = {doesRoomExist, addUserToRoom};