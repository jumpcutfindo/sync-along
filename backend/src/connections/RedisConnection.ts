import redis from "redis";

class RedisConnection {
  private static connection;

  public static getConnection() {
    if (!this.connection) {
      this.connection = redis.createClient({
        url: process.env.REDIS_URL,
      });
    }
    return this.connection;  
  }

  public static disconnect() {
    if (this.connection) {
      this.connection.quit();
      this.connection = undefined;
    }
  }
}

export default RedisConnection;