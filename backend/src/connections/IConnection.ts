export interface IConnection {
}

export interface IConnectionConstructor<Conn> {
  new(): IConnection;
  getConnection(): Promise<Conn> | Conn;
  disconnect(): unknown;
}