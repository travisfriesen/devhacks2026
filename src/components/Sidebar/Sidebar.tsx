import React from "react";
import {
    BookOpen,
    Flame,
    PanelLeftClose,
    PanelLeft,
    FolderOpen,
    BarChart3,
    Settings,
} from "lucide-react";
import { useAppStore, NavView } from "@/store/useAppStore";
import { IDeck } from "@/types/types";

const MOCK_DECKS: IDeck[] = [
    {
        deckId: "1",
        deckName: "Spanish Vocabulary",
        filepath: "",
        lastUpdated: new Date(),
        created: new Date(),
        uses: 10,
        streak: 5,
        cards: [],
    },
    {
        deckId: "2",
        deckName: "History Facts",
        filepath: "",
        lastUpdated: new Date(),
        created: new Date(),
        uses: 20,
        streak: 10,
        cards: [],
    },
    {
        deckId: "3",
        deckName: "Science Concepts",
        filepath: "",
        lastUpdated: new Date(),
        created: new Date(),
        uses: 15,
        streak: 7,
        cards: [],
    },
];

const BOTTOM_NAV: { view: NavView; icon: React.ReactNode; label: string }[] = [
    { view: "stats", icon: <BarChart3 className="w-4 h-4" />, label: "Stats" },
    {
        view: "settings",
        icon: <Settings className="w-4 h-4" />,
        label: "Settings",
    },
];

const Sidebar = () => {
    const {
        sidebarVisible,
        toggleSidebar,
        openTab,
        activeTabId,
        tabs,
        navView,
        setNavView,
    } = useAppStore();

    return (
        <aside
            className="h-full shrink-0 bg-primary border-r border-secondary/30 flex flex-col transition-all duration-200 overflow-hidden"
            style={{ width: sidebarVisible ? "13rem" : "2.75rem" }}>
            <div
                className="flex items-center border-b border-secondary/20 shrink-0"
                style={{
                    height: "44px",
                    padding: sidebarVisible ? "0 0.75rem" : "0",
                }}>
                {sidebarVisible ? (
                    <>
                        <span className="font-display italic text-xl text-paper/80 tracking-wide flex-1 select-none pl-1">
                            gg, get flashed
                        </span>
                        <button
                            onClick={toggleSidebar}
                            className="p-1.5 text-paper/40 hover:text-paper transition-colors"
                            title="Hide sidebar">
                            <PanelLeftClose className="w-4 h-4" />
                        </button>
                    </>
                ) : (
                    <button
                        onClick={toggleSidebar}
                        className="w-full flex items-center justify-center py-3 text-paper/40 hover:text-paper transition-colors"
                        title="Show sidebar">
                        <PanelLeft className="w-4 h-4" />
                    </button>
                )}
            </div>

            <ul className="flex-1 py-1 overflow-y-auto">
                {MOCK_DECKS.map((deck) => {
                    const openTab_ = tabs.find(
                        (tab) => tab.deck.deckId === deck.deckId,
                    );
                    const isActive = openTab_?.tabId === activeTabId;

                    return (
                        <li key={deck.deckId}>
                            <button
                                onClick={() => openTab(deck)}
                                title={
                                    !sidebarVisible ? deck.deckName : undefined
                                }
                                className="w-full text-left flex items-center gap-2.5 transition-colors font-ui text-sm"
                                style={{
                                    // sorry, didn't want to add more tailwind bs classes for the padding changes
                                    padding: sidebarVisible
                                        ? "0.625rem 1rem"
                                        : "0.625rem 0",
                                    justifyContent: sidebarVisible
                                        ? "flex-start"
                                        : "center",

                                    backgroundColor:
                                        isActive && "rgba(185,49,79,0.12)",
                                    borderLeft:
                                        isActive &&
                                        "2px solid var(--color-secondary)",
                                    color: isActive
                                        ? "var(--color-paper)"
                                        : "rgba(255,253,247,0.5)",
                                }}>
                                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                                {sidebarVisible && (
                                    <>
                                        <span className="truncate">
                                            {deck.deckName}
                                        </span>
                                        {deck.streak > 0 && (
                                            <span className="ml-auto flex items-center gap-0.5 text-xs text-tertiary shrink-0">
                                                <Flame className="w-3 h-3" />
                                                {deck.streak}
                                            </span>
                                        )}
                                    </>
                                )}
                            </button>
                        </li>
                    );
                })}
            </ul>

            <div className="border-t border-secondary/20 py-1">
                <button
                    title={!sidebarVisible ? "Import Deck" : undefined}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 font-ui text-sm transition-colors text-paper/40 hover:text-paper hover:bg-secondary/10"
                    style={{
                        padding: sidebarVisible
                            ? "0.625rem 1rem"
                            : "0.625rem 0",
                        justifyContent: sidebarVisible
                            ? "flex-start"
                            : "center",
                    }}>
                    <FolderOpen className="w-3.5 h-3.5 shrink-0" />
                    {sidebarVisible && <span>Import Deck</span>}
                </button>

                {BOTTOM_NAV.map(({ view, icon, label }) => {
                    const isActive = navView === view && !activeTabId;
                    return (
                        <button
                            key={view}
                            onClick={() => setNavView(view)}
                            title={!sidebarVisible ? label : undefined}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 font-ui text-sm transition-colors text-paper/40 hover:text-paper hover:bg-secondary/10"
                            style={{
                                padding: sidebarVisible
                                    ? "0.625rem 1rem"
                                    : "0.625rem 0",
                                justifyContent: sidebarVisible
                                    ? "flex-start"
                                    : "center",
                                backgroundColor:
                                    isActive && "rgba(185,49,79,0.12)",
                                color: isActive && "var(--color-paper)",
                                borderLeft:
                                    isActive &&
                                    "2px solid var(--color-secondary)",
                            }}>
                            {icon}
                            {sidebarVisible && <span>{label}</span>}
                        </button>
                    );
                })}
            </div>
        </aside>
    );
};

export default Sidebar;
