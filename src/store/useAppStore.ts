import { create } from "zustand";
import { IDeck } from "@/types/types";

export type NavView = "decks" | "stats" | "settings";

export interface ITab {
    tabId: string;
    deck: IDeck;
    currentIndex: number;
    flipped: boolean;
}

interface AppState {
    navView: NavView;
    setNavView: (view: NavView) => void;

    sidebarVisible: boolean;
    toggleSidebar: () => void;

    decks: IDeck[];
    setDecks: (decks: IDeck[]) => void;

    tabs: ITab[];
    activeTabId: string | null; // null will mean that it's a blank state with no deck loaded, so maybe show dashboard here?
    openTab: (deck: IDeck) => void;
    closeTab: (tabId: string) => void;
    setActiveTab: (tabId: string) => void;

    nextCard: (tabId: string) => void;
    prevCard: (tabId: string) => void;
    flipCard: (tabId: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
    navView: "decks",
    setNavView: (view) => set({ navView: view, activeTabId: null }),

    sidebarVisible: true,
    toggleSidebar: () =>
        set((state) => ({ sidebarVisible: !state.sidebarVisible })),

    tabs: [],
    activeTabId: null,

    decks: [],
    setDecks: (decks) => set({ decks }),

    openTab: (deck) => {
        const existingTab = get().tabs.find(
            (tab) => tab.deck.deckId === deck.deckId,
        );

        if (existingTab) {
            // if the tab is already open, just switch to it instead of opening a new one
            set({ activeTabId: existingTab.tabId });
            return;
        }

        const tabId = `tab-${deck.deckId}-${Date.now()}`;
        const newTab: ITab = {
            tabId,
            deck,
            currentIndex: 0,
            flipped: false,
        };

        set((state) => ({
            tabs: [...state.tabs, newTab],
            activeTabId: tabId,
            navView: "decks",
        }));
    },
    closeTab: (tabId) => {
        set((state) => {
            const index = state.tabs.findIndex((tab) => tab.tabId === tabId);
            const newTabs = state.tabs.filter((tab) => tab.tabId !== tabId);
            let newActiveId = state.activeTabId;

            if (state.activeTabId === tabId) {
                if (newTabs.length === 0) {
                    newActiveId = null;
                } else if (index === 0) {
                    newActiveId = newTabs[0].tabId;
                } else {
                    newActiveId = newTabs[index - 1].tabId;
                }
            }

            return { tabs: newTabs, activeTabId: newActiveId };
        });
    },
    setActiveTab: (tabId) => set({ activeTabId: tabId }),

    nextCard: (tabId) => {
        set((state) => ({
            tabs: state.tabs.map((tab) =>
                tab.tabId === tabId
                    ? {
                          ...tab,
                          currentIndex:
                              (tab.currentIndex + 1) % tab.deck.cards.length,
                          flipped: false,
                      }
                    : tab,
            ),
        }));
    },
    prevCard: (tabId) => {
        set((state) => ({
            tabs: state.tabs.map((tab) =>
                tab.tabId === tabId
                    ? {
                          ...tab,
                          currentIndex:
                              (tab.currentIndex - 1 + tab.deck.cards.length) %
                              tab.deck.cards.length,
                          flipped: false,
                      }
                    : tab,
            ),
        }));
    },

    flipCard: (tabId) => {
        set((state) => ({
            tabs: state.tabs.map((tab) =>
                tab.tabId === tabId ? { ...tab, flipped: !tab.flipped } : tab,
            ),
        }));
    },
}));
