/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import { updateAccessToken } from "src/stores/auth";
import { appLogin } from "src/stores/app";

import userApi from "src/services/user";
import useInputState from "src/hooks/useInputState";
import IntroScreen from "./IntroScreen";

import "./Login.css";
import "./index.css";

export const RegisterModalContent: React.FC<{
    toggleShow: () => void;
    toggleShowRegistration: () => void;
}> = (props) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { toggleShow, toggleShowRegistration } = props;

    const [username, onChangeUsername] = useInputState("");
    const [password, onChangePassword] = useInputState("");
    const [retypePassword, onChangeRetypePassword] = useInputState("");

    const [errorMessage, setErrorMessage] = useState("");

    const [register, { isLoading, isSuccess }] =
        userApi.endpoints.register.useMutation();

    const registrationHandler = (event: React.FormEvent) => {
        event.preventDefault();
        if (username === "") {
            setErrorMessage("Please enter a username!");
        } else if (password === "") {
            setErrorMessage("Please enter a password!");
        } else if (retypePassword === "") {
            setErrorMessage("Please retype your password!");
        } else if (password !== retypePassword) {
            setErrorMessage("The passwords do not match!");
        } else {
            setErrorMessage("");
            register({ username, password });
        }
    };

    useEffect(() => {
        if (isSuccess) {
            // TODO: Decide on what to do when registration is successful
            toggleShowRegistration();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, isSuccess]);

    return (
        <div className="d-flex-column text-center p-4">
            <h2 className="mb-4">Register</h2>
            <p>
                Register a new account on Sync-Along and gain access to all our
                features!
            </p>
            <form onSubmit={registrationHandler}>
                <input
                    type="text"
                    placeholder="New username"
                    className="form-control my-2"
                    onChange={onChangeUsername}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="form-control my-2"
                    onChange={onChangePassword}
                />
                <input
                    type="password"
                    placeholder="Retype password"
                    className="form-control my-2"
                    onChange={onChangeRetypePassword}
                />
                {errorMessage !== "" ? (
                    <p className="text-danger small">{errorMessage}</p>
                ) : null}
                <div className="mt-3">
                    <button type="submit" className="btn btn-primary me-2">
                        {isLoading ? "Loading..." : "Register"}
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={toggleShowRegistration}
                    >
                        Back
                    </button>
                </div>
            </form>
        </div>
    );
};

export const LoginModalContent: React.FC<{
    toggleShow: () => void;
    toggleShowRegistration: () => void;
}> = (props) => {
    const { toggleShow, toggleShowRegistration } = props;
    const [username, onChangeUsername] = useInputState("");
    const [password, onChangePassword] = useInputState("");

    const [errorMessage, setErrorMessage] = useState("");

    const history = useHistory();
    const dispatch = useDispatch();
    const [login, { data, isLoading, isSuccess }] =
        userApi.endpoints.login.useMutation();

    const loginHandler = (event: React.FormEvent) => {
        event.preventDefault();

        if (username === "" || password === "") {
            setErrorMessage("Please enter a username and password!");
        } else {
            setErrorMessage("");
            login({ username, password });
        }

        // TODO: Move this function into the if-else once login is handled properly
        dispatch(appLogin());
        history.push("/dashboard");
    };

    useEffect(() => {
        if (isSuccess) {
            dispatch(updateAccessToken(data?.accessToken));
            history.push("/dashboard");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, isSuccess]);

    return (
        <div className="d-flex-column text-center p-4">
            <h2 className="mb-4">Log In</h2>
            <form onSubmit={loginHandler}>
                <input
                    type="text"
                    placeholder="Username"
                    className="form-control my-2"
                    onChange={onChangeUsername}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="form-control my-2"
                    onChange={onChangePassword}
                />
                {errorMessage !== "" ? (
                    <p className="text-danger small">{errorMessage}</p>
                ) : null}
                <div className="mt-3">
                    <button type="submit" className="btn btn-primary me-2">
                        {isLoading ? "Loading..." : "Log In"}
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={toggleShow}
                    >
                        Cancel
                    </button>
                </div>
            </form>
            <p className="mt-2 mb-0">
                No account? Sign up{" "}
                <a href="#" onClick={toggleShowRegistration}>
                    here
                </a>
                .
            </p>
        </div>
    );
};

export const LoginRegisterModal: React.FC<{
    isShow: boolean;
    toggleShow: () => void;
}> = (props) => {
    const { isShow, toggleShow } = props;
    const [isRegistering, setRegistering] = useState(false);

    const toggleRegistering = () => setRegistering(!isRegistering);

    if (!isShow) return null;

    return (
        <Modal className="LoginRegisterModal" show={isShow} centered>
            {isRegistering ? (
                <RegisterModalContent
                    toggleShow={toggleShow}
                    toggleShowRegistration={toggleRegistering}
                />
            ) : (
                <LoginModalContent
                    toggleShow={toggleShow}
                    toggleShowRegistration={toggleRegistering}
                />
            )}
        </Modal>
    );
};

const LoginPage: React.FC = () => {
    const [showModal, setShowModal] = useState(false);

    const toggleModal = () => setShowModal(!showModal);

    return (
        <div className="IntroScreen d-flex mb-2">
            <IntroScreen onClickLogin={toggleModal} />
            <LoginRegisterModal isShow={showModal} toggleShow={toggleModal} />
        </div>
    );
};

export default LoginPage;
