import React from "react";
import { Modal } from "react-bootstrap";

export const LoginModal: React.FC<{
    isShow: boolean;
    setIsShow: (a: boolean) => void;
}> = (props) => {
    const { isShow, setIsShow } = props;

    const closeModal = () => setIsShow(false);

    if (!isShow) return null;

    return (
        <Modal show={isShow} centered>
            <Modal.Header closeButton onHide={closeModal}>
                <Modal.Title>Test title</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Some content here</p>
            </Modal.Body>
            <Modal.Footer>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={closeModal}
                >
                    Dismiss
                </button>
            </Modal.Footer>
        </Modal>
    );
};

const LoginPage: React.FC = () => {
    return <div>This is the login</div>;
};

export default LoginPage;
