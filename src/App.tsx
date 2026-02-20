import React from "react";

import TabBar from "@/components/TabBar/TabBar";
import Sidebar from "@/components/Sidebar/Sidebar";

import Header from "@/components/Header/Header";
import Dashboard from "@/pages/Dashboard";
import Deck from "@/pages/Deck";

import { useAppStore } from "@/store/useAppStore";

const App = () => {
    const { activeTabId, navView } = useAppStore();

    const renderMain = () => {
        if (activeTabId) return <Deck />;
        if (navView === "decks") return <Dashboard />;
        if (navView === "stats")
            return (
                <div className="p-8 font-ui text-primary/60">
                    Stats — coming soon
                </div>
            );
        if (navView === "settings")
            return (
                <div className="p-8 font-ui text-primary/60">
                    Settings — coming soon
                </div>
            );
    };

    return (
        <div className="w-screen h-screen overflow-hidden flex flex-col bg-background">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <div className="flex flex-col flex-1 overflow-hidden">
                    <TabBar />
                    <main className="flex-1 overflow-y-auto">
                        {renderMain()}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default App;
