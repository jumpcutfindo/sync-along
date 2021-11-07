import React, { useEffect } from "react";

import { useAppSelector } from "src/hooks/typedReduxHooks";
import { useDispatch } from "react-redux";
import { leaveRoom } from "src/stores/room";

import ChatComponent from "./Chat";
import PlayerComponent from "./Player";
import PlaylistComponent from "./Playlist";
import RoomInfoComponent from "./RoomInfo";

import "./Room.css";

const RoomScreen: React.FC = () => {
    const dispatch = useDispatch();
    const roomCode = useAppSelector((state) => state.room.roomCode);

    useEffect(() => {
        if (roomCode === undefined) dispatch(leaveRoom());
    }, [dispatch, roomCode]);

    return (
        <div className="RoomScreen d-flex w-100 h-100">
            <div className="PlayerColumn d-flex flex-column h-100">
                <div className="PlaylistComponentContainer">
                    <PlaylistComponent />
                </div>
                <div className="PlayerComponentContainer">
                    <PlayerComponent />
                </div>
            </div>
            <div className="vertical-divider" />
            <div className="ChatColumn d-flex flex-column h-100">
                <div className="RoomInfoComponentContainer">
                    <RoomInfoComponent />
                </div>
                <hr className="m-0" />
                <div className="ChatComponentContainer flex-grow-1">
                    <ChatComponent />
                </div>
            </div>
        </div>
    );
};

export default RoomScreen;
