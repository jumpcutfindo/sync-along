import Song from "src/models/song";
import PlaylistDao from "./playlistDao";

export const addSongToPlaylist = async (url: string, room: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const playlist = await PlaylistModel.find(room);

            if (!playlist) {
                const newPlaylist = await PlaylistModel.create(room);
                const newSong = new Song(0, url);
                newPlaylist.addSong(newSong);
                PlaylistModel.save(newPlaylist)
                    .then(() => resolve(newPlaylist))
                    .catch((err) => reject(err));
            } else {
                playlist.addSong(new Song(Number(playlist.getNextId()), url));
                PlaylistModel.save(playlist)
                    .then(() => resolve(playlist))
                    .catch((err) => reject(err));
            }
        } catch (err) {
            reject(err);
        }
    });
};
