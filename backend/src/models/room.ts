class Room {
    roomCode: string;
    owner: string;
    users: Set<string>;
    userCount: number;

    static MAX_ROOM_CAPACITY = 10;
    constructor(roomCode, owner) {
        this.roomCode = roomCode;
        this.users = new Set();
        this.owner = owner;
        this.userCount = 0;
    }

    addUser(userId) {
        this.users.add(userId);
        this.userCount++;
    }

    removeUser(userId) {
        this.users.delete(userId);
        this.userCount--;
    }

    getUsers() {
        return this.users;
    }

    getRoomCode() {
        return this.roomCode;
    }

    getOwner() {
        return this.owner;
    }

    getUserCount() {
        return this.userCount;
    }

    empty() {
        return this.userCount === 0;
    }

    isFull() {
        return this.userCount === Room.MAX_ROOM_CAPACITY;
    }
}

export default Room;
