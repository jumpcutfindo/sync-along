/**
 * Controller for the Room Service
 * Interfaces with subsystems of the backend.
 */

import { generateRoomCode } from "./utils";
import RoomRepo from "./roomRepo";
import {
    NO_USERNAME_PROVIDED,
    ERROR_JOINING_ROOM,
    MISSING_ROOM_CODE_USERNAME,
    ROOM_NOT_FOUND,
    SUCCESSFUL_LEFT_ROOM,
    ERROR_LEFT_ROOM,
    ROOM_IS_FULL,
} from "./constants";
import { IO, SocketType } from "src/server";
import StatusDispatcher from "src/StatusDispatcher";

class RoomController {
    io: IO;
    socket: SocketType;
    statusDispatcher: StatusDispatcher;
    constructor(io: IO, socket: SocketType) {
        this.socket = socket;
        this.io = io;
        this.statusDispatcher = new StatusDispatcher(io, socket);
    }

    handleCreateRoom = async ({ username }, callback) => {
        if (!username) {
            return callback({
                status: 400,
                isSuccessful: false,
                message: NO_USERNAME_PROVIDED,
            });
        }

        let generatedCode = generateRoomCode();
        while (await RoomRepo.doesRoomExist(generatedCode)) {
            generatedCode = generateRoomCode();
        }
        RoomRepo.addUserToRoom(this.socket.id, generatedCode)
            .then(() =>
                RoomRepo.addUserToRoomCache(
                    this.socket.id,
                    username,
                    generatedCode
                )
            )
            .then(() => this.socket.join(generatedCode))
            .then(() =>
                callback({
                    status: 200,
                    code: generatedCode,
                })
            )
            .then(async () => await this.statusDispatcher.dispatchRoomUpdate(generatedCode))
            .catch(() =>
                callback({
                    status: 400,
                    message: ERROR_JOINING_ROOM,
                })
            );
    };

    handleJoinRoom = async ({ username, room }, callback) => {
        if (!(username && room)) {
            return callback({
                status: 400,
                isSuccessful: false,
                message: MISSING_ROOM_CODE_USERNAME,
            });
        }

        const roomExists = await RoomRepo.doesRoomExist(room);
        if (!roomExists) {
            return callback({
                status: 400,
                isSuccessful: false,
                message: ROOM_NOT_FOUND,
            });
        }
        try {
            const isRoomFull = await RoomRepo.isRoomFull(room);
            if (isRoomFull) {
                return callback({
                    status: 400,
                    isSuccessful: false,
                    message: ROOM_IS_FULL,
                });
            }
            await RoomRepo.addUserToRoom(this.socket.id, room);
            await RoomRepo.addUserToRoomCache(this.socket.id, username, room);
            this.socket.join(room);
            callback({
                status: 200,
                isSuccessful: true,
            });
            await this.statusDispatcher.dispatchRoomUpdate(room);
            await this.statusDispatcher.dispatchPlayerUpdate(room);
            await this.statusDispatcher.dispatchPlaylistUpdate(room);
        } catch (err) {
            console.log(err);
        }
    };

    handleLeaveRoom = async (_: unknown, callback) => {
        try {
            const { room } = await RoomRepo.getUser(this.socket.id);
            const isOwnerOfRoom = await RoomRepo.isOwner(this.socket.id, room);
            if (isOwnerOfRoom) {
                const users = await RoomRepo.getUsersInRoom(room);
                for (const user of users) {
                    await RoomRepo.removeUserFromRoom(user, room);
                    await RoomRepo.removeUserFromRoomCache(user);
                }
                await this.statusDispatcher.dispatchRoomUpdate(room);
                this.io.in(room).socketsLeave(room);
                callback({
                    status: 200,
                    isSuccessful: true,
                    message: SUCCESSFUL_LEFT_ROOM,
                });
            } else {
                await RoomRepo.removeUserFromRoom(this.socket.id, room);
                await RoomRepo.removeUserFromRoomCache(this.socket.id);
                this.socket.leave(room);
                await this.statusDispatcher.dispatchRoomUpdate(room);
            }
        } catch {
            return callback({
                status: 400,
                isSuccessful: false,
                message: ERROR_LEFT_ROOM,
            });
        }
    };

    handleDisconnect = async (reason: string) => {
        console.log(reason);
        // passing in a no-op call back to reuse the function for disconnecting the user
        this.handleLeaveRoom(undefined, (status) => console.log(status))
    }
}

export default RoomController;
