import {formatMessage} from "./utils";
import {getCurrentUser} from "./chatDao";
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

export default ChatController;