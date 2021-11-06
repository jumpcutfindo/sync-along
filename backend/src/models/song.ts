interface ISong {
    id: number;
    url: string;
}
class Song implements ISong {
    id;
    url;
    constructor(id: number, url: string) {
        this.id = id;
        this.url = url;
    }
}
export default Song;
