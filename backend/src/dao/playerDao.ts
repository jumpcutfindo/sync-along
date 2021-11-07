import Serialiser from "esserializer";
import Player from "src/models/player";
import RedisConnection from "src/connections/RedisConnection";

const redisClient = RedisConnection.getConnection();
/**
 * A DAO for the Music Player
 */
class PlayerDao {
    static create(roomCode: string) {
        const newPlayer = new Player(roomCode);
        return newPlayer;
    }

    static async save(player: Player) {
        return new Promise((resolve, reject) => {
            const room = player.getRoomCode;
            const serialisedPlayer = Serialiser.serialize(player);
            redisClient.set(`PLAYER:${room}`, serialisedPlayer, (err) => {
                if (err) {
                    reject(err);
                }
                resolve(true);
            });
        });
    }

    static async find(room: string): Promise<Player> {
        return new Promise((resolve, reject) => {
            redisClient.get(`PLAYER:${room}`, (err, reply) => {
                if (err) {
                    reject(err);
                }
                try {
                    const player = Serialiser.deserialize(reply, [Player]);
                    resolve(player);
                } catch (err) {
                    reject(err);
                }
            });
        });
    }

    static async delete(room: string) {
        return new Promise((resolve, reject) => {
            redisClient.del(`PLAYER:${room}`, (err, reply) => {
                if (err) {
                    reject(err);
                }
                resolve(reply);
            });
        });
    }
}

export default PlayerDao;
