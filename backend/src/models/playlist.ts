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

    getRoomCode() {
        return this.roomCode;
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
        const songToRemove = this.songs.find((song) => {
            return song.getId() === Number(id);
        });
        this.songs = this.songs.filter((s) => s.getId() !== Number(id));
        if (songToRemove.getId() === this.activeSong.getId()) {
            this.activeSong = this.songs.length === 0 ? undefined : this.songs[0];
        }
    }

    setActiveSong(id: number) {
        this.activeSong = this.songs.find(
            (song) => song.getId() === Number(id)
        );
    }

    getNextId() {
        const temp = this.nextId++;
        return temp;
    }

    nextSong() {
        if (!this.activeSong) return;
        const nextIndex =
            this.songs.findIndex(
                (song) => this.activeSong.getId() === song.getId()
            ) + 1;

        if (nextIndex >= this.songs.length) this.activeSong = this.songs[0];
        else this.activeSong = this.songs[nextIndex];
    }

    prevSong() {
        if (!this.activeSong) return;

        const prevIndex =
            this.songs.findIndex(
                (song) => this.activeSong.getId() === song.getId()
            ) - 1;
        if (prevIndex < 0) this.activeSong = this.songs[0];
        else this.activeSong = this.songs[prevIndex];
    }
}

export default Playlist;
