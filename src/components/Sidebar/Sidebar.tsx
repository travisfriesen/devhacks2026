import React, { useEffect } from "react";
import {
    BookOpen,
    Flame,
    PanelLeftClose,
    PanelLeft,
    FolderOpen,
    Star,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { BOTTOM_NAV } from "@/global/constants";

const Sidebar = () => {
    const {
        sidebarVisible,
        toggleSidebar,
        openTab,
        activeTabId,
        tabs,
        decks,
        navView,
        setNavView,
        pinnedDeckIds,
        togglePinDeck,
        loadDecksFromDB,
    } = useAppStore();

    useEffect(() => {
        loadDecksFromDB();
    }, []);
    const handleOpenFile = async () => {
        const path = await window.electronAPI.openFile();
        console.log(path);
    }

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
                {decks.map((deck) => {
                    const openTab_ = tabs.find(
                        (tab) => tab.deck.deckId === deck.deckId,
                    );
                    const isActive = openTab_?.tabId === activeTabId;

                    return (
                        <li key={deck.deckId} className="group flex items-center">
                            <button
                                onClick={() => openTab(deck)}
                                title={
                                    !sidebarVisible ? deck.deckName : undefined
                                }
                                className="flex-1 text-left flex items-center gap-2.5 transition-colors font-ui text-sm cursor-pointer min-w-0"
                                style={{
                                    padding: sidebarVisible
                                        ? "0.625rem 0.625rem 0.625rem 1rem"
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
                                    <span className="truncate">
                                        {deck.deckName}
                                    </span>
                                )}
                            </button>
                            {sidebarVisible && (
                                <div className="relative flex items-center justify-center shrink-0 w-8 pr-2">
                                    {/* Streak: fades out on hover or when pinned */}
                                    {deck.streak > 0 && (
                                        <span
                                            className={`flex items-center gap-0.5 text-xs text-tertiary transition-opacity pointer-events-none ${pinnedDeckIds.includes(deck.deckId)
                                                ? "opacity-0"
                                                : "opacity-100 group-hover:opacity-0"
                                                }`}>
                                            <Flame className="w-3 h-3" />
                                            {deck.streak}
                                        </span>
                                    )}
                                    {/* Star: fades in on hover or when pinned, sits over streak slot */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            togglePinDeck(deck.deckId);
                                        }}
                                        title={
                                            pinnedDeckIds.includes(deck.deckId)
                                                ? "Unpin deck"
                                                : "Pin deck"
                                        }
                                        className={`${deck.streak > 0 ? "absolute" : "relative"} p-1 rounded transition-all ${pinnedDeckIds.includes(deck.deckId)
                                            ? "opacity-100 text-yellow-400"
                                            : "opacity-0 group-hover:opacity-60 text-paper/50 hover:!opacity-100 hover:text-yellow-400"
                                            }`}>
                                        <Star
                                            className="w-3 h-3"
                                            fill={
                                                pinnedDeckIds.includes(deck.deckId)
                                                    ? "currentColor"
                                                    : "none"
                                            }
                                        />
                                    </button>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>

            <div className="border-t border-secondary/20 py-1">
                <button
                    onClick={handleOpenFile}
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
                    const isActive = navView === view && navView !== "editor" && !activeTabId;
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
