import { IO, SocketType } from "src/server";
// import { resetSongProgress } from "../player";
import RoomRepo from "../room/roomRepo";
import PlaylistRepo from "./playlistRepo";
import PlayerRepo from "../player/playerRepo";
import StatusDispatcher from "src/StatusDispatcher";

import { validateYouTubeUrl } from "src/utils/playlist";
class PlaylistController {
    io: IO;
    socket: SocketType;
    statusDispatcher: StatusDispatcher;
    constructor(io: IO, socket: SocketType) {
        this.socket = socket;
        this.io = io;
        this.statusDispatcher = new StatusDispatcher(io, socket);
    }

    handleAddPlaylist = async ({ url }: { url: string }) => {
        if (validateYouTubeUrl(url)) {
            const user = await RoomRepo.getUser(this.socket.id);
            if (user) {
                const playlist = await PlaylistRepo.addSongToPlaylist(
                    url,
                    user.room
                );
                this.statusDispatcher.dispatchPlaylistUpdate(user.room);
            }
        }
    };

    handleRemovePlaylist = async ({ id }: { id: number }) => {
        try {
            const user = await RoomRepo.getUser(this.socket.id);
            if (user) {
                const playlist = await PlaylistRepo.removeSongFromPlaylist(
                    id,
                    user.room
                );
                this.statusDispatcher.dispatchPlaylistUpdate(user.room);
            }
        } catch (err) {
            console.log("error");
            console.log(err);
        }
    };

    handleSelectPlaylist = async ({ id }: { id: number }) => {
        const user = await RoomRepo.getUser(this.socket.id);
        if (user) {
            const playlist = await PlaylistRepo.setActiveSongInPlaylist(
                id,
                user.room
            );
            this.resetSongProgress(user.room);
            this.statusDispatcher.dispatchPlaylistUpdate(user.room);
        }
    };

    handleNextPlaylist = async () => {
        const user = await RoomRepo.getUser(this.socket.id);
        if (user) {
            const playlist = await PlaylistRepo.playNextSong(user.room);
            this.resetSongProgress(user.room);
            this.statusDispatcher.dispatchPlaylistUpdate(user.room);
        }
    };

    handlePrevPlaylist = async () => {
        const user = await RoomRepo.getUser(this.socket.id);
        if (user) {
            const playlist = await PlaylistRepo.playPreviousSong(user.room);
            this.resetSongProgress(user.room);
            this.statusDispatcher.dispatchPlaylistUpdate(user.room);
        }
    };

    resetSongProgress = async (room: string) => {
        const player = await PlayerRepo.resetSong(room);
        await this.statusDispatcher.dispatchPlayerUpdate(room);
    };
}

export default PlaylistController;
