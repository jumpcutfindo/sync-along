const express = require('express');
const router = express.Router();
const Playlist = require('../models/PlaylistModel');

const initPlaylistService = (app) => {

    /*
    Object example
        {
            "_id": "61824b02271b3d031b1c4501",
            "username": "dongy",
            "url": "https://www.youtube.com/watch?v=vjf774RKrLc",
            "__v": 0
        }
    */

    //GETS ALL THE PLAYLISTS
    app.get('/playlist', async (req, res) => {
        try {
            const playlist = await Playlist.find();
            res.json(playlist);
        } catch(err) {
            res.json({message: err});
        }
    });
    
    //ADD A PLAYLIST FOR A USER
    // req.body = {username, url}
    app.post('/playlist/add', async (req, res) => {
        const playlist = new Playlist({
            username: req.body.username,
            url: req.body.url,
        });
        
        try{
            const savedPlaylist = await playlist.save();
            res.json(savedPlaylist);
        } catch(err) {
            res.json({message: err});
        }
    });

    //GET SPECIFIC USER'S PLAYLIST
    // req.body = {username}
    app.get('/playlist/specific', async (req, res) => {
        const username = req.body.username;
        try {
            const playlist = await Playlist.find({username: username});
            res.json(playlist);
        } catch(err) {
            res.json({message: err});
        }
    });

    //DELETE POST
    // req.body = {id}
    app.delete('/playlist/delete', async (req,res) => {
        const id = req.body.id;
        try {
            const playlist = await Playlist.remove({_id: id});
            res.json(playlist);
        } catch(err) {
            res.json({message: err});
        }
    });
}

module.exports = {initPlaylistService};