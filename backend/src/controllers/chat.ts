import ChatService from "src/services/chat/service";
import { IO, SocketType } from "src/server";
/**
 * A Controller that handles chat messages from web clients
 */

interface IChatController {
    io: IO;
    socket: SocketType;
    service: ChatService;
    handleChatMessage: (message: string) => Promise<void>;
}
class ChatController implements IChatController {
    io: IO;
    socket: SocketType;
    service: ChatService;
    constructor(io: IO, socket: SocketType) {
        this.io = io;
        this.socket = socket;
        this.service = new ChatService();
    }

    handleChatMessage = async (message: string) => {
        if (message.length !== 0) {
            const {room, message: formattedMessage} = await this.service.handleChatMessage(this.socket.id, message);
            if (room) {
                this.io
                    .to(room)
                    .emit("message", formattedMessage);
            }
        }
    };
}

export default ChatController;
