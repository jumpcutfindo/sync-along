interface ISong {
    id: number;
    url: string;
    title?: string;
    thumbnail?: string;
}
class Song implements ISong {
    id: number;
    url: string;
    title: string;
    thumbnail: string;

    constructor(id: number, url: string) {
        this.id = id;
        this.url = url;
    }

    getId() {
        return this.id;
    }

    getUrl() {
        return this.url;
    }

    setDetails(title, thumbnail) {
        this.title = title;
        this.thumbnail = thumbnail;
    }
}
export default Song;
