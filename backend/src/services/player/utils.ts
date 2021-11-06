import Playlist from "models/playlist";
import Song from "models/song";

type PlaylistState = {
  playlist: Song[];
  current: Song;
}
export const getPlaylistState = (playlist: Playlist): string => {
  const playlistState: PlaylistState = {
    playlist: playlist.getSongs(),
    current: playlist.getActiveSong(),
  }
  return JSON.stringify(playlistState);
};
