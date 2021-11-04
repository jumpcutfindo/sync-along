const mongoose = require('mongoose');

const PlaylistSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Playlists', PlaylistSchema);