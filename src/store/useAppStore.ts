import { create } from "zustand";
import { ICard, IDeck } from "@/types/types";
import { RecallRating, scheduleCard } from "@/utils/scheduler";

export type NavView = "decks" | "stats" | "settings";

export interface ITab {
    tabId: string;
    deck: IDeck;
    flipped: boolean;
    queue: ICard[];
    history: ICard[]; // Need to conserve history for going next and prev without shuffling the queue. The implementation I'm going to do is a stack that pops at the end of the list cause it'll be easier
    completed: number;
    totalCards: number;
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
    answerCard: (tabId: string, rating: RecallRating) => void;
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
        const queue = [...deck.cards];
        const newTab: ITab = {
            tabId,
            deck,
            queue,
            history: [],
            totalCards: queue.length,
            completed: 0,
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
            tabs: state.tabs.map((tab) => {
                if (tab.tabId !== tabId || tab.queue.length === 0) return tab;

                const [current, ...rest] = tab.queue;
                return {
                    ...tab,
                    queue: rest, // Remove from the front; prevCard restores from history
                    completed: tab.completed + 1,
                    history: [...tab.history, current],
                    flipped: false,
                };
            }),
        }));
    },
    prevCard: (tabId) => {
        set((state) => ({
            tabs: state.tabs.map((tab) => {
                if (tab.tabId !== tabId || tab.history.length === 0) return tab;

                const prev = tab.history[tab.history.length - 1];
                return {
                    ...tab,
                    queue: [prev, ...tab.queue],
                    history: tab.history.slice(0, -1),
                    completed: tab.completed - 1,
                    flipped: false,
                };
            }),
        }));
    },

    answerCard: (tabId, rating) =>
        set((state) => ({
            tabs: state.tabs.map((tab) => {
                if (tab.tabId !== tabId || tab.queue.length === 0) return tab;
                const { queue, updatedCard } = scheduleCard(
                    tab.queue[0],
                    rating,
                    tab.queue,
                );
                const updatedDeckCards = tab.deck.cards.map((c) =>
                    c.cardId === updatedCard.cardId ? updatedCard : c,
                );
                const isPermanentlyScheduled = rating === 3 || rating === 4;
                return {
                    ...tab,
                    queue,
                    flipped: false,
                    completed: isPermanentlyScheduled
                        ? tab.completed + 1
                        : tab.completed,
                    deck: { ...tab.deck, cards: updatedDeckCards },
                };
            }),
        })),

    flipCard: (tabId) => {
        set((state) => ({
            tabs: state.tabs.map((tab) =>
                tab.tabId === tabId ? { ...tab, flipped: !tab.flipped } : tab,
            ),
        }));
    },
}));
