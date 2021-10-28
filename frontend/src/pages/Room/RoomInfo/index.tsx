import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useAppSelector } from "src/hooks/typedReduxHooks";

import "./index.css";

const RoomInfoComponent: React.FC = () => {
    const roomData = useAppSelector((state) => state.room);

    return (
        <div className="RoomInfoComponent d-flex flex-column text-start">
            <div className="p-2">
                <h3 className="m-0">
                    ROOM <u>{roomData.roomCode}</u>
                </h3>
            </div>
            <hr className="m-0" />
            <div className="d-flex p-2">
                <FontAwesomeIcon
                    className="player-control-button my-auto me-2"
                    icon={faUser}
                    color="white"
                />
                <p className="m-0 user-title">Users</p>
            </div>
        </div>
    );
};

export default RoomInfoComponent;
