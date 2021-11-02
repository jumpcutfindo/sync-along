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

function App() {
    return (
        <div className="App d-flex">
            <Provider store={store}>
                <div className="Container m-auto d-flex flex-column">
                    <ToastComponent />
                    <div className="Screen m-auto d-flex flex-column">
                        <Router>
                            <Switch>
                                <Route path="/login" component={LoginPage} />
                                <Route
                                    path="/dashboard"
                                    component={DashboardPage}
                                />
                                <Route path="/room" component={RoomPage} />
                                <Route exact path="/" component={LoginPage} />
                            </Switch>
                            <DashboardControls />
                        </Router>
                    </div>
                </div>
            </Provider>
        </div>
    );
}

export default App;
