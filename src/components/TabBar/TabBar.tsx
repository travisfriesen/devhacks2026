import React from "react";
import { X } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

const TabBar = () => {
    const { tabs, activeTabId, setActiveTab, closeTab } = useAppStore();

    if (tabs.length === 0) return null;

    return (
        <div className="flex items-end border-b border-secondary/30 bg-primary overflow-x-auto shrink-0">
            {tabs.map((tab) => {
                const isActive = tab.tabId === activeTabId;
                return (
                    <div
                        key={tab.tabId}
                        onClick={() => setActiveTab(tab.tabId)}
                        className="flex items-center gap-2 px-4 py-2 cursor-pointer border-r border-secondary/20 shrink-0 group transition-colors select-none"
                        style={{
                            backgroundColor: isActive
                                ? "var(--color-background)"
                                : "transparent",
                            borderBottom: isActive
                                ? "2px solid var(--color-secondary)"
                                : "2px solid transparent",
                        }}>
                        <span
                            className="text-sm font-ui truncate max-w-[140px]"
                            style={{
                                color: isActive
                                    ? "var(--color-primary)"
                                    : "rgba(255,253,247,0.5)",
                            }}>
                            {tab.deck.deckName}
                        </span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                closeTab(tab.tabId);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-secondary/20"
                            style={{
                                color: isActive
                                    ? "var(--color-primary)"
                                    : "var(--color-paper)",
                            }}>
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default TabBar;
