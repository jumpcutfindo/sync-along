import { createClient } from "redis";
import { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } from "../constants/env";

type RedisConn = ReturnType<typeof createClient>;
class RedisConnection {
    private static connection: RedisConn;

    public static getConnection(): RedisConn {
        if (!this.connection) {
            const client = createClient({
                host: REDIS_HOST,
                port: REDIS_PORT,
                password: REDIS_PASSWORD
            });

            client.on('error', (err) => {
                console.log('Redis connection fails: ', err);
                console.log('Error: ', err);
            });

            client.on('connect', () => {
                console.log('Redis connection established');
            });

            this.connection = client;
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
