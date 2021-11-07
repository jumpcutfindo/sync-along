/**
 * Defining endpoints for the room player service
 */
import { ServiceEntryHandler } from "src/server";
import PlaylistController from "./controller";

const ADD_PLAYLIST = "playlist/add";
const REMOVE_PLAYLIST = "playlist/remove";
const SELECT_PLAYLIST = "playlist/select";
const NEXT_PLAYLIST = "playlist/next";
const PREV_PLAYLIST = "playlist/prev";

const initPlaylistService: ServiceEntryHandler = (io, socket) => {
    const playlistController = new PlaylistController(io, socket);
    socket.on(ADD_PLAYLIST, playlistController.handleAddPlaylist);
    socket.on(REMOVE_PLAYLIST, playlistController.handleRemovePlaylist);
    socket.on(SELECT_PLAYLIST, playlistController.handleSelectPlaylist);
    socket.on(NEXT_PLAYLIST, playlistController.handleNextPlaylist);
    socket.on(PREV_PLAYLIST, playlistController.handlePrevPlaylist);
};

export default initPlaylistService;
