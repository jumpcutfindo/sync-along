// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";
import { useHistory } from "react-router-dom";

export default function useNavigator() {
    const history = useHistory();
    const navToRoom = () => {
        history.push("/room");
    };
    const navToLogin = () => {
        history.push("/login");
    };
    const navToDashboard = () => {
        history.push("/dashboard");
    };

    return { navToRoom, navToLogin, navToDashboard };
}
