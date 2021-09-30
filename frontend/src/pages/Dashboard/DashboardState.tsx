export enum DashboardScreenState {
    LOGGED_IN,
    NOT_LOGGED_IN,
    IN_ROOM,
}

export interface DashboardState {
    screenState: DashboardScreenState;
    setScreenState: React.Dispatch<React.SetStateAction<DashboardScreenState>>;
    isLoggedIn: boolean;
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export default DashboardState;
