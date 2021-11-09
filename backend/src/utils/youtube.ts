import Song from "src/models/song";
import axios from "axios";

const API_URL: string = "https://youtube.googleapis.com/youtube/v3/videos";

class YouTubeAPI {
    static async populateSong(song: Song): Promise<Song> {
        const requestURL = this.generateRequest(song.getUrl());
        
        return axios.get(requestURL).then((response) => {
            if (response.data.items && response.data.items[0]) {
                const snippet = response.data.items[0].snippet;

                const title = snippet.title;
                const thumbnail = snippet.thumbnails.medium.url;

                song.setDetails(title, thumbnail);
                return song;
            }

            return song;
        });
    };

    static generateRequest(url: string): string {
        const id = url.split("v=")[1];

        return API_URL + `?part=snippet&id=${id}&key=${process.env.YOUTUBE_API_KEY}`;
    }
}

export default YouTubeAPI;
