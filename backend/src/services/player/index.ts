/**
 * Defining endpoints for the room player service
 */
import { ServiceEntryHandler } from "src/server";
import PlayerController from "./controller";

const PLAY_PLAYER = "player/play";
const PAUSE_PLAYER = "player/pause";
const SCRUB_PLAYER = "player/scrub";
const COMPLETE_PLAYER = "player/complete";

const initPlayerService: ServiceEntryHandler = (io, socket) => {
    const playerController = new PlayerController(io, socket);
    socket.on(PLAY_PLAYER, playerController.handlePlayPlayer);
    socket.on(PAUSE_PLAYER, playerController.handlePausePlayer);
    socket.on(SCRUB_PLAYER, playerController.handleScrubPlayer);
    socket.on(COMPLETE_PLAYER, playerController.handleCompletePlayer);
};

export default initPlayerService;
