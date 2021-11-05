const mongoose = require('mongoose');

class MongodbConnection {
  static connection;

  static getConnection() {
    if (!this.connection) {
      this.connection = mongoose.connect(process.env.DB_CONNECTION, {
        useNewUrlParser: true
      }, () => console.log("Connected to MongoDB!"));
    }
    return this.connection;
  }

  static disconnect() {
    if (this.connection) {
      this.connection.disconnect();
      this.connection = undefined;
    }
  }
}

module.exports = {MongodbConnection};