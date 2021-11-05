const {
    Player, getPlayerUpdateData
} = require("../utils/player");

const {
    Song, Playlist, getPlaylistUpdateData
} = require("../utils/playlist");

const {
    getCurrentUser,
} = require("../utils/users");

const roomPlayerMap = {};
const roomPlaylistMap = {};

const initPlaylistService = (io, socket) => {
    socket.on("playlist/add", ({ url }, callback) => {
        const user = getCurrentUser(socket.id);

        console.log(`playlist/add called by ${user.id} (adding: ${url})`);

        if (user) {
            const roomPlaylist = roomPlaylistMap[user.room];
            roomPlaylist.addSong(new Song(roomPlaylist.getNextId(), url))

            io.to(user.room).emit("playlist/update", getPlaylistUpdateData(roomPlaylist));
        }
    });

    socket.on("playlist/remove", ({ id }, callback) => {
        const user = getCurrentUser(socket.id);
        console.log(`playlist/remove called by ${user.id} (removing: ${id})`);

        if (user) {
            const roomPlaylist = roomPlaylistMap[user.room];
            roomPlaylist.removeSong(id);
            
            io.to(user.room).emit("playlist/update", getPlaylistUpdateData(roomPlaylist));
        }
    });

    socket.on("playlist/select", ({ id }, callback) => {
        const user = getCurrentUser(socket.id);
        console.log(`playlist/select called by ${user.id} (selecting: ${id})`);

        if (user) {
            const roomPlaylist = roomPlaylistMap[user.room];
            roomPlaylist.setActiveSong(id);
            resetSongProgress(io, socket);

            io.to(user.room).emit("playlist/update", getPlaylistUpdateData(roomPlaylist));
        }
    });

    socket.on("playlist/next", (undefined, callback) => {
        const user = getCurrentUser(socket.id);

        console.log(`playlist/next called by ${user.id}`);
        if (user) {
            const roomPlaylist = roomPlaylistMap[user.room];
            roomPlaylist.nextSong();
            resetSongProgress(io, socket);
            
            io.to(user.room).emit("playlist/update", getPlaylistUpdateData(roomPlaylist));
        }
    });
    
    socket.on("playlist/prev", (undefined, callback) => {
        const user = getCurrentUser(socket.id);

        console.log(`playlist/prev called by ${user.id}`);
        if (user) {
            const roomPlaylist = roomPlaylistMap[user.room];
            roomPlaylist.prevSong();
            resetSongProgress(io, socket);
            
            io.to(user.room).emit("playlist/update", getPlaylistUpdateData(roomPlaylist));
        }
    });
};

const initPlayerService = (io, socket) => {
    socket.on("player/play", (time, callback) => {
        const user = getCurrentUser(socket.id);

        console.log(`player/play called by ${user.id}`);

        if (user) {
            const roomPlayer = roomPlayerMap[user.room];
            roomPlayer.scrubTo(time);
            roomPlayer.setPlaying(true);

            io.to(user.room).emit("player/update", getPlayerUpdateData(roomPlayer));
        }
    });

    socket.on("player/pause", (time, callback) => {
        const user = getCurrentUser(socket.id);

        console.log(`player/play called by ${user.id}`);

        if (user) {
            const roomPlayer = roomPlayerMap[user.room];
            roomPlayer.scrubTo(time);
            roomPlayer.setPlaying(false);

            io.to(user.room).emit("player/update", getPlayerUpdateData(roomPlayer));
        }
    });

    socket.on("player/scrub", (time, callback) => {
        const user = getCurrentUser(socket.id);

        console.log(`player/scrub called by ${user.id}`);

        if (user) {
            const roomPlayer = roomPlayerMap[user.room];
            roomPlayer.scrubTo(time);
            roomPlayer.setPlaying(true);

            io.to(user.room).emit("player/update", getPlayerUpdateData(roomPlayer));
        }
    });

    socket.on("player/complete", (time, callback) => {
        const user = getCurrentUser(socket.id);
        
        console.log(`player/complete called by ${user.id}`);

        if (user) {
            const roomPlayer = roomPlayerMap[user.room];
            roomPlayer.addToWaiting();

            if (roomPlayer.canContinuePlaying(io.sockets.adapter.rooms.get(user.room).size)) {
                playlistNext(io, socket);
            }
        }
    });
};

const addRoomPlaylistEntry = (roomCode) => {
    if(!roomPlaylistMap[roomCode]) roomPlaylistMap[roomCode] = new Playlist(roomCode);

    console.log(`Added a room-playlist mapping, roomPlaylistMap now has ${Object.keys(roomPlaylistMap)}`);
};

const playlistNext = (io, socket) => {
    const user = getCurrentUser(socket.id);

    if (user) {
        const roomPlaylist = roomPlaylistMap[user.room];
        roomPlaylist.nextSong();
        resetSongProgress(io, socket);
    
        io.to(user.room).emit("playlist/update", getPlaylistUpdateData(roomPlaylist));
    }
};

const removeRoomPlaylistEntry = (roomCode) => {
    delete roomPlaylistMap[roomCode];
    console.log(`Removed a room-playlist mapping, roomPlaylistMap looks like this: ${roomPlaylistMap}`);
};

const resetSongProgress = (io, socket) => {
    const user = getCurrentUser(socket.id);

    if (user) {
        const roomPlayer = roomPlayerMap[user.room];
        roomPlayer.scrubTo(0);
        io.to(user.room).emit("player/update", getPlayerUpdateData(roomPlayer));
    }
};

const addRoomPlayerEntry = (roomCode) => {
    if (!roomPlayerMap[roomCode]) roomPlayerMap[roomCode] = new Player();

    console.log(`Added a room-player mapping, roomPlayerMap now has ${Object.keys(roomPlayerMap)}`);
};

module.exports = {
    initPlayerService, initPlaylistService, addRoomPlayerEntry, addRoomPlaylistEntry, resetSongProgress,
};