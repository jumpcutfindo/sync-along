import {formatMessage} from "./utils";
import {getUser} from "../room/roomRepo";
import {IO, SocketType} from "../../server";
/**
 * A Controller that handles chat messages from web clients
 */

interface IChatController {
  io: IO;
  socket: SocketType;
  handleChatMessage: (message: string) => Promise<void>;
}
class ChatController implements IChatController {
  io: IO;
  socket: SocketType;
  constructor(io: IO, socket: SocketType) {
    this.io = io;
    this.socket = socket;
  }

  handleChatMessage = async (message: string) => {
    const user = await getUser(this.socket.id);
    if (user) {
      this.io.to(user.getRoom()).emit("message", formatMessage(user.getUsername(), message));
    }
  }
}

export default ChatController;