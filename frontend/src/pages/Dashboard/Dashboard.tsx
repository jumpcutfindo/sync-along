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
    user: { name: string; id: string } | undefined;
    navToRoom: (arg0: string) => void;
}> = (props) => {
    const dispatch = useAppDispatch();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { isShow, toggleShow, user, navToRoom } = props;

    const [roomCode, onChangeRoomCode] = useInputState("");

    const joinRoom = (event: React.FormEvent) => {
        event.preventDefault();
        dispatch(storeRoomCode(roomCode));
        if (user && roomCode) {
            dispatch(joinRoomAction({ username: user.name, room: roomCode }));
            navToRoom(roomCode);
        }
    };

    return (
        <Modal className="JoinRoomModal" show={isShow} centered>
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
        generateRoomCode({ accessToken: "test" });
    };

    useEffect(() => {
        if (!isLoading && isSuccess) {
            const room = data?.roomCode;
            dispatch(storeRoomCode(room));
            if (user && room) {
                dispatch(joinRoomAction({ username: user.name, room }));
                navToRoom(room);
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
                        user={user}
                        navToRoom={navToRoom}
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
