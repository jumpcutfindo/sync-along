import {connect} from 'mongoose';
import {IConnectionConstructor} from './IConnection';

type MongoConnection = ReturnType<typeof connect>;

const MongodbConnection: IConnectionConstructor<MongoConnection> = class {
  private static connection: MongoConnection;

  public static getConnection() {
    if (!this.connection) {
      this.connection = connect(process.env.DB_CONNECTION, {
        useNewUrlParser: true
      }, () => console.log("Connected to MongoDB!"));
    }
    return this.connection;
  }

  public static test() {
    
  }

  public static disconnect() {
    if (this.connection) {
      this.connection.disconnect();
      this.connection = undefined;
    }
  }
}

export default MongodbConnection;