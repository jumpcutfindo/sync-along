interface IPlayer {
    roomCode: string;
    lastScrubTime: number;
    lastUpdateTime: Date;
    isPlaying: boolean;
    waiting: number;

    scrubTo: (time: number) => void;
    setPlaying: (isPlaying: boolean) => void;
    addToWaiting: () => void;
    canContinuePlaying: (userCount: number) => boolean;
}
class Player implements IPlayer {
    roomCode;
    lastScrubTime;
    lastUpdateTime;
    isPlaying;
    waiting;
    constructor(roomCode: string) {
        this.roomCode = roomCode;
        this.lastScrubTime = 0;
        this.lastUpdateTime = Date.now();
        this.isPlaying = false;
        this.waiting = 0;
    }

    getRoomCode() {
        return this.roomCode;
    }

    scrubTo(time) {
        this.lastScrubTime = time;
        this.lastUpdateTime = Date.now();
    }

    setPlaying(isPlaying) {
        this.isPlaying = isPlaying;
        this.lastUpdateTime = Date.now();
    }

    addToWaiting() {
        this.waiting++;
    }

    canContinuePlaying(userCount) {
        const flag = userCount === this.waiting;
        if (flag) this.waiting = 0;

        return flag;
    }
}

export function getPlayerUpdateData(player) {
    return JSON.stringify(player);
}

export default Player;
