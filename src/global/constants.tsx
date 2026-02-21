import React from "react";
// TODO: MOve this search to just be a component that can be used in the search page, and remove it from the bottom nav
import { Search, Settings } from "lucide-react";
import { NavView } from "@/store/useAppStore";
import { RecallRating } from "@/utils/scheduler";

const BOTTOM_NAV: { view: NavView; icon: React.ReactNode; label: string }[] = [
    {
        view: "search",
        icon: <Search className="w-4 h-4" />,
        label: "Search",
    },
    {
        view: "settings",
        icon: <Settings className="w-4 h-4" />,
        label: "Settings",
    },
];

const HEATMAP = Array.from({ length: 26 }, () =>
    Array.from({ length: 7 }, () => {
        // 30% chance of no activity
        if (Math.random() < 0.3) return 0;
        // remaining spread low, rarely high
        const r = Math.random();
        if (r < 0.5) return Math.random() * 0.25;
        if (r < 0.7) return 0.25 + Math.random() * 0.25;
        if (r < 0.9) return 0.5 + Math.random() * 0.25;
        return 0.85 + Math.random() * 0.15;
    }),
);

const RECALL_BUTTONS: {
    rating: RecallRating;
    label: string;
    key: string;
    color: string;
}[] = [
        {
            rating: 1,
            label: "Again",
            key: "1",
            color: "var(--color-secondary)",
        },
        {
            rating: 2,
            label: "Later This Session",
            key: "2",
            color: "var(--color-tertiary)",
        },
        {
            rating: 3,
            label: "Next Session",
            key: "3",
            color: "var(--color-primary)",
        },
        {
            rating: 4,
            label: "Later",
            key: "4",
            color: "color-mix(in srgb, var(--color-primary) 40%, transparent)",
        },
    ];

export { BOTTOM_NAV, RECALL_BUTTONS, HEATMAP };
