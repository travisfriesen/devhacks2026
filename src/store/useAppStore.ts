import { create } from "zustand";
import { ICard, IDeck } from "@/types/types";

interface AppState {
    title: string;
    setTitle: (title: string) => void;
    activeDeck: IDeck | null;
    cards: ICard[];
    currentIndex: number;
    flipped: boolean;
    setActiveDeck: (deck: IDeck) => void;
    setCards: (cards: ICard[]) => void;
    nextCard: () => void;
    prevCard: () => void;
    flipCard: () => void;
    resetSession: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
    title: "",
    setTitle: (title) => set({ title }),

    activeDeck: null,
    cards: [],
    currentIndex: 0,
    flipped: false,
    setActiveDeck: (deck) => set({ activeDeck: deck }),
    setCards: (cards) => set({ cards }),
    nextCard: () =>
        set((state) => ({
            currentIndex: (state.currentIndex + 1) % state.cards.length,
            flipped: false,
        })),
    prevCard: () =>
        set((state) => ({
            currentIndex:
                (state.currentIndex - 1 + state.cards.length) %
                state.cards.length,
            flipped: false,
        })),
    flipCard: () => set((state) => ({ flipped: !state.flipped })),
    resetSession: () =>
        set({ currentIndex: 0, flipped: false, cards: [], activeDeck: null }),
}));
