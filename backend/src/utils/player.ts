class Player {
    constructor() {
        this.lastScrubTime = 0;
        this.lastUpdateTime = Date.now();
        this.isPlaying = false;

        this.waiting = 0;
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