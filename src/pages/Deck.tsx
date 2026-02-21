import React, { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Flashcard } from "@/components/Flashcard";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";

const Deck = () => {
    const { tabs, activeTabId, nextCard, prevCard, flipCard } = useAppStore();
    const tab = tabs.find((t) => t.tabId === activeTabId);

    useEffect(() => {
        if (!tab) return;

        const handler = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") {
                nextCard(tab.tabId);
            } else if (e.key === "ArrowLeft") {
                prevCard(tab.tabId);
            } else if (e.key === " ") {
                e.preventDefault();
                flipCard(tab.tabId);
            }
        };

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

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
    const progress = ((tab.currentIndex + 1) / cards.length) * 100;

    return (
        <div className="flex flex-col items-center justify-center h-full gap-6 p-8">
            <div className="w-full max-w-xl flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <span className="font-ui text-xs text-primary/40 uppercase tracking-widest">
                        {tab.deck.deckName}
                    </span>
                    <span className="font-ui text-xs text-primary/40">
                        {tab.currentIndex + 1} / {cards.length}
                    </span>
                </div>
                <div className="w-full h-0.5 bg-primary/10 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                            width: `${progress}%`,
                            backgroundColor: "var(--color-secondary)",
                        }}
                    />
                </div>
            </div>

            <Flashcard
                {...current}
                flipped={tab.flipped}
                onClick={() => flipCard(tab.tabId)}
            />

            <div className="flex items-center gap-4">
                <button
                    onClick={() => prevCard(tab.tabId)}
                    className="flex items-center gap-2 font-ui text-sm px-5 py-2.5 rounded-lg border border-primary/15 text-primary/60 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all">
                    <ArrowLeft className="w-4 h-4" /> Prev
                </button>

                <button
                    onClick={() => flipCard(tab.tabId)}
                    className="flex items-center gap-2 font-ui text-sm px-6 py-2.5 rounded-lg transition-all text-paper"
                    style={{ backgroundColor: "var(--color-secondary)" }}>
                    <RotateCcw className="w-4 h-4" />
                    {tab.flipped ? "See Question" : "Reveal Answer"}
                </button>

                <button
                    onClick={() => nextCard(tab.tabId)}
                    className="flex items-center gap-2 font-ui text-sm px-5 py-2.5 rounded-lg border border-primary/15 text-primary/60 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all">
                    Next <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            <p className="flex items-center font-ui text-xs text-primary/25">
                Space to flip. <ArrowLeft className="w-5 h-5" />{" "}
                <ArrowRight className="w-5 h-5" /> to navigate.
            </p>
        </div>
    );
};

export default Deck;
