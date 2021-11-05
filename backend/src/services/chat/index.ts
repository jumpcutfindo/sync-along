/**
 * Defining endpoints for the room chat service
 */

import {ServiceEntryHandler} from "server";

const {ChatController} = require("./controller");
const CLIENT_CHAT_MESSAGE_EVENT = "chat/message";
const SERVER_CHAT_MESSAGE_EVENT = "message";

const initChatService: ServiceEntryHandler = (io, socket) => {
  console.log("in chat service")
  const chatController = new ChatController(io, socket);
  socket.on(CLIENT_CHAT_MESSAGE_EVENT, chatController.handleChatMessage);
}

export default initChatService;