import PlaylistDao from "src/dao/playlistDao";
import Song from "src/models/song";
import Playlist from "src/models/playlist";
import { getPlaylistState } from "src/services/playlist/utils";
import YouTubeAPI from "src/utils/youtube";

class PlaylistRepo {
    static async addSongToPlaylist(
        url: string,
        room: string
    ): Promise<Playlist> {
        return new Promise(async (resolve, reject) => {
            try {
                const playlist = await PlaylistDao.find(room);

                if (!playlist) {
                    const newPlaylist = await PlaylistDao.create(room);
                    const newSong = new Song(newPlaylist.getNextId(), url);
                    const populatedSong = await YouTubeAPI.populateSong(newSong);

                    newPlaylist.addSong(populatedSong);
                    PlaylistDao.save(newPlaylist)
                        .then(() => resolve(newPlaylist))
                        .catch((err) => reject(err));
                } else {
                    const newSong = new Song(playlist.getNextId(), url);
                    const populatedSong = await YouTubeAPI.populateSong(newSong);

                    playlist.addSong(populatedSong);
                    PlaylistDao.save(playlist)
                        .then(() => resolve(playlist))
                        .catch((err) => reject(err));
                }
            } catch (err) {
                reject(err);
            }
        });
    }

    static async removeSongFromPlaylist(id: number, room: string) {
        try {
            const playlist = await PlaylistDao.find(room);
            playlist.removeSong(id);
            await PlaylistDao.save(playlist);
            return playlist;
        } catch (err) {
            throw err;
        }
    }

    static async setActiveSongInPlaylist(id: number, room: string) {
        const playlist = await PlaylistDao.find(room);
        playlist.setActiveSong(id);
        await PlaylistDao.save(playlist);
        return playlist;
    }

    static async playNextSong(room: string) {
        const playlist = await PlaylistDao.find(room);
        playlist.nextSong();
        await PlaylistDao.save(playlist);
        return playlist;
    }

    static async playPreviousSong(room: string) {
        const playlist = await PlaylistDao.find(room);
        playlist.prevSong();
        await PlaylistDao.save(playlist);
        return playlist;
    }

    static async getPlaylistUpdateStatus(room: string) {
        const playlist = await PlaylistDao.find(room);
        return getPlaylistState(playlist);
    }
}

export default PlaylistRepo;
