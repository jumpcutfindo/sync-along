import PlaylistDao from "dao/playlistDao"
import Song from "models/song";
import Playlist from "models/playlist";

class PlayerRepo {
  static async addSongToPlaylist(url: string, room: string): Promise<Playlist> {
  return new Promise(async (resolve, reject) => {
    try {
      const playlist = await PlaylistDao.find(room);
    
    if (!playlist) {
      const newPlaylist = await PlaylistDao.create(room);
      const newSong = new Song(0, url);
      newPlaylist.addSong(newSong);
      PlaylistDao.save(newPlaylist)
        .then(() => resolve(newPlaylist))
        .catch((err) => reject(err));
    } else {
      playlist.addSong(new Song(Number(playlist.getNextId()), url));
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
    const playlist = await PlaylistDao.find(room);
    playlist.removeSong(id);
    await PlaylistDao.save(playlist);
    return playlist;
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
}

export default PlayerRepo;