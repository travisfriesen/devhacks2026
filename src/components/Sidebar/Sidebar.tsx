import React from "react";
import { BookOpen, Flame } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
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

const Sidebar = () => {
    const { sidebarVisible, openTab, activeTabId, tabs } = useAppStore();

    if (!sidebarVisible) return null;

    return (
        <aside className="w-52 h-full shrink-0 bg-primary border-r border-secondary/30 overflow-y-auto flex flex-col">
            <div className="px-4 py-3 border-b border-secondary/20">
                <span className="font-ui text-xs uppercase tracking-widest text-paper/30">
                    Decks
                </span>
            </div>
            <ul className="flex-1 py-1">
                {MOCK_DECKS.map((deck) => {
                    const openTab_ = tabs.find(
                        (t) => t.deck.deckId === deck.deckId,
                    );
                    const isActive = openTab_?.tabId === activeTabId;

                    return (
                        <li key={deck.deckId}>
                            <button
                                onClick={() => openTab(deck)}
                                className="w-full text-left px-4 py-2.5 flex items-center gap-2.5 transition-colors font-ui text-sm"
                                style={{
                                    backgroundColor: isActive
                                        ? "rgba(185,49,79,0.12)"
                                        : "transparent",
                                    color: isActive
                                        ? "var(--color-paper)"
                                        : "rgba(255,253,247,0.55)",
                                    borderLeft: isActive
                                        ? "2px solid var(--color-secondary)"
                                        : "2px solid transparent",
                                }}>
                                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate">
                                    {deck.deckName}
                                </span>
                                {deck.streak > 0 && (
                                    <span className="ml-auto flex items-center gap-0.5 text-xs text-tertiary shrink-0">
                                        <Flame className="w-3 h-3" />
                                        {deck.streak}
                                    </span>
                                )}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </aside>
    );
};

export default Sidebar;
