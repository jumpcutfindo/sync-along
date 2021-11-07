import { IO, SocketType } from "src/server";
import RoomRepo from "src/services/room/roomRepo";
import PlayerRepo from "./playerRepo";
class PlayerController {
    io: IO;
    socket: SocketType;
    constructor(io: IO, socket: SocketType) {
        this.socket = socket;
        this.io = io;
    }

    handlePlayPlayer = async (time: number) => {
        const user = await RoomRepo.getUser(this.socket.id);
        console.log(`player/play called by ${user.id}`);
        if (user) {
            await PlayerRepo.play(user.room, time);
            // update player
            await this.dispatchUpdatePlayer(user.room);
        }
    };

    handlePausePlayer = async (time: number) => {
        const user = await RoomRepo.getUser(this.socket.id);
        console.log(`player/pause called by ${user.id}`);
        if (user) {
            await PlayerRepo.pause(user.room, time);
            // update player
            await this.dispatchUpdatePlayer(user.room);
        }
    };

    handleScrubPlayer = async (time: number) => {
        const user = await RoomRepo.getUser(this.socket.id);
        console.log(`player/scrub called by ${user.id}`);
        if (user) {
            await PlayerRepo.scrub(user.room, time);
            // update player
            await this.dispatchUpdatePlayer(user.room);
        }
    };

    handleCompletePlayer = async () => {
        const user = await RoomRepo.getUser(this.socket.id);
        console.log(`player/scrub called by ${user.id}`);
        if (user) {
            await PlayerRepo.complete(user.room);
            // update player
            await this.dispatchUpdatePlayer(user.room);
        }
    };

    dispatchUpdatePlayer = async (room: string) => {
        const playerStatus = await PlayerRepo.getPlayerUpdateStatus(room);
        this.io.to(room).emit("player/update", playerStatus);
    };
}

export default PlayerController;
