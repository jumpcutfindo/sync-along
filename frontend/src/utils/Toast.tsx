import React, { useEffect, useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { useAppSelector } from "src/hooks/typedReduxHooks";

const ToastComponent: React.FC = () => {
    const [showToast, setToastShowing] = useState(false);

    const toggleToast = () => {
        setToastShowing(!showToast);
    };

    const message = useAppSelector((state) => state.toasts.message);
    const type = useAppSelector((state) => state.toasts.type);

    useEffect(() => {
        setToastShowing(true);
    }, [message]);

    return (
        <ToastContainer position="top-center">
            <Toast
                bg={type}
                show={showToast}
                onClose={toggleToast}
                delay={4000}
                autohide
            >
                <Toast.Body>
                    <p>{message}</p>
                </Toast.Body>
            </Toast>
        </ToastContainer>
    );
};

export default ToastComponent;
