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
export class Playlist implements IPlaylist {
    roomCode;
    songs;
    activeSong;
    nextId;
    constructor(roomCode: string) {
        this.roomCode = roomCode;
        this.songs = [];
        this.activeSong = undefined;
        this.nextId = 0;
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

interface ISong {
    id: number;
    url: string;
}
export class Song implements ISong {
    id;
    url;
    constructor(id: number, url: string) {
        this.id = id;
        this.url = url;
    }
}

export function getPlaylistUpdateData(playlist) {
    return JSON.stringify({
        playlist: playlist.songs,
        current: playlist.activeSong,
    });
}

export function validateYouTubeUrl(urlToParse) {
    if (urlToParse) {
        var regExp =
            /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        if (urlToParse.match(regExp)) {
            return true;
        }
    }
    return false;
}
