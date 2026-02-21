import React from "react";

const Dashboard = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <h1 className="font-display text-4xl text-primary mb-3">
                Welcome back
            </h1>
            <p className="font-ui text-sm text-primary/50">
                Select a deck from the sidebar to start studying.
            </p>
        </div>
    );
};

export default Dashboard;
