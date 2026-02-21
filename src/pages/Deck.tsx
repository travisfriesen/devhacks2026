import React, { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Flashcard } from "@/components/Flashcard";
import { ArrowLeft, ArrowRight, Pencil, RotateCcw } from "lucide-react";
import { RECALL_BUTTONS } from "@/global/constants";

const Deck = () => {
    const {
        tabs,
        activeTabId,
        nextCard,
        prevCard,
        flipCard,
        answerCard,
        openEditor,
    } = useAppStore();
    const tab = tabs.find((t) => t.tabId === activeTabId);

    useEffect(() => {
        if (!tab) return;
        const handler = (e: KeyboardEvent) => {
            if ((e.target as HTMLElement).tagName === "INPUT") return;
            if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                flipCard(tab.tabId);
            }
            if (e.key === "ArrowRight") nextCard(tab.tabId);
            if (e.key === "ArrowLeft") prevCard(tab.tabId);
            if (tab.flipped) {
                if (e.key === "1") answerCard(tab.tabId, 1);
                if (e.key === "2") answerCard(tab.tabId, 2);
                if (e.key === "3") answerCard(tab.tabId, 3);
                if (e.key === "4") answerCard(tab.tabId, 4);
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [tab?.tabId, tab?.flipped]);

    if (!tab) return null;

    const { queue, totalCards, flipped } = tab;

    if (queue.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-3">
                <p className="font-display text-3xl text-primary">
                    Session complete
                </p>
                <p className="font-ui text-sm text-primary/40">
                    All cards reviewed for this session.
                </p>
            </div>
        );
    }

    // Current card is always the head of the queue
    const current = queue[0];
    const progress = (tab.completed / totalCards) * 100;

    return (
        <div className="flex flex-col items-center justify-center h-full gap-6 p-8">
            <div className="w-full max-w-xl flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <span className="font-ui text-xs text-primary/40 uppercase tracking-widest">
                        {tab.deck.deckName}
                    </span>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() =>
                                openEditor(tab.deck.deckId, tab.deck.filepath)
                            }
                            className="flex items-center gap-1.5 font-ui text-xs text-primary/30 hover:text-primary/60 transition-colors"
                            title="Edit deck">
                            <Pencil className="w-3.5 h-3.5" />
                            Edit
                        </button>
                        <span className="font-ui text-xs text-primary/40">
                            {tab.completed} / {totalCards}
                        </span>
                    </div>
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
                flipped={flipped}
                onClick={() => flipCard(tab.tabId)}
            />

            {!flipped && (
                <button
                    onClick={() => flipCard(tab.tabId)}
                    className="flex items-center gap-2 font-ui text-sm px-6 py-2.5 rounded-lg text-paper transition-all"
                    style={{ backgroundColor: "var(--color-secondary)" }}>
                    <RotateCcw className="w-4 h-4" />
                    Reveal Answer
                    <kbd className="font-ui text-xs opacity-60 border border-paper/30 rounded px-1.5">
                        Space
                    </kbd>
                </button>
            )}

            {flipped && (
                <div className="flex items-center gap-3">
                    {RECALL_BUTTONS.map(({ rating, label, key, color }) => (
                        <button
                            key={rating}
                            onClick={() => answerCard(tab.tabId, rating)}
                            className="flex flex-col items-center gap-1 px-5 py-2.5 rounded-lg border border-primary/10 hover:border-primary/25 transition-all font-ui text-sm"
                            style={{ color, borderColor: color }}>
                            <span>{label}</span>
                            <kbd className="font-ui text-xs opacity-50 border border-current rounded px-1.5">
                                {key}
                            </kbd>
                        </button>
                    ))}
                </div>
            )}

            <div className="flex items-center gap-3">
                <button
                    onClick={() => prevCard(tab.tabId)}
                    disabled={tab.history.length === 0}
                    className="flex items-center gap-1.5 font-ui text-xs px-4 py-2 rounded-lg border border-primary/10 text-primary/40 hover:text-primary/70 hover:border-primary/20 transition-all disabled:opacity-20 disabled:cursor-not-allowed">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Prev
                </button>
                <button
                    onClick={() => nextCard(tab.tabId)}
                    className="flex items-center gap-1.5 font-ui text-xs px-4 py-2 rounded-lg border border-primary/10 text-primary/40 hover:text-primary/70 hover:border-primary/20 transition-all disabled:cursor-not-allowed disabled:opacity-20">
                    Skip
                    <ArrowRight className="w-3.5 h-3.5" />
                </button>
            </div>

            <p className="font-ui text-xs text-primary/25">
                {flipped
                    ? "1 · 2 · 3 · 4 to rate"
                    : "Space to reveal · ← → to navigate"}
            </p>
        </div>
    );
};

export default Deck;
