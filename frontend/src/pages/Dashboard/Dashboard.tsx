import React, { useEffect, useState, useRef } from "react";
import { useAppDispatch } from "src/hooks/typedReduxHooks";
import { Overlay } from "react-bootstrap";
import useInputState from "src/hooks/useInputState";
import useNavigator from "src/hooks/useNavigator";
import roomApi from "src/services/room";

import { storeRoomCode } from "src/stores/room";

const Dashboard: React.FC = () => {
    const dispatch = useAppDispatch();
    const joinRoomRef = useRef(null);
    const [isShowPopover, setShowPopover] = useState(false);
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

    const joinRoom = (event: React.FormEvent) => {
        event.preventDefault();
        dispatch(storeRoomCode(data?.roomCode));
        navToRoom(roomCode);
    };

    useEffect(() => {
        if (!isLoading && isSuccess) {
            dispatch(storeRoomCode(data?.roomCode));
            navToRoom(data?.roomCode);
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
                            <form onSubmit={joinRoom}>
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
