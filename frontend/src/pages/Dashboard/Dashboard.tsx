import React, { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "src/hooks/typedReduxHooks";
import { Modal } from "react-bootstrap";
import useInputState from "src/hooks/useInputState";
import useNavigator from "src/hooks/useNavigator";
import roomApi from "src/services/room";

import { joinRoom as joinRoomAction } from "src/stores/chat";
import { storeRoomCode } from "src/stores/room";

const JoinRoomModal: React.FC<{
    isShow: boolean;
    toggleShow: () => void;
    joinRoom: (arg0: string) => void;
}> = (props) => {
    const { isShow, toggleShow, joinRoom } = props;

    const [roomCode, onChangeRoomCode] = useInputState("");

    const joinExistingRoom = (event: React.FormEvent) => {
        event.preventDefault();
        joinRoom(roomCode);
    };

    return (
        <Modal className="JoinRoomModal" show={isShow} centered>
            <div className="d-flex-column text-center p-4">
                <h2 className="mb-4">Join Room</h2>
                <p className="mb-2">
                    <b>Room Code</b>
                </p>
                <form onSubmit={joinExistingRoom}>
                    <input
                        className="form-control mb-2"
                        placeholder="Eg: 1234"
                        value={roomCode}
                        onChange={onChangeRoomCode}
                    />
                    <div className="mt-3">
                        <button type="submit" className="btn btn-success me-2">
                            Join
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={toggleShow}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

const Dashboard: React.FC = () => {
    const dispatch = useAppDispatch();
    const { navToRoom } = useNavigator();

    const joinRoomRef = useRef(null);
    const user = useAppSelector((state) => state.app.user);

    const [isShowJoinModal, setShowJoinModal] = useState(false);

    const toggleJoinModal = () => {
        setShowJoinModal(!isShowJoinModal);
    };

    const [generateRoomCode, { data, isLoading, isSuccess }] =
        roomApi.endpoints.generateRoomCode.useMutation();

    const createNewRoom = (event: React.FormEvent) => {
        event.preventDefault();
        if (user) {
            generateRoomCode({ username: user.name });
        }
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

    useEffect(() => {
        if (!isLoading && isSuccess) {
            const room = data?.code;
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
                        onClick={toggleJoinModal}
                        ref={joinRoomRef}
                    >
                        Join Room
                    </button>
                    <JoinRoomModal
                        isShow={isShowJoinModal}
                        toggleShow={toggleJoinModal}
                        joinRoom={joinRoom}
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
