/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
    faCaretDown,
    faCaretUp,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useAppSelector } from "src/hooks/typedReduxHooks";

import "./index.css";

const UserInfoComponent: React.FC = () => {
    const [showDetails, setShowDetails] = useState(false);

    const toggleShowDetails = () => {
        setShowDetails(!showDetails);
    };

    // TODO: Add a listing of all members in the room, highlight host and current user
    const getDetails = () => {
        return (
            <div>
                <p className="m-0">
                    These are the details of the users in the room
                </p>
            </div>
        );
    };

    // TODO: Add the handling for room users and room user limit
    return (
        <div className="UserInfoComponent d-flex p-2">
            <div
                className="d-flex flex-grow-1 flex-column"
                onClick={toggleShowDetails}
            >
                <div className="d-flex">
                    <FontAwesomeIcon
                        className=" my-auto ms-1 me-2"
                        icon={faUser}
                        color="white"
                    />
                    <p className="m-0 user-title flex-grow-1 text-start">
                        Users
                    </p>
                    <p className="m-0 user-title my-auto me-2">9 / 10</p>
                    <FontAwesomeIcon
                        className="my-auto me-1"
                        icon={showDetails ? faCaretUp : faCaretDown}
                        color="white"
                    />
                </div>
                {showDetails ? getDetails() : null}
            </div>
        </div>
    );
};

const RoomInfoComponent: React.FC = () => {
    const roomData = useAppSelector((state) => state.room);

    return (
        <div className="RoomInfoComponent d-flex flex-column">
            <div className="p-3">
                <h3 className="m-0">
                    ROOM <u>{roomData.roomCode}</u>
                </h3>
            </div>
            <hr className="m-0" />
            <UserInfoComponent />
        </div>
    );
};

export default RoomInfoComponent;
