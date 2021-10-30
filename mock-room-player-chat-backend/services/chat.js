const formatMessage = require("../utils/messages");
const {
    getCurrentUser,
} = require("../utils/users");

const initChatService = (io, socket) => {
    // Listen for chatMessage
    socket.on("chatMessage", (msg) => {
        const user = getCurrentUser(socket.id);
        console.log(user);
        if (user) {
            io.to(user.room).emit("message", formatMessage(user.username, msg));
        }
    });
};

module.exports = {
    initChatService,
};
