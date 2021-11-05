export interface IConnection {
}

export interface IConnectionConstructor {
  new(): IConnection;
  getConnection();
  disconnect();
}