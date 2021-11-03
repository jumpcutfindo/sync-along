import React, { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "src/hooks/typedReduxHooks";
import { Modal } from "react-bootstrap";
import useInputState from "src/hooks/useInputState";
import useNavigator from "src/hooks/useNavigator";
import roomApi from "src/services/room";

import { storeRoomCode, joinRoom } from "src/stores/room";
import LoadingButton from "src/utils/LoadingButton";
import { setToastMessage } from "src/stores/app/toasts";

const validateRoomCode = (roomCode: string) => {
    if (roomCode.length < 5) return false;

    return true;
};

const JoinRoomModal: React.FC<{
    isShow: boolean;
    toggleShow: () => void;
}> = (props) => {
    const dispatch = useAppDispatch();
    const { navToRoom } = useNavigator();
    const { isShow, toggleShow } = props;

    const [errorMessage, setErrorMessage] = useState("");
    const [roomCode, onChangeRoomCode] = useInputState("");
    const [isLoading, setIsLoading] = useState(false);

    const user = useAppSelector((state) => state.app.user);

    const onJoinRoom = (room: string) => {
        if (!validateRoomCode(room)) {
            setErrorMessage("Invalid room code entered!");
            return;
        }

        if (user && room) {
            setIsLoading(true);
            dispatch(joinRoom({ username: user.name, room }))
                .then((response: any) => {
                    if (response.error) {
                        if (response.error.data?.message) {
                            setErrorMessage(response.error.data.message);
                        } else {
                            setErrorMessage("Unable to join room.");
                        }
                    } else {
                        dispatch(storeRoomCode(room));
                        navToRoom(room);
                    }
                    setIsLoading(false);
                })
                .catch((err) => {
                    setErrorMessage("Unable to join room.");
                    setIsLoading(false);
                });
        }
    };

    const joinExistingRoom = (event: React.FormEvent) => {
        event.preventDefault();
        onJoinRoom(roomCode);
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
                    {errorMessage !== "" ? (
                        <p className="text-danger small">{errorMessage}</p>
                    ) : null}
                    <div className="mt-3">
                        <LoadingButton
                            type="submit"
                            className="btn btn-success me-2"
                            text="Join"
                            isLoading={isLoading}
                        />
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

    const user = useAppSelector((state) => state.app.user);

    const [isShowJoinModal, setShowJoinModal] = useState(false);

    const toggleJoinModal = () => {
        setShowJoinModal(!isShowJoinModal);
    };

    const [
        createRoom,
        {
            data: createRoomData,
            isLoading: isRoomCreationLoading,
            isSuccess: isRoomCreationSuccess,
        },
    ] = roomApi.endpoints.createRoom.useMutation();

    const createNewRoom = (event: React.FormEvent) => {
        event.preventDefault();
        if (user) {
            createRoom({ username: user.name })
                .then((response: any) => {
                    if (response.error) {
                        dispatch(
                            setToastMessage({
                                type: "danger",
                                message:
                                    "Unable to create a room, please try again later.",
                            })
                        );
                    } else {
                        const roomCode = response.data.code;
                        console.log(roomCode);
                        dispatch(
                            joinRoom({
                                username: user.name,
                                room: roomCode,
                            })
                        );
                        dispatch(storeRoomCode(roomCode));
                        navToRoom(roomCode);
                    }
                })
                .catch((err) => {
                    dispatch(
                        setToastMessage({
                            type: "danger",
                            message:
                                "Unable to create a room, please try again later.",
                        })
                    );
                });
        }
    };

    return (
        <div className="DashboardScreen d-flex mb-2">
            <div className="m-auto d-flex flex-column">
                <h1 className="my-3">Sync-Along</h1>
                <div className="d-flex mx-auto">
                    <LoadingButton
                        type="button"
                        className="btn btn-success me-2"
                        onClick={createNewRoom}
                        isLoading={isRoomCreationLoading}
                        text="Create Room"
                    />
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={toggleJoinModal}
                    >
                        Join Room
                    </button>
                    <JoinRoomModal
                        isShow={isShowJoinModal}
                        toggleShow={toggleJoinModal}
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
