import { IO, SocketType } from "src/server";
import RoomRepo from "src/services/room/roomRepo";
import PlayerRepo from "src/services/player/playerRepo";
import PlaylistRepo from "src/services/playlist/playlistRepo";

class StatusDispatcher {
  io: IO;
  socket: SocketType;
  constructor(io: IO, socket: SocketType) {
    this.socket = socket;
    this.io = io;
}
  dispatchPlayerUpdate = async (room: string) => {
    const playerStatus = await PlayerRepo.getPlayerUpdateStatus(room);
    this.io.to(room).emit("player/update", playerStatus);
  };

  dispatchPlaylistUpdate = async (room: string) => {
    const playerStatus = await PlaylistRepo.getPlaylistUpdateStatus(room);
    this.io.to(room).emit("playlist/update", playerStatus);
  };

  dispatchRoomUpdate = async (room: string): Promise<void> => {
    const roomStatus = await RoomRepo.getRoomStatus(room);
    console.log(roomStatus);
    this.io.to(room).emit("room/update", roomStatus);
  };
}

export default StatusDispatcher;