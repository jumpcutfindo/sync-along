import { IO, SocketType } from "src/server";
import RoomRepo from "src/services/room/roomRepo";
import StatusDispatcher from "src/statusDispatcher";
import PlayerRepo from "./playerRepo";
class PlayerController {
    io: IO;
    socket: SocketType;
    statusDispatcher: StatusDispatcher;
    constructor(io: IO, socket: SocketType) {
        this.socket = socket;
        this.io = io;
        this.statusDispatcher = new StatusDispatcher(io, socket);
    }

    handlePlayPlayer = async (time: number) => {
        const user = await RoomRepo.getUser(this.socket.id);
        console.log(`player/play called by ${user.id}`);
        if (user) {
            await PlayerRepo.play(user.room, time);
            // update player
            this.statusDispatcher.dispatchPlayerUpdate(user.room);
        }
    };

    handlePausePlayer = async (time: number) => {
        const user = await RoomRepo.getUser(this.socket.id);
        console.log(`player/pause called by ${user.id}`);
        if (user) {
            await PlayerRepo.pause(user.room, time);
            // update player
            this.statusDispatcher.dispatchPlayerUpdate(user.room);
        }
    };

    handleScrubPlayer = async (time: number) => {
        const user = await RoomRepo.getUser(this.socket.id);
        console.log(`player/scrub called by ${user.id}`);
        if (user) {
            await PlayerRepo.scrub(user.room, time);
            // update player
            this.statusDispatcher.dispatchPlayerUpdate(user.room);
        }
    };

    handleCompletePlayer = async () => {
        const user = await RoomRepo.getUser(this.socket.id);
        console.log(`player/scrub called by ${user.id}`);
        if (user) {
            await PlayerRepo.complete(user.room);
            // update player
            this.statusDispatcher.dispatchPlayerUpdate(user.room);
        }
    };
}

export default PlayerController;
