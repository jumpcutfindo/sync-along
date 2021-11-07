import { IO, SocketType } from "src/server";
// import { resetSongProgress } from "../player";
import RoomRepo from "../room/roomRepo";
import PlaylistRepo from "./playlistRepo";
import { getPlaylistState } from "./utils";
class PlaylistController {
    io: IO;
    socket: SocketType;
    constructor(io: IO, socket: SocketType) {
        this.socket = socket;
        this.io = io;
    }

    handleAddPlaylist = async ({ url }: { url: string }) => {
        const user = await RoomRepo.getUser(this.socket.id);
        if (user) {
            const playlist = await PlaylistRepo.addSongToPlaylist(
                url,
                user.room
            );
            this.io
                .to(user.getRoom())
                .emit("playlist/update", getPlaylistState(playlist));
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

                this.io
                    .to(user.room)
                    .emit("playlist/update", getPlaylistState(playlist));
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
            // TODO: add reset song progress
            this.io
                .to(user.room)
                .emit("playlist/update", getPlaylistState(playlist));
        }
    };

    handleNextPlaylist = async () => {
        const user = await RoomRepo.getUser(this.socket.id);
        if (user) {
            const playlist = await PlaylistRepo.playNextSong(user.room);
            // resetSongProgress(this.io, this.socket);

            this.io
                .to(user.room)
                .emit("playlist/update", getPlaylistState(playlist));
        }
    };

    handlePrevPlaylist = async () => {
        const user = await RoomRepo.getUser(this.socket.id);
        if (user) {
            const playlist = await PlaylistRepo.playPreviousSong(user.room);
            // resetSongProgress(this.io, this.socket);
            this.io
                .to(user.room)
                .emit("playlist/update", getPlaylistState(playlist));
        }
    };
}

export default PlaylistController;
