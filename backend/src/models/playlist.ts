import Song from "./song";
interface IPlaylist {
    roomCode: string;
    songs: Song[];
    activeSong: Song;
    nextId: number;

    addSong;
    removeSong;
    setActiveSong;
    getNextId();
    nextSong();
    prevSong();
}

class Playlist implements IPlaylist {
    roomCode: string;
    songs: Song[];
    activeSong: Song;
    nextId: number;
    constructor(roomCode: string) {
        this.roomCode = roomCode;
        this.songs = [];
        this.activeSong = undefined;
        this.nextId = 0;
    }

    getSongs() {
        return this.songs;
    }

    getActiveSong() {
        return this.activeSong;
    }

    addSong(song: Song) {
        this.songs.push(song);

        if (!this.activeSong && this.songs.length > 0)
            this.activeSong = this.songs[0];
    }

    removeSong(id: number) {
        const songToRemove = this.songs.find((song) => song.id === id);

        if (songToRemove === this.activeSong) {
            this.activeSong = this.songs[0];
        }

        this.songs = this.songs.filter((s) => s.id !== id);
    }

    setActiveSong(id: number) {
        this.activeSong = this.songs.find((song) => song.id === id);
    }

    getNextId() {
        const temp = this.nextId++;
        return temp.toString();
    }

    nextSong() {
        if (!this.activeSong) return;
        const nextIndex =
            this.songs.findIndex((song) => this.activeSong.id === song.id) + 1;

        if (nextIndex >= this.songs.length) this.activeSong = this.songs[0];
        else this.activeSong = this.songs[nextIndex];
    }

    prevSong() {
        if (!this.activeSong) return;

        const prevIndex =
            this.songs.findIndex((song) => this.activeSong.id === song.id) - 1;
        if (prevIndex < 0) this.activeSong = this.songs[0];
        else this.activeSong = this.songs[prevIndex];
    }
}

export default Playlist;
