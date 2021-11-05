import {IConnectionConstructor} from "connections/IConnection";
import {createClient} from "redis";

type RedisConn = ReturnType<typeof createClient>;
const RedisConnection: IConnectionConstructor<RedisConn> = class {
  private static connection: RedisConn;

  public static getConnection() {
    if (!this.connection) {
      this.connection = createClient({
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