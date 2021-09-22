import React from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import DashboardPage from "src/pages/Dashboard/DashboardPage";
import LoginPage from "src/pages/Login/LoginPage";
import RoomPage from "src/pages/Room/RoomPage";

import "./App.css";

function App() {
    return (
        <div className="App">
            <Router>
                <Switch>
                    <Route path="/login" component={LoginPage} />
                    <Route path="/dashboard" component={DashboardPage} />
                    <Route path="/room" component={RoomPage} />
                </Switch>
            </Router>
        </div>
    );
}

export default App;
