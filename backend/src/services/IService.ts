import {IO, SocketType} from "../server";
export interface IServiceController<Service> {
  new(io: IO, socket: SocketType): Service;
}

export type StaticImplements<I extends new (...args: any[]) => any, C extends I> = InstanceType<I>;
