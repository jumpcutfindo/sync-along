import mongoose, { Connection } from "mongoose";
import { MONGODB_CONNECTION_URL } from "../constants/env";

type MongoConnection = Connection;

const MongodbConnection = class {
    private static connection: MongoConnection;

    public static async getConnection(): Promise<MongoConnection> {
        if (!this.connection) {
            try {
                await mongoose.connect(MONGODB_CONNECTION_URL, () =>
                    console.log("MongoDB connection established")
                );
            } catch (err) {
                console.log("Error in connecting to MongoDB database");
                console.log(err);
            }
            this.connection = mongoose.connection;
        }
        return this.connection;
    }

    public static async disconnect(): Promise<void> {
        if (this.connection) {
            await this.connection.close();
            this.connection = undefined;
        }
    }
};

export default MongodbConnection;
