const {formatMessage} = require("./utils");
const {getCurrentUser} = require("./chatDao");
/**
 * A Controller that handles chat messages from web clients
 */
class ChatController {
  constructor(io, socket) {
    this.io = io;
    this.socket = socket;
  }

  handleChatMessage = async (message) => {
    const user = await getCurrentUser(this.socket.id);
    if (user) {
      this.io.to(user.room).emit("message", formatMessage(user.username, message));
    }
  }
}

module.exports = {ChatController};