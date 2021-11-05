const mongoose = require('mongoose');

class MongodbConnection {
  static instance = new MongodbConnection();

  connection;
  constructor() {
    this.connection = mongoose.connect(process.env.DB_CONNECTION, {
      useNewUrlParser: true
    }, () => console.log("Connected to MongoDB!"));
  }

  static getInstance() {
    return this.instance;
  }

  static disconnect() {
    if (this.connection) {
      this.connection.disconnect();
    }
  }
}

module.exports = {MongodbConnection};