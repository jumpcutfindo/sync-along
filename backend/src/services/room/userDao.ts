import Serialiser from "esserializer";
import User from "./userModel";
import RedisConnection from "src/connections/RedisConnection";

const redisClient = RedisConnection.getConnection();
class UserDao {
  static create(id: string, username: string, roomCode: string) {
    const newUser = new User(id, username, roomCode);
    return newUser;
  }

  static async save(user: User) {
    return new Promise((resolve, reject) => {
      const userId = user.id;
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
          if (!reply) {
            resolve(reply);
          } else {
            const user = Serialiser.deserialize(reply, [User]);
            resolve(user);
          }
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