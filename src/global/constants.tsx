import React from "react";
import { NavView } from "@/store/useAppStore";
import { Library, BarChart3, Settings } from "lucide-react";

interface INavItem {
    view: NavView;
    label: string;
    icon: React.ReactNode;
}

const NAV_ITEMS: INavItem[] = [
    {
        view: "decks",
        label: "Decks",
        icon: <Library className="w-3.5 h-3.5" />,
    },
    {
        view: "stats",
        label: "Stats",
        icon: <BarChart3 className="w-3.5 h-3.5" />,
    },
    {
        view: "settings",
        label: "Settings",
        icon: <Settings className="w-3.5 h-3.5" />,
    },
];

export { NAV_ITEMS };
export type { INavItem };
