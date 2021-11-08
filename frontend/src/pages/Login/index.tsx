/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Modal, Toast, ToastContainer } from "react-bootstrap";

import useNavigator from "src/hooks/useNavigator";
import { useAppDispatch } from "src/hooks/typedReduxHooks";
import { appLogin, storeUser } from "src/stores/app";

import {
    validateLoginInput,
    validateRegistrationInput,
} from "src/utils/validation/validator";

import { BACKEND_URL } from "src/constants/env";

import userApi from "src/services/user";
import useInputState from "src/hooks/useInputState";
import { useDispatch } from "react-redux";
import { setToastMessage } from "src/stores/app/toasts";
import LoadingButton from "src/utils/LoadingButton";
import IntroScreen from "./IntroScreen";

import "./Login.css";
import "./index.css";

export const RegisterModalContent: React.FC<{
    toggleShow: () => void;
    toggleShowRegistration: () => void;
}> = (props) => {
    const dispatch = useDispatch();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { toggleShow, toggleShowRegistration } = props;

    const [username, onChangeUsername] = useInputState("");
    const [password, onChangePassword] = useInputState("");
    const [retypePassword, onChangeRetypePassword] = useInputState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    const [register, { isLoading, isSuccess }] =
        userApi.endpoints.register.useMutation();

    const toggleSuccessToast = () => {
        setShowSuccessToast(!showSuccessToast);
    };

    const registrationHandler = (event: React.FormEvent) => {
        event.preventDefault();
        const validation = validateRegistrationInput(
            username,
            password,
            retypePassword
        );

        if (!validation.valid) {
            if (validation.error) setErrorMessage(validation.error);
            return;
        }

        setErrorMessage("");
        register({ username, password })
            .then((response: any) => {
                if (response.error) {
                    setErrorMessage(response.error.data.message);
                }
            })
            .catch((error) => {
                setErrorMessage("Unable to register; please try again later.");
            });
    };

    useEffect(() => {
        if (isSuccess) {
            dispatch(
                setToastMessage({
                    message: "Successfully registered an account!",
                    type: "success",
                })
            );
            toggleShowRegistration();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, isSuccess]);

    return (
        <div className="d-flex-column text-center p-4">
            <h2 className="mb-4">Register</h2>
            <p>
                Register a new account on Sync-Along and gain access to all our
                features! {BACKEND_URL}
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
                    <LoadingButton
                        type="submit"
                        className="btn btn-primary me-2"
                        isLoading={isLoading}
                        text="Register"
                    />
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

    const { navToDashboard } = useNavigator();
    const dispatch = useAppDispatch();
    const [login, { data, isLoading, isSuccess }] =
        userApi.endpoints.login.useMutation();

    const loginHandler = (event: React.FormEvent) => {
        event.preventDefault();

        const validation = validateLoginInput(username, password);

        if (!validation.valid) {
            if (validation.error) setErrorMessage(validation.error);
            return;
        }

        setErrorMessage("");
        login({ username, password })
            .then((response: any) => {
                if (response.error) {
                    setErrorMessage(response.error.data.message);
                }
            })
            .catch((error) => {
                setErrorMessage("Unable to login; please try again later.");
            });
    };

    useEffect(() => {
        if (isSuccess) {
            dispatch(storeUser({ name: data?.username }));
            dispatch(appLogin());
            dispatch(
                setToastMessage({
                    type: "success",
                    message: `Successfully logged in! Welcome back, ${data?.username}.`,
                })
            );
            navToDashboard();
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
                    <LoadingButton
                        type="submit"
                        className="btn btn-primary me-2"
                        isLoading={isLoading}
                        text="Log In"
                    />
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
