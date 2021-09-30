import React from "react";

import "./Dashboard.css";
import Dashboard from "./Dashboard";

const DashboardPage: React.FC = () => {
    return (
        <div className="DashboardHolder m-auto d-flex">
            <Dashboard />
        </div>
    );
};

export default DashboardPage;
