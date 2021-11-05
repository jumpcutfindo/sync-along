const formatMessage = require("../utils/messages");

const {
    userJoin,
    userLeave,
    getRoomUsers,
} = require("../utils/users");

const {
    addRoomPlaylistEntry,
    addRoomPlayerEntry
} = require("./player");

const initRoomService = (io, socket) => {
    socket.on("joinRoom", ({ username, room }, callback) => {
        const user = userJoin(socket.id, username, room);
        console.log(`${username} has joined ${room}!`);
        socket.join(user.room);

        // Welcome current user
        socket.emit("message", formatMessage("Sync-Along", "Welcome to Sync-Along!"));

        // Send users and room info
        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room),
        });

        // Add a player and playlist entry
        addRoomPlaylistEntry(user.room);
        addRoomPlayerEntry(user.room);

        callback({
            status: "ok",
        });
    });

    // Runs when client disconnects
    socket.on("disconnect", ({}, callback) => {
        const user = userLeave(socket.id);

        if (user) {
            // Send users and room info
            io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: getRoomUsers(user.room),
            });
            callback({
                status: "ok",
            });
        } else {
            callback({
                status: "user not here",
            });
        }
    });
};

module.exports = {
    initRoomService,
};
