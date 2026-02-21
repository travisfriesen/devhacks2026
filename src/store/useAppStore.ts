import { create } from "zustand";
import { persist, StorageValue } from "zustand/middleware";
import { ICard, IDeck } from "@/types/types";
import { RecallRating, scheduleCard } from "@/utils/scheduler";
import { FontSize, applyTheme } from "@/utils/applyTheme";

// Custom storage that revives ISO date strings back into Date objects on read.
const isoDateRe = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/; // holy chatgpt generated this
function dateReviver(_key: string, value: unknown): unknown {
    if (typeof value === "string" && isoDateRe.test(value))
        return new Date(value);
    return value;
}
const dateAwareStorage = {
    getItem: (name: string): StorageValue<Partial<AppState>> | null => {
        const str = localStorage.getItem(name);
        if (!str) return null;
        return JSON.parse(str, dateReviver) as StorageValue<Partial<AppState>>;
    },
    setItem: (name: string, value: StorageValue<Partial<AppState>>) => {
        localStorage.setItem(name, JSON.stringify(value));
    },
    removeItem: (name: string) => {
        localStorage.removeItem(name);
    },
};

const todayStr = () => new Date().toISOString().slice(0, 10);

export type NavView = "decks" | "search" | "settings" | "editor";

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

    pinnedDeckIds: string[];
    togglePinDeck: (deckId: string) => void;

    tabs: ITab[];
    activeTabId: string | null; // null will mean that it's a blank state with no deck loaded, so maybe show dashboard here?
    openTab: (deck: IDeck) => void;
    closeTab: (tabId: string) => void;
    setActiveTab: (tabId: string) => void;

    nextCard: (tabId: string) => void;
    prevCard: (tabId: string) => void;
    flipCard: (tabId: string) => void;
    answerCard: (tabId: string, rating: RecallRating) => void;

    dailyGoal: number;
    setDailyGoal: (n: number) => void;
    reviewHistory: Record<string, number>; // ISO date string → cards reviewed
    incrementReviewed: () => void;

    editingDeckId: string | null;
    openEditor: (deckId: string, deckFilepath: string) => void;
    updateCard: (deckId: string, card: ICard) => void;
    addCard: (deckId: string, card: ICard) => void;
    deleteCard: (deckId: string, cardId: string) => void;

    themePreset: string;
    setThemePreset: (name: string) => void;
    fontSize: FontSize;
    setFontSize: (size: FontSize) => void;
    uiFont: string;
    setUiFont: (font: string) => void;
    displayFont: string;
    setDisplayFont: (font: string) => void;

    editorPreference: string;
    setEditorPreference: (pref: string) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            navView: "decks",
            setNavView: (view) => set({ navView: view, activeTabId: null }),

            sidebarVisible: true,
            toggleSidebar: () =>
                set((state) => ({ sidebarVisible: !state.sidebarVisible })),

            tabs: [],
            activeTabId: null,

            decks: [],
            setDecks: (decks) => set({ decks }),

            pinnedDeckIds: [],
            togglePinDeck: (deckId) =>
                set((state) => ({
                    pinnedDeckIds: state.pinnedDeckIds.includes(deckId)
                        ? state.pinnedDeckIds.filter((id) => id !== deckId)
                        : [...state.pinnedDeckIds, deckId],
                })),

            dailyGoal: 20,
            setDailyGoal: (n) => set({ dailyGoal: n }),
            reviewHistory: {},
            incrementReviewed: () =>
                set((state) => {
                    const today = todayStr();
                    return {
                        reviewHistory: {
                            ...state.reviewHistory,
                            [today]: (state.reviewHistory[today] ?? 0) + 1,
                        },
                    };
                }),

            editingDeckId: null,
            openEditor: (deckId, deckFilepath) => {
                if (get().editorPreference === "Web Editor") {
                    //if editor preference is web editor
                    set({ navView: "editor", editingDeckId: deckId });
                } else {
                    //open system default editor with the deck's file path
                    shell.openPath(deckFilepath).then((error: string) => {
                        if (error === "") {
                            console.log("Deck opened in system editor");
                        } else {
                            console.error(
                                "Failed to open deck in system editor:",
                                error,
                            );
                        }
                    });
                }
            },

            updateCard: (deckId, card) =>
                set((state) => ({
                    decks: state.decks.map((d) =>
                        d.deckId === deckId
                            ? {
                                  ...d,
                                  cards: d.cards.map((c) =>
                                      c.cardId === card.cardId ? card : c,
                                  ),
                              }
                            : d,
                    ),
                })),

            addCard: (deckId, card) =>
                set((state) => ({
                    decks: state.decks.map((d) =>
                        d.deckId === deckId
                            ? { ...d, cards: [...d.cards, card] }
                            : d,
                    ),
                })),

            deleteCard: (deckId, cardId) =>
                set((state) => ({
                    decks: state.decks.map((d) =>
                        d.deckId === deckId
                            ? {
                                  ...d,
                                  cards: d.cards.filter(
                                      (c) => c.cardId !== cardId,
                                  ),
                              }
                            : d,
                    ),
                })),

            openTab: (deck) => {
                const now = new Date();
                const updatedDeck = { ...deck, lastUtilized: now };

                const existingTab = get().tabs.find(
                    (tab) => tab.deck.deckId === deck.deckId,
                );

                if (existingTab) {
                    // if the tab is already open, just switch to it instead of opening a new one
                    set((state) => ({
                        activeTabId: existingTab.tabId,
                        decks: state.decks.map((d) =>
                            d.deckId === deck.deckId
                                ? { ...d, lastUtilized: now }
                                : d,
                        ),
                    }));
                    return;
                }

                const tabId = `tab-${deck.deckId}-${Date.now()}`;
                const queue = [...deck.cards];
                const newTab: ITab = {
                    tabId,
                    deck: updatedDeck,
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
                    decks: state.decks.map((d) =>
                        d.deckId === deck.deckId
                            ? { ...d, lastUtilized: now }
                            : d,
                    ),
                }));
            },
            closeTab: (tabId) => {
                set((state) => {
                    const index = state.tabs.findIndex(
                        (tab) => tab.tabId === tabId,
                    );
                    const newTabs = state.tabs.filter(
                        (tab) => tab.tabId !== tabId,
                    );
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
                        if (tab.tabId !== tabId || tab.queue.length === 0)
                            return tab;

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
                get().incrementReviewed();
            },
            prevCard: (tabId) => {
                set((state) => ({
                    tabs: state.tabs.map((tab) => {
                        if (tab.tabId !== tabId || tab.history.length === 0)
                            return tab;

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

            answerCard: (tabId, rating) => {
                set((state) => ({
                    tabs: state.tabs.map((tab) => {
                        if (tab.tabId !== tabId || tab.queue.length === 0)
                            return tab;
                        const [current, ...rest] = tab.queue;
                        const { updatedCard } = scheduleCard(
                            current,
                            rating,
                            tab.queue,
                        );
                        const updatedDeckCards = tab.deck.cards.map((c) =>
                            c.cardId === updatedCard.cardId ? updatedCard : c,
                        );
                        // Ratings 3 (next session) and 4 (later) are done for this session —
                        // remove from queue. Ratings 1/2 keep the card in play (recycle to end).
                        // Rating 1 (Again): return to front — same card shown immediately.
                        // Rating 2 (Later This Session): insert at middle — next card shows, this one returns sooner.
                        const isPermanentlyScheduled =
                            rating === 3 || rating === 4;
                        let newQueue: ICard[];
                        if (isPermanentlyScheduled) {
                            newQueue = rest;
                        } else if (rating === 1) {
                            newQueue = [updatedCard, ...rest];
                        } else {
                            // rating === 2: insert at middle
                            const mid = Math.ceil(rest.length / 2);
                            newQueue = [
                                ...rest.slice(0, mid),
                                updatedCard,
                                ...rest.slice(mid),
                            ];
                        }
                        return {
                            ...tab,
                            queue: newQueue,
                            flipped: false,
                            completed: isPermanentlyScheduled
                                ? tab.completed + 1
                                : tab.completed,
                            // Only add to history when the card leaves the session (3/4),
                            // not when it's recycled (1/2) — otherwise prevCard creates duplicates
                            history: isPermanentlyScheduled
                                ? [...tab.history, current]
                                : tab.history,
                            deck: { ...tab.deck, cards: updatedDeckCards },
                        };
                    }),
                }));
                get().incrementReviewed();
            },

            flipCard: (tabId) => {
                set((state) => ({
                    tabs: state.tabs.map((tab) =>
                        tab.tabId === tabId
                            ? { ...tab, flipped: !tab.flipped }
                            : tab,
                    ),
                }));
            },

            themePreset: "Default",
            setThemePreset: (name) =>
                set((state) => {
                    applyTheme({
                        themePreset: name,
                        fontSize: state.fontSize,
                        uiFont: state.uiFont,
                        displayFont: state.displayFont,
                    });
                    return { themePreset: name };
                }),

            fontSize: "md",
            setFontSize: (size) =>
                set((state) => {
                    applyTheme({
                        themePreset: state.themePreset,
                        fontSize: size,
                        uiFont: state.uiFont,
                        displayFont: state.displayFont,
                    });
                    return { fontSize: size };
                }),

            uiFont: '"Plus Jakarta Sans", sans-serif',
            setUiFont: (font) =>
                set((state) => {
                    applyTheme({
                        themePreset: state.themePreset,
                        fontSize: state.fontSize,
                        uiFont: font,
                        displayFont: state.displayFont,
                    });
                    return { uiFont: font };
                }),

            displayFont: '"Lexend", serif',
            setDisplayFont: (font) =>
                set((state) => {
                    applyTheme({
                        themePreset: state.themePreset,
                        fontSize: state.fontSize,
                        uiFont: state.uiFont,
                        displayFont: font,
                    });
                    return { displayFont: font };
                }),

            editorPreference: '"System Default Editor", Web Editor',
            setEditorPreference: (pref) =>
                set(() => {
                    return { editorPreference: pref };
                }),
        }),
        {
            name: "devhacks-store",
            storage: dateAwareStorage,
            partialize: (state) => ({
                pinnedDeckIds: state.pinnedDeckIds,
                dailyGoal: state.dailyGoal,
                reviewHistory: state.reviewHistory,
                decks: state.decks,
                tabs: state.tabs,
                activeTabId: state.activeTabId,
                themePreset: state.themePreset,
                fontSize: state.fontSize,
                uiFont: state.uiFont,
                displayFont: state.displayFont,
                editorPreference: state.editorPreference,
            }),
        },
    ),
);
