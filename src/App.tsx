import React, { useEffect } from "react";

import TabBar from "@/components/TabBar/TabBar";
import Sidebar from "@/components/Sidebar/Sidebar";

import Header from "@/components/Header/Header";
import Dashboard from "@/pages/Dashboard";
import Deck from "@/pages/Deck";
import Settings from "@/pages/Settings";

import { useAppStore } from "@/store/useAppStore";
import { applyTheme } from "@/utils/applyTheme";
import Search from "./pages/Search";
import EditorPage from "@/pages/EditorPage";
import { retrieveAllCards } from "./data/cards";

const App = () => {
    const {
        decks,
        activeTabId,
        navView,
        themePreset,
        fontSize,
        uiFont,
        displayFont,
        loadDecksFromDB,
    } = useAppStore();

    // Restore persisted theme settings on first mount
    useEffect(() => {
        loadDecksFromDB();

        applyTheme({ themePreset, fontSize, uiFont, displayFont });
    }, []);

    const renderMain = () => {
        if (navView === "editor") return <EditorPage />;
        if (activeTabId) return <Deck />;
        if (navView === "decks") return <Dashboard />;
        if (navView === "search") return <Search />;
        if (navView === "settings") return <Settings />;
    };

    return (
        <div className="w-screen h-screen overflow-hidden flex flex-col bg-background">
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
