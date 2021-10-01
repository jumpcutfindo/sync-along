import React from "react";

const IntroScreen: React.FC<{
    onClickLogin: () => void;
}> = (props) => {
    const { onClickLogin } = props;
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
