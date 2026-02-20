import { useAppStore } from "@/store/useAppStore";
import { PanelLeftClose, PanelLeft } from "lucide-react";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NAV_ITEMS } from "../../global/constants";

const Header = () => {
    const { sidebarVisible, toggleSidebar, navView, setNavView, activeTabId } =
        useAppStore();

    const activeView = activeTabId ? null : navView; // if a tab is active, consider the view to be "tab" for header purposes, eh whatever I'm tried

    return (
        <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-2 border-b border-secondary/40 bg-primary">
            <div className="flex items-center gap-3">
                <button
                    onClick={toggleSidebar}
                    className="p-1.5 text-paper/50 hover:text-paper transition-colors"
                    title={sidebarVisible ? "Hide sidebar" : "Show sidebar"}>
                    {sidebarVisible ? (
                        <PanelLeftClose className="w-4 h-4" />
                    ) : (
                        <PanelLeft className="w-4 h-4" />
                    )}
                </button>

                <div className="flex gap-0 border border-secondary/30 p-0.5">
                    {NAV_ITEMS.map(({ view, label, icon }) => (
                        <button
                            key={view}
                            onClick={() => setNavView(view)}
                            className="px-3 py-1.5 text-xs flex items-center gap-2 transition-colors font-ui"
                            style={{
                                backgroundColor:
                                    activeView === view
                                        ? "var(--color-secondary)"
                                        : "transparent",
                                color:
                                    activeView === view
                                        ? "var(--color-paper)"
                                        : "rgba(255,253,247,0.45)",
                            }}>
                            {icon}
                            {label}
                        </button>
                    ))}
                </div>
            </div>
        </header>
    );
};

export default Header;
