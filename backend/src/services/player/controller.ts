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

  handleAddPlaylist = async ({ url }: { url: string}) => {
    const user = await RoomRepo.getUser(this.socket.id);
    if (user) {
      const playlist = await PlayerRepo.addSongToPlaylist(url, user.room);
      this.io.to(user.getRoom()).emit("playlist/update", getPlaylistState(playlist));
    }
  }

  handleRemovePlaylist = async ({id}: {id: number}) => {
    const user = await RoomRepo.getUser(this.socket.id);
    if (user) {
      const playlist = await PlayerRepo.removeSongFromPlaylist(id, user.room);
      
      this.io.to(user.room).emit("playlist/update", getPlaylistState(playlist));
    }
  };

  handleSelectPlaylist = async ({id}: {id: number}) => {
    const user = await RoomRepo.getUser(this.socket.id);
    if (user) {
      const playlist = await PlayerRepo.setActiveSongInPlaylist(id, user.room);
      // TODO: add reset song progress
      this.io.to(user.room).emit("playlist/update", getPlaylistState(playlist));
    }
  }

  handleNextPlaylist = async () => {
    const user = await RoomRepo.getUser(this.socket.id);
    if (user) {
      const playlist = await PlayerRepo.playNextSong(user.room);
      resetSongProgress(this.io, this.socket);

      this.io.to(user.room).emit("playlist/update", getPlaylistState(playlist));
    }
  }

  handlePrevPlaylist = async () => {
    const user = await RoomRepo.getUser(this.socket.id);
    if (user) {
      const playlist = await PlayerRepo.playPreviousSong(user.room);
      resetSongProgress(this.io, this.socket);
      this.io.to(user.room).emit("playlist/update", getPlaylistState(playlist));
    }
  }
}

export default PlayerController;