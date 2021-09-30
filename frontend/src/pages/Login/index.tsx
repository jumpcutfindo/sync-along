import React from "react";
import { Modal } from "react-bootstrap";

import "./Login.css";

export const LoginModal: React.FC<{
    isShow: boolean;
    setIsShow: (a: boolean) => void;
}> = (props) => {
    const { isShow, setIsShow } = props;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const closeModal = () => setIsShow(false);

    if (!isShow) return null;

    return (
        <Modal className="LoginModal" show={isShow} centered>
            <div className="d-flex-column text-center p-4">
                <h2 className="mb-4">Log In</h2>
                <form>
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
    return <div>This is the login</div>;
};

export default LoginPage;
