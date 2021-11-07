/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
    faCaretDown,
    faCaretUp,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "src/hooks/typedReduxHooks";
import { leaveRoom, receiveRoomUpdates } from "src/stores/room";

import "./index.css";

const UserInfoComponent: React.FC = () => {
    const dispatch = useAppDispatch();
    const [showDetails, setShowDetails] = useState(false);

    const toggleShowDetails = () => {
        setShowDetails(!showDetails);
    };

    useEffect(() => {
        dispatch(receiveRoomUpdates()).catch(() => console.log("error"));
    }, [dispatch]);

    const users = useAppSelector((state) => state.room.users);
    const userCount = useAppSelector((state) => state.room.userCount);

    // TODO: Add a listing of all members in the room, highlight host and current user
    const getDetails = () => {
        return (
            <div>
                <p className="user-title my-2">
                    {users?.map((user, index) => {
                        let output = user.username;

                        if (user.isOwner) output += " (Owner)";

                        if (userCount && index !== userCount - 1)
                            output += ", ";

                        return output;
                    })}
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
                    <p className="m-0 user-title my-auto me-2">
                        {userCount} / 10
                    </p>
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
