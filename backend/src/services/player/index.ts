/**
 * Defining endpoints for the room player service
 */
import {ServiceEntryHandler} from "src/server";
import PlayerController from "./controller";

const ADD_PLAYLIST = "playlist/add";
const REMOVE_PLAYLIST = "playlist/remove";
const SELECT_PLAYLIST = "playlist/select";
const NEXT_PLAYLIST = "playlist/next";
const PREV_PLAYLIST = "playlist/prev";

const initPlayerService: ServiceEntryHandler = (io, socket) => {
  const playerController = new PlayerController(io, socket);
  socket.on(ADD_PLAYLIST, playerController.handleAddPlaylist);
  socket.on(REMOVE_PLAYLIST, playerController.handleRemovePlaylist);
  socket.on(SELECT_PLAYLIST, playerController.handleSelectPlaylist);
  socket.on(NEXT_PLAYLIST, playerController.handleNextPlaylist);
  socket.on(PREV_PLAYLIST, playerController.handlePrevPlaylist);
}

export default initPlayerService;