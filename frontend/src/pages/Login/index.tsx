import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import { updateAccessToken } from "src/stores/auth";

import userApi from "src/services/user";
import useInputState from "src/hooks/useInputState";
import IntroScreen from "./IntroScreen";

import "./Login.css";
import "./index.css";

export const LoginModal: React.FC<{
    isShow: boolean;
}> = (props) => {
    const { isShow } = props;
    const [username, onChangeUsername] = useInputState("");
    const [password, onChangePassword] = useInputState("");

    const history = useHistory();
    const dispatch = useDispatch();
    const [login, { data, isLoading, isSuccess }] =
        userApi.endpoints.login.useMutation();
    const loginHandler = (event: React.FormEvent) => {
        event.preventDefault();
        login({ username, password });
    };

    useEffect(() => {
        if (isSuccess) {
            dispatch(updateAccessToken(data?.accessToken));
            history.push("/dashboard");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, isSuccess]);

    if (!isShow) return null;

    return (
        <Modal className="LoginModal" show={isShow} centered>
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
                    <button type="submit" className="btn btn-primary mt-3">
                        {isLoading ? "Loading..." : "Log In"}
                    </button>
                </form>
                <p className="mt-2 mb-0">
                    No account? Sign up <a href="/dashboard">here</a>.
                </p>
            </div>
        </Modal>
    );
};

const LoginPage: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const toggleModal = () => setShowModal(!showModal);
    return (
        <div className="IntroScreen d-flex mb-2">
            <IntroScreen onClickLogin={toggleModal} />
            <LoginModal isShow={showModal} />
        </div>
    );
};

export default LoginPage;
