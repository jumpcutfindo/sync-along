class User {
  id: string;
  username: string;
  room: string;
  constructor(id, username, room) {
    this.id = id;
    this.username = username;
    this.room = room;
  }

  getId() {
    return this.id;
  }

  getRoom() {
    return this.room;
  }

  getUsername() {
    return this.username;
  }
}

export default User;