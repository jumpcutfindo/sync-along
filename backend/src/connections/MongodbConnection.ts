import mongoose, {Connection} from 'mongoose';
import {IConnectionConstructor} from './IConnection';

type MongoConnection = Connection;

const MongodbConnection: IConnectionConstructor<MongoConnection> = class {
  private static connection: MongoConnection;

  public static async getConnection() {
    if (!this.connection) {
      await mongoose.connect(process.env.DB_CONNECTION, {
        useNewUrlParser: true
      });
      this.connection = mongoose.connection;
    }
    return this.connection;
  }

  public static async disconnect() {
    if (this.connection) {
      await this.connection.close();
      this.connection = undefined;
    }
  }
}

export default MongodbConnection;