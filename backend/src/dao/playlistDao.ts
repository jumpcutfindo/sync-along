import Serialiser from "esserializer";
import Playlist from "src/models/playlist";
import Song from "src/models/song";
import RedisConnection from "src/connections/RedisConnection";

const redisClient = RedisConnection.getConnection();
/**
 * A DAO for the Playlist
 */
class PlaylistDao {
    static create(roomCode: string) {
        const newPlaylist = new Playlist(roomCode);
        return newPlaylist;
    }

    static async save(playlist: Playlist) {
        return new Promise((resolve, reject) => {
            const room = playlist.roomCode;
            const serialisedPlaylist = Serialiser.serialize(playlist);
            redisClient.set(`PLAYLIST:${room}`, serialisedPlaylist, (err) => {
                if (err) {
                    reject(err);
                }
                resolve(true);
            });
        });
    }

    static async find(room: string): Promise<Playlist> {
        return new Promise((resolve, reject) => {
            redisClient.get(`PLAYLIST:${room}`, (err, reply) => {
                if (err) {
                    reject(err);
                }
                try {
                    const playlist = Serialiser.deserialize(reply, [
                        Playlist,
                        Song,
                    ]);
                    resolve(playlist);
                } catch (err) {
                    reject(err);
                }
            });
        });
    }

    static async delete(room: string) {
        return new Promise((resolve, reject) => {
            redisClient.del(`PLAYLIST:${room}`, (err, reply) => {
                if (err) {
                    reject(err);
                }
                resolve(reply);
            });
        });
    }
}

export default PlaylistDao;
