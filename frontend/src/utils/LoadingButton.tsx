/* eslint-disable react/button-has-type */
/* eslint-disable react/require-default-props */
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface ButtonProps
    extends React.DetailedHTMLProps<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    > {
    text?: string;
    isLoading: boolean;
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
