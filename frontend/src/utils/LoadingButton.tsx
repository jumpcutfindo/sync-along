/* eslint-disable react/button-has-type */
/* eslint-disable react/require-default-props */
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface ButtonProps {
    text?: string;
    type?: "button" | "submit" | "reset" | undefined;
    isLoading: boolean;
    className: string | undefined;
}

const LoadingButton: React.FC<ButtonProps> = (props) => {
    const { text, type, isLoading, className } = props;

    if (isLoading) {
        return (
            <button type={type} className={className}>
                <FontAwesomeIcon icon={faSpinner} spin />
            </button>
        );
    }
    return (
        <button type={type} className={className}>
            {text}
        </button>
    );
};

export default LoadingButton;
