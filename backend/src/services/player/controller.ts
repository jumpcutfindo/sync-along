import {IO, SocketType} from "server";
import {resetSongProgress} from "services/player";
import {getCurrentUser} from "utils/users";
import {addSongToPlaylist, getPlaylistState} from "../../dao/playerDao";

class PlayerController {
  io: IO;
  socket: SocketType;
  constructor(io: IO, socket: SocketType) {
    this.socket = socket;
    this.io = io;
  }

  handleAddPlaylist = async ({ url }: { url: string}) => {
    const user = getCurrentUser(this.socket.id);
    if (user) {
      const playlist = await addSongToPlaylist(url, user.room);
      this.io.to(user.room).emit("playlist/update", getPlaylistState(playlist));
    }
  }

  // handleRemovePlaylist = ({id: string}) => {
  //   const user = getCurrentUser(this.socket.id);
  //   if (user) {
  //     removeSongFromPlaylist(id, user.room);
  //     this.io.to(user.room).emit("playlist/update", getPlaylistState(room));
  //   }
  // };

  // handleSelectPlaylist = ({id: string}) => {
  //   const user = getCurrentUser(this.socket.id);
  //   if (user) {
  //     removeSongFromPlaylist(id, user.room);
  //     this.io.to(user.room).emit("playlist/update", getPlaylistState(room));
  //   }
  // }

  // handleNextPlaylist = () => {
  //   const user = getCurrentUser(this.socket.id);
  //   if (user) {
  //     addRoomPlaylistEntry.playNextSong();
  //     resetSongProgress(this.io, this.socket);

  //     this.io.to(user.room).emit("playlist/update", getPlaylistState(room));
  //   }
  // }

  // handlePrevPlaylist = () => {
  //   const user = getCurrentUser(this.socket.id);
  //   if (user) {
  //     goToPreviousSongInRoomPlayist(user.room);
  //     resetSongProgress(this.io, this.socket);
  //     this.io.to(user.room).emit("playlist/update", getPlaylistState(roomPlaylist));
  //   }
  // }
}

export default PlayerController;