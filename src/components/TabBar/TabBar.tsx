import React from "react";
import { X, BookOpen } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

const TabBar = () => {
    const { tabs, activeTabId, setActiveTab, closeTab } = useAppStore();

    if (tabs.length === 0) return null;

    return (
        <div className="flex items-stretch border-b border-secondary/30 bg-primary overflow-x-auto shrink-0 min-h-[36px]">
            {tabs.map((tab) => {
                const isActive = tab.tabId === activeTabId;
                return (
                    <button
                        key={tab.tabId}
                        onClick={() => setActiveTab(tab.tabId)}
                        className={[
                            "flex items-center gap-2 pl-3 pr-2 shrink-0 group transition-colors select-none border-r border-secondary/20 outline-none",
                            "border-b-2",
                            isActive
                                ? "bg-background border-b-secondary text-primary"
                                : "bg-transparent border-b-transparent text-paper/40 hover:text-paper/70 hover:bg-white/5",
                        ].join(" ")}>
                        <span className="text-xs font-ui truncate max-w-[120px]">
                            {tab.deck.deckName}
                        </span>

                        <span
                            onClick={(e) => {
                                e.stopPropagation();
                                closeTab(tab.tabId);
                            }}
                            className={[
                                "p-0.5 rounded transition-all",
                                "hover:bg-secondary/20",
                                isActive
                                    ? "opacity-100"
                                    : "opacity-0 group-hover:opacity-100",
                            ].join(" ")}>
                            <X className="w-3 h-3" />
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default TabBar;
