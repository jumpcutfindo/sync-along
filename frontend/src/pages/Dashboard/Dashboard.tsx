import React, { useState } from "react";
import IntroScreen from "./IntroScreen";
import RoomScreen from "./RoomScreen";

interface DashboardState {
    screenState: DashboardScreenState;
    setScreenState: React.Dispatch<React.SetStateAction<DashboardScreenState>>;
    isLoggedIn: boolean;
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

enum DashboardScreenState {
    LOGGED_IN,
    NOT_LOGGED_IN,
    IN_ROOM,
}

const DashboardScreen: React.FC<{ state: DashboardState }> = (props) => {
    const { state } = props;

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
                    setLoggedIn={onLogIn}
                    onJoinRoom={onJoinRoom}
                />
            );
        case DashboardScreenState.IN_ROOM:
            return <RoomScreen />;
        default:
            return (
                <IntroScreen
                    isLoggedIn={false}
                    setLoggedIn={onLogIn}
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

    const dashboardState: DashboardState = {
        screenState,
        setScreenState,
        isLoggedIn,
        setLoggedIn,
    };

    return (
        <div className="m-auto d-flex">
            <DashboardScreen state={dashboardState} />
        </div>
    );
};

export default Dashboard;
