import React, { useState } from "react";
import IntroScreen from "./IntroScreen";
import RoomScreen from "./RoomScreen";
import { DashboardState, DashboardScreenState } from "./DashboardState";
import DashboardControls from "./Controls/DashboardControls";
import { LoginModal } from "../Login";

const DashboardScreen: React.FC<{ state: DashboardState }> = (props) => {
    const { state } = props;

    const onClickLogin = () => {
        state.setShowLogin(true);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onLogIn = (bool: boolean) => {
        if (bool) state.setScreenState(DashboardScreenState.LOGGED_IN);
        else state.setScreenState(DashboardScreenState.NOT_LOGGED_IN);

        state.setLoggedIn(bool);
    };

    const onJoinRoom = () => {
        state.setScreenState(DashboardScreenState.IN_ROOM);
    };

    switch (state.screenState) {
        case DashboardScreenState.LOGGED_IN:
        case DashboardScreenState.NOT_LOGGED_IN:
            return (
                <IntroScreen
                    isLoggedIn={state.isLoggedIn}
                    onClickLogin={onClickLogin}
                    onJoinRoom={onJoinRoom}
                />
            );
        case DashboardScreenState.IN_ROOM:
            return <RoomScreen />;
        default:
            return (
                <IntroScreen
                    isLoggedIn={false}
                    onClickLogin={onClickLogin}
                    onJoinRoom={onJoinRoom}
                />
            );
    }
};

const Dashboard: React.FC = () => {
    const [screenState, setScreenState] = useState(
        DashboardScreenState.NOT_LOGGED_IN
    );
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [isShowLogin, setShowLogin] = useState(false);

    const dashboardState: DashboardState = {
        screenState,
        setScreenState,
        isLoggedIn,
        setLoggedIn,
        isShowLogin,
        setShowLogin,
    };

    return (
        <div className="Dashboard m-auto d-flex-column">
            <div className="DashboardScreen d-flex mb-2">
                <DashboardScreen state={dashboardState} />
            </div>
            <DashboardControls state={dashboardState} />
            <LoginModal isShow={isShowLogin} setIsShow={setShowLogin} />
        </div>
    );
};

export default Dashboard;
