class User {
  id: string;
  username: string;
  room: string;
  constructor(id, username, room) {
    this.id = id;
    this.username = username;
    this.room = room;
  }

  get getId() {
    return this.id;
  }

  get getRoom() {
    return this.room;
  }
}

export default User;