export const getPlaylistState = (playlist) => {
  return JSON.stringify({
    playlist: playlist.songs,
    current: playlist.activeSong,
  });
};