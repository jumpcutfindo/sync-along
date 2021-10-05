import React from "react";
import useNavigator from "src/hooks/useNavigator";

const Dashboard: React.FC = () => {
    const { navToRoom } = useNavigator();
    return (
        <div className="DashboardScreen d-flex mb-2">
            <div className="m-auto d-flex flex-column">
                <h1 className="my-3">Sync-Along</h1>
                <div className="d-flex mx-auto">
                    <button type="button" className="btn btn-success me-2">
                        Create Room
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={navToRoom}
                    >
                        Join Room
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
