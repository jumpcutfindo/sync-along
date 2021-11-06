import Serialiser from "esserializer";
import User from "../models/user";
import RedisConnection from "../connections/RedisConnection";

const redisClient = RedisConnection.getConnection();
class UserDao {
  id: string;
  username: string;
  roomCode: string;
  static create(id: string, username: string, roomCode: string) {
    const newUser = new User(id, username, roomCode);
    return newUser;
  }

  static async save(user: User) {
    return new Promise((resolve, reject) => {
      const userId = user.getId;
      const serialisedUser = Serialiser.serialize(user);
      redisClient.set(`USER:${userId}`, serialisedUser, (err) => {
        if (err) {
          reject(err);
        }
        resolve(true);
      })
    });
  };

  // static async exists(roomCode: string) {
  //   return new Promise((resolve, reject) =>
  //     redisClient.exists(`ROOM:${roomCode}`, (err, reply) => {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         resolve(reply === 1);
  //       }
  //     })
  //   );
  // }

  static async find(userId: string): Promise<User> {
    return new Promise((resolve, reject) => {
      redisClient.get(`USER:${userId}`, (err, reply) => {
        if (err) {
          reject(err);
        }
        try {
          const user = Serialiser.deserialize(reply, [User]);
          resolve(user);
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  static async delete(userId: string) {
    return new Promise((resolve, reject) => {
      redisClient.del(`USER:${userId}`, (err, reply) => {
        if (err) {
          reject(err);
        }
        resolve(reply);
      });
    });
  };
}

export default UserDao;