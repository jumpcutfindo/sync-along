import mongoose, { Connection } from "mongoose";

type MongoConnection = Connection;

const MongodbConnection = class {
    private static connection: MongoConnection;

    public static async getConnection(): Promise<MongoConnection> {
        if (!this.connection) {
            await mongoose.connect(process.env.DB_CONNECTION, () =>
                console.log("MongoDB database Ready!")
            );
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
