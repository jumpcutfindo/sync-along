import Serialiser from "esserializer";
import Room from "../models/room";

import { ROOM_NOT_FOUND } from "../services/room/constants";
import RedisConnection from "../connections/RedisConnection";

const redisClient = RedisConnection.getConnection();
class RoomDao {
  static create(owner: string, roomCode: string) {
    const newRoom = new Room(roomCode, owner);
    newRoom.addUser(owner);
    return newRoom;
  }

  static async save(room: Room) {
    return new Promise((resolve, reject) => {
      const roomCode = room.getRoomCode();
      const serialisedRoom = Serialiser.serialize(room);
      redisClient.set(`ROOM:${roomCode}`, serialisedRoom, (err) => {
        if (err) {
          reject(err);
        }
        resolve(true);
      })
    });
  };

  static async exists(roomCode: string) {
    return new Promise((resolve, reject) =>
      redisClient.exists(`ROOM:${roomCode}`, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply === 1);
        }
      })
    );
  }

  static async find(roomCode: string): Promise<Room> {
    return new Promise((resolve, reject) => {
      redisClient.get(`ROOM:${roomCode}`, (err, reply) => {
        if (err) {
          reject(err);
        }
        try {
          if (!reply) {
            reject(new Error(ROOM_NOT_FOUND));
          } else {
            const room = Serialiser.deserialize(reply, [Room]);
            resolve(room);
          }
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  static async delete(room: string) {
    return new Promise((resolve, reject) => {
      redisClient.del(`ROOM:${room}`, (err, reply) => {
        if (err) {
          reject(err);
        }
        resolve(reply);
      });
    });
  };
}

export default RoomDao;