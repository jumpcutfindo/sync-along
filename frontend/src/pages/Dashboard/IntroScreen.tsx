import React from "react";

const IntroScreen: React.FC<{
    isLoggedIn: boolean;
    onClickLogin: () => void;
    onJoinRoom: () => void;
}> = (props) => {
    const { isLoggedIn, onClickLogin, onJoinRoom } = props;

    if (isLoggedIn) {
        return (
            <div className="m-auto d-flex flex-column">
                <h1 className="my-3">Sync-Along</h1>
                <div className="d-flex mx-auto">
                    <button type="button" className="btn btn-success me-2">
                        Create Room
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={onJoinRoom}
                    >
                        Join Room
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="m-auto d-flex flex-column">
            <h1 className="my-3">Sync-Along</h1>
            <button
                type="button"
                className="btn btn-primary"
                onClick={onClickLogin}
            >
                Login to Continue
            </button>
        </div>
    );
};

export default IntroScreen;
