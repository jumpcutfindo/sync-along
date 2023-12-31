import PlayerDao from "src/dao/playerDao";
import RoomDao from "src/dao/roomDao";
import PlaylistRepo from "src/services/playlist/playlistRepo";
class PlayerRepo {
    static async play(room: string, time: number) {
        const player = await PlayerDao.find(room);
        player.scrubTo(time);
        player.setPlaying(true);
        await PlayerDao.save(player);
        return player;
    }

    static async pause(room: string, time: number) {
        const player = await PlayerDao.find(room);
        player.scrubTo(time);
        player.setPlaying(false);
        await PlayerDao.save(player);
        return player;
    }

    static async scrub(room: string, time: number) {
        const player = await PlayerDao.find(room);
        player.scrubTo(time);
        player.setPlaying(true);
        await PlayerDao.save(player);
        return player;
    }

    static async complete(room: string) {
        const player = await PlayerDao.find(room);
        player.addToWaiting();
        await PlayerDao.save(player);
        const foundRoom = await RoomDao.find(room);
        const userCount = foundRoom.getUserCount();
        if (player.canContinuePlaying(userCount)) {
            console.log("playing next song");
            await PlaylistRepo.playNextSong(room);
        }
        return player;
    }

    static async resetSong(room: string) {
        const player = await PlayerDao.find(room);
        player.scrubTo(0);
        await PlayerDao.save(player);
        return player;
    }

    static async getPlayerUpdateStatus(room: string) {
        const player = await PlayerDao.find(room);
        return JSON.stringify(player);
    }
}

export default PlayerRepo;
