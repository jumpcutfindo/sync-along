/**
 * Defining endpoints for the room chat service
 */

import { ServiceEntryHandler } from "src/server";

import ChatController from "src/controllers/chat";
const CLIENT_CHAT_MESSAGE_EVENT = "chat/message";

const initChatService: ServiceEntryHandler = (io, socket) => {
    const chatController = new ChatController(io, socket);
    socket.on(CLIENT_CHAT_MESSAGE_EVENT, chatController.handleChatMessage);
};

export default initChatService;
