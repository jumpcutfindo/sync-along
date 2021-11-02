import React from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import DashboardPage from "src/pages/Dashboard";
import LoginPage from "src/pages/Login";
import RoomPage from "src/pages/Room";

import store from "src/stores";
import { Provider } from "react-redux";

import "./App.css";
import ToastComponent from "./utils/Toast";
import DashboardControls from "./pages/Dashboard/Controls/DashboardControls";
import { PrivateRoute, PublicRoute } from "./router/routes";

const App: React.FC = () => {
    return (
        <div className="App d-flex">
            <Provider store={store}>
                <div className="Container m-auto d-flex flex-column">
                    <ToastComponent />
                    <div className="Screen m-auto d-flex flex-column">
                        <Router>
                            <Switch>
                                <PublicRoute
                                    path="/login"
                                    component={LoginPage}
                                />
                                <PrivateRoute
                                    path="/dashboard"
                                    component={DashboardPage}
                                />
                                <PrivateRoute
                                    path="/room"
                                    component={RoomPage}
                                />
                                <PublicRoute path="/" component={LoginPage} />
                            </Switch>
                            <DashboardControls />
                        </Router>
                    </div>
                </div>
            </Provider>
        </div>
    );
};

export default App;
