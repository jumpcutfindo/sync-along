export class Playlist {
    constructor(roomCode) {
        this.roomCode = roomCode;
        this.songs = [];
        this.activeSong = undefined;
        this.nextId = 0;
    }

    addSong(song) {
        this.songs.push(song);

        if (!this.activeSong && this.songs.length > 0) this.activeSong = this.songs[0];
    }

    removeSong(id) {
        const songToRemove = this.songs.find(song => song.id === id);

        if (songToRemove === this.activeSong) {
            this.activeSong = this.songs[0];
        }

        this.songs = this.songs.filter(s => s.id !== id);
    }

    setActiveSong(id) {
        this.activeSong = this.songs.find(song => song.id === id);
    }

    getNextId() {
        const temp = this.nextId++;
        return temp.toString();
    }

    nextSong() {
        if (!this.activeSong) return;
        const nextIndex = this.songs.findIndex(song => this.activeSong.id === song.id) + 1;

        if (nextIndex >= this.songs.length) this.activeSong = this.songs[0];
        else this.activeSong = this.songs[nextIndex];
    }

    prevSong() {
        if (!this.activeSong) return;

        const prevIndex = this.songs.findIndex(song => this.activeSong.id === song.id) - 1;
        if (prevIndex < 0) this.activeSong = this.songs[0];
        else this.activeSong = this.songs[prevIndex];
    }
}

export class Song {
    constructor(id, url) {
        this.id = id;
        this.url = url;
    }
}

export function getPlaylistUpdateData(playlist) {
    return JSON.stringify({
        playlist: playlist.songs,
        current: playlist.activeSong 
    });
};
