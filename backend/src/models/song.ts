interface ISong {
    id: number;
    url: string;
}
class Song implements ISong {
    id: number;
    url: string;
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
}
export default Song;
