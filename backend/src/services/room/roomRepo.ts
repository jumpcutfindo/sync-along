/**
 * A Repository for interacting with the underlying Room Session Cache - in Redis
 * Interacts with the RoomDao and UserDao classes
 */

import RoomDao from "../../dao/roomDao";
import UserDao from "../../dao/userDao";

import Room from "../../models/room";
class RoomRepo {
  static async doesRoomExist(room) {
    return RoomDao.exists(room);
  };

  static async addUserToRoom(userId, room) {
    return new Promise(async (resolve, reject) => {
      try {
        const roomExists = await this.doesRoomExist(room);
        if (roomExists) {
          const roomObj = await RoomDao.find(room);
          roomObj.addUser(userId);
          await RoomDao.save(roomObj);
          resolve(roomObj);
        } else {
          const newRoom = RoomDao.create(userId, room);
          await RoomDao.save(newRoom);
          resolve(newRoom);
        }
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  };

  static async getUsersInRoom(roomCode): Promise<Set<string>> {
    return new Promise(async (resolve, reject) => {
      try {
        const room = await RoomDao.find(roomCode);
        resolve(room.getUsers());
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  }

  static async getUser(id: string) {
    return UserDao.find(id);
  };

  static async addUserToRoomCache(id, username, room) {
    return new Promise((resolve, reject) => {
      const user = UserDao.create(id, username, room);
      UserDao.save(user)
      .then((res) => resolve(res))
      .catch((err) => {
        console.log(err);
        return reject(err);
      });
    });
  }

  static async isOwner(userId, room) {
    return new Promise(async (resolve, reject) => {
      RoomDao.find(room)
        .then((foundRoom) => {
          resolve(foundRoom.getOwner() === userId);
        })
        .catch((err) => {
          console.log(err);
          reject(err)
        });
    });
  }

  static async removeUserFromRoom(userId, room): Promise<unknown> {
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
        console.log(err);
        reject(err);
      }
    })
  }

  static async removeUserFromRoomCache(userId): Promise<unknown> {
    return UserDao.delete(userId);
  }

  static async getRoomStatus(room): Promise<Room> {
    return RoomDao.find(room);
  }
}

export default RoomRepo;