import React, { useEffect, useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useAppSelector } from "src/hooks/typedReduxHooks";
import { setShown } from "src/stores/app/toasts";

const ToastComponent: React.FC = () => {
    const [showToast, setToastShowing] = useState(false);
    const { message, type, hasShown } = useAppSelector((state) => state.toasts);

    const dispatch = useDispatch();

    const toggleToast = () => {
        setToastShowing(!showToast);
    };

    useEffect(() => {
        if (!hasShown) {
            setToastShowing(true);
            dispatch(setShown(true));
        }
    }, [hasShown, message, dispatch]);

    return (
        <ToastContainer position="top-center" className="my-3">
            <Toast
                bg={type}
                show={showToast}
                onClose={toggleToast}
                delay={4000}
                autohide
            >
                <Toast.Body>
                    <p className="m-0">{message}</p>
                </Toast.Body>
            </Toast>
        </ToastContainer>
    );
};

export default ToastComponent;
