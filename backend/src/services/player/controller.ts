import {IO, SocketType} from "src/server";
import {resetSongProgress} from "../player";
import RoomRepo from "../room/roomRepo";
import PlayerRepo from "./playerRepo";
import {getPlaylistState} from "./utils";
class PlayerController {
  io: IO;
  socket: SocketType;
  constructor(io: IO, socket: SocketType) {
    this.socket = socket;
    this.io = io;
  }

  async handleAddPlaylist({ url }: { url: string}) {
    const user = await RoomRepo.getUser(this.socket.id);
    if (user) {
      const playlist = await PlayerRepo.addSongToPlaylist(url, user.room);
      this.io.to(user.getRoom()).emit("playlist/update", getPlaylistState(playlist));
    }
  }

  async handleRemovePlaylist({id}: {id: number}) {
    const user = await RoomRepo.getUser(this.socket.id);
    if (user) {
      const playlist = await PlayerRepo.removeSongFromPlaylist(id, user.room);
      
      this.io.to(user.room).emit("playlist/update", getPlaylistState(playlist));
    }
  };

  async handleSelectPlaylist({id}: {id: number}) {
    const user = await RoomRepo.getUser(this.socket.id);
    if (user) {
      const playlist = await PlayerRepo.setActiveSongInPlaylist(id, user.room);
      // TODO: add reset song progress
      this.io.to(user.room).emit("playlist/update", getPlaylistState(playlist));
    }
  }

  async handleNextPlaylist() {
    const user = await RoomRepo.getUser(this.socket.id);
    if (user) {
      const playlist = await PlayerRepo.playNextSong(user.room);
      resetSongProgress(this.io, this.socket);

      this.io.to(user.room).emit("playlist/update", getPlaylistState(playlist));
    }
  }

  async handlePrevPlaylist() {
    const user = await RoomRepo.getUser(this.socket.id);
    if (user) {
      const playlist = await PlayerRepo.playPreviousSong(user.room);
      resetSongProgress(this.io, this.socket);
      this.io.to(user.room).emit("playlist/update", getPlaylistState(playlist));
    }
  }
}

export default PlayerController;