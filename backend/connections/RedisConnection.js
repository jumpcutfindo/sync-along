const redis = require("redis");

class RedisConnection {
  static connection;

  static getConnection() {
    if (!this.connection) {
      this.connection = redis.createClient({
        url: process.env.REDIS_URL,
      });
    }
    return this.connection;  
  }

  static disconnect() {
    if (this.connection) {
      this.connection.quit();
      this.connection = undefined;
    }
  }
}

module.exports = {RedisConnection};