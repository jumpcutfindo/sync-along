/**
 * Defining endpoints for the room chat service
 */

const {ChatController} = require("./controller");

const CLIENT_CHAT_MESSAGE_EVENT = "chat/message";
const SERVER_CHAT_MESSAGE_EVENT = "message";

const initChatService = (io, socket) => {
  console.log("in chat service")
  const chatController = new ChatController(io, socket);
  socket.on(CLIENT_CHAT_MESSAGE_EVENT, chatController.handleChatMessage);
}

module.exports = {initChatService};