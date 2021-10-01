import React, { useState } from "react";
import { Modal } from "react-bootstrap";

import { useDispatch } from "react-redux";
import { signIn } from "src/stores/login";

import { useHistory } from "react-router-dom";

import IntroScreen from "./IntroScreen";
import "./Login.css";
import "./index.css";

export const LoginModal: React.FC<{
    isShow: boolean;
}> = (props) => {
    const { isShow } = props;
    const dispatch = useDispatch();
    const history = useHistory();
    const login = (event: React.FormEvent) => {
        event.preventDefault();
        dispatch(signIn);
        history.push("/dashboard");
    };

    if (!isShow) return null;

    return (
        <Modal className="LoginModal" show={isShow} centered>
            <div className="d-flex-column text-center p-4">
                <h2 className="mb-4">Log In</h2>
                <form onSubmit={login}>
                    <input
                        type="text"
                        placeholder="Username"
                        className="form-control my-2"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="form-control my-2"
                    />
                    <button type="submit" className="btn btn-primary mt-3">
                        Log In
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
