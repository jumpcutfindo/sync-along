import React, { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "src/hooks/typedReduxHooks";
import { Overlay } from "react-bootstrap";
import useInputState from "src/hooks/useInputState";
import useNavigator from "src/hooks/useNavigator";
import roomApi from "src/services/room";

import { joinRoom as joinRoomAction } from "src/stores/chat";
import { storeRoomCode } from "src/stores/room";

const Dashboard: React.FC = () => {
    const dispatch = useAppDispatch();
    const joinRoomRef = useRef(null);
    const [isShowPopover, setShowPopover] = useState(false);
    const user = useAppSelector((state) => state.app.user);
    const { navToRoom } = useNavigator();
    const togglePopover = () => {
        setShowPopover(!isShowPopover);
    };
    const [roomCode, onChangeRoomCode] = useInputState("");

    const [generateRoomCode, { data, isLoading, isSuccess }] =
        roomApi.endpoints.generateRoomCode.useMutation();

    const createNewRoom = (event: React.FormEvent) => {
        event.preventDefault();
        generateRoomCode({ accessToken: "test" });
    };

    // TODO: add error handling
    const joinRoom = (room: string) => {
        dispatch(storeRoomCode(room));
        if (user && room) {
            dispatch(joinRoomAction({ username: user.name, room }))
                .then(() => navToRoom(room))
                .catch(() => console.log("cannot join room!"));
        }
    };

    const joinExistingRoom = (event: React.FormEvent) => {
        event.preventDefault();
        joinRoom(roomCode);
    };

    useEffect(() => {
        if (!isLoading && isSuccess) {
            const room = data?.roomCode;
            // TODO: replace with error in the UI
            if (!room) {
                console.log("API did not return room");
            } else {
                joinRoom(room);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, isSuccess]);

    return (
        <div className="DashboardScreen d-flex mb-2">
            <div className="m-auto d-flex flex-column">
                <h1 className="my-3">Sync-Along</h1>
                <div className="d-flex mx-auto">
                    <button
                        type="button"
                        className="btn btn-success me-2"
                        onClick={createNewRoom}
                    >
                        Create Room
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={togglePopover}
                        ref={joinRoomRef}
                    >
                        Join Room
                    </button>
                    <Overlay
                        target={joinRoomRef.current}
                        show={isShowPopover}
                        placement="bottom"
                        transition={false}
                    >
                        <div className="p-3 mt-2">
                            <p className="mb-2">
                                <b>Enter room code: </b>
                            </p>
                            <form onSubmit={joinExistingRoom}>
                                <input
                                    className="form-control mb-2"
                                    placeholder="Eg: 1234"
                                    value={roomCode}
                                    onChange={onChangeRoomCode}
                                />
                            </form>
                        </div>
                    </Overlay>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
