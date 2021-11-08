import { formatMessage } from "./utils";
import RoomRepo from "../room/roomRepo";
/**
 * A ChatService component that handles chat messages from web clients
 */

class ChatService {
    handleChatMessage = async (socketId: string, message: string) => {
        const user = await RoomRepo.getUser(socketId);
        if (user) {
            return {
                room: user.getRoom(),
                message: formatMessage(user.getUsername(), message),
            };
        }
    };
}

export default ChatService;
