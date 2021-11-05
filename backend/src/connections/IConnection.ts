export interface IConnection {
}

export interface IConnectionConstructor<Conn> {
  new(): IConnection;
  getConnection(): Conn;
  disconnect(): unknown;
}