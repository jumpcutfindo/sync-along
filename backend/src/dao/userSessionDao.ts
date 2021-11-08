import Serialiser from "esserializer";
import UserSession from "src/models/userSession";
import RedisConnection from "src/connections/RedisConnection";

const redisClient = RedisConnection.getConnection();
class UserSessionDao {
    id: string;
    username: string;
    roomCode: string;
    static create(id: string, username: string, roomCode: string) {
        const newUser = new UserSession(id, username, roomCode);
        return newUser;
    }

    static async save(user: UserSession) {
        return new Promise((resolve, reject) => {
            const userId = user.getId();
            const serialisedUser = Serialiser.serialize(user);
            redisClient.set(`USER:${userId}`, serialisedUser, (err) => {
                if (err) {
                    reject(err);
                }
                resolve(true);
            });
        });
    }

    static async find(userId: string): Promise<UserSession> {
        return new Promise((resolve, reject) => {
            redisClient.get(`USER:${userId}`, (err, reply) => {
                if (err) {
                    reject(err);
                }
                try {
                    const user = Serialiser.deserialize(reply, [UserSession]);
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
    }
}

export default UserSessionDao;
