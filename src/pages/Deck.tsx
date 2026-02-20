import React from "react";
import { useAppStore } from "@/store/useAppStore";
import { Flashcard } from "@/components/Flashcard";

const Deck = () => {
    const { tabs, activeTabId, nextCard, prevCard, flipCard } = useAppStore();
    const tab = tabs.find((t) => t.tabId === activeTabId);

    if (!tab) return null;

    const cards = tab.deck.cards;

    if (!cards || cards.length === 0) {
        return (
            <div className="flex items-center justify-center h-full font-ui text-sm text-primary/50">
                No cards in this deck yet.
            </div>
        );
    }

    const current = cards[tab.currentIndex];

    return (
        <div className="flex flex-col items-center justify-center h-full gap-6 p-8">
            <p className="font-ui text-xs text-primary/40 uppercase tracking-widest">
                {tab.currentIndex + 1} / {cards.length}
            </p>

            <Flashcard
                {...current}
                flipped={tab.flipped}
                onClick={() => flipCard(tab.tabId)}
            />

            <div className="flex gap-3">
                <button
                    onClick={() => prevCard(tab.tabId)}
                    className="font-ui text-sm px-5 py-2 border border-primary/20 rounded text-primary hover:bg-primary/5 transition-colors">
                    ← Prev
                </button>
                <button
                    onClick={() => nextCard(tab.tabId)}
                    className="font-ui text-sm px-5 py-2 border border-primary/20 rounded text-primary hover:bg-primary/5 transition-colors">
                    Next →
                </button>
            </div>
        </div>
    );
};

export default Deck;
