import React, { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "src/hooks/typedReduxHooks";
import { Modal } from "react-bootstrap";
import useInputState from "src/hooks/useInputState";
import useNavigator from "src/hooks/useNavigator";
import roomApi from "src/services/room";

import { storeRoomCode, joinRoom } from "src/stores/room";
import LoadingButton from "src/utils/LoadingButton";
import { setToastMessage } from "src/stores/app/toasts";

const JoinRoomModal: React.FC<{
    isShow: boolean;
    toggleShow: () => void;
    onJoinRoom: (arg0: string) => void;
}> = (props) => {
    const { isShow, toggleShow, onJoinRoom } = props;

    const [roomCode, onChangeRoomCode] = useInputState("");

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
                    console.log(response);
                    if (response.error) {
                        dispatch(
                            setToastMessage({
                                type: "danger",
                                message:
                                    "Unable to create a room, please try again later.",
                            })
                        );
                    } else {
                        dispatch(
                            joinRoom({
                                username: user.name,
                                room: response.code,
                            })
                        );
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

    const onJoinRoom = (room: string) => {
        dispatch(storeRoomCode(room));
        if (user && room) {
            dispatch(joinRoom({ username: user.name, room }))
                .then(() => navToRoom(room))
                .catch(() => console.log("cannot join room!"));
        }
    };

    useEffect(() => {
        if (!isRoomCreationLoading && isRoomCreationSuccess) {
            const room = createRoomData?.code;
            // TODO: replace with error in the UI
            if (!room) {
                console.log("API did not return room");
            } else {
                onJoinRoom(room);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRoomCreationLoading, isRoomCreationSuccess]);

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
                        ref={joinRoomRef}
                    >
                        Join Room
                    </button>
                    <JoinRoomModal
                        isShow={isShowJoinModal}
                        toggleShow={toggleJoinModal}
                        onJoinRoom={onJoinRoom}
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
