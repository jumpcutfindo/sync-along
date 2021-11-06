class Room {
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

  empty() {
    return this.userCount === 0;
  }
}

export default Room;