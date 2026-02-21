import React, { useState } from "react";
import YAML from "yaml";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { ICard, IDeck } from "@/types/types";
import Editor from "@/pages/Editor";

export default function EditorPage() {
    const { decks, editingDeckId, updateCard, addCard, deleteCard, setNavView } =
        useAppStore();

    const deck = decks.find((d) => d.deckId === editingDeckId);
    const [selectedCardId, setSelectedCardId] = useState<string | null>(
        deck?.cards[0]?.cardId ?? null,
    );

    const saveDeckToDisk = (updatedDeck: IDeck) => {
        if (!updatedDeck.filepath) return;
        const content = YAML.stringify(updatedDeck);
        window.electronAPI.saveFile(updatedDeck.filepath, content);
    };

    const handleBack = () => setNavView("decks");

    const handleAddCard = () => {
        if (!deck) return;
        const newCard: ICard = {
            deckId: deck.deckId,
            cardId: `${deck.deckId}-${crypto.randomUUID()}`,
            question: "",
            answer: "",
            laters: 0,
            dueDate: new Date(),
        };
        addCard(deck.deckId, newCard);
        setSelectedCardId(newCard.cardId);
        saveDeckToDisk({ ...deck, cards: [...deck.cards, newCard] });
    };

    const handleDeleteCard = (cardId: string) => {
        if (!deck) return;
        const idx = deck.cards.findIndex((c) => c.cardId === cardId);
        deleteCard(deck.deckId, cardId);
        const remaining = deck.cards.filter((c) => c.cardId !== cardId);
        setSelectedCardId(
            remaining.length === 0
                ? null
                : remaining[Math.min(idx, remaining.length - 1)].cardId,
        );
        saveDeckToDisk({ ...deck, cards: remaining });
    };

    const handleSetCard = (updated: ICard) => {
        if (!deck) return;
        updateCard(deck.deckId, updated);
        const updatedCards = deck.cards.map((c) =>
            c.cardId === updated.cardId ? updated : c,
        );
        saveDeckToDisk({ ...deck, cards: updatedCards });
    };

    if (!deck) {
        return (
            <div className="flex items-center justify-center h-full font-ui text-primary/40">
                No deck selected.
            </div>
        );
    }

    const selectedCard =
        deck.cards.find((c) => c.cardId === selectedCardId) ?? null;

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="shrink-0 flex items-center gap-4 px-8 py-4 border-b border-primary/10">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-1.5 font-ui text-sm text-primary/40 hover:text-primary transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>
                <div className="flex-1">
                    <h1 className="font-display text-2xl text-primary">
                        {deck.deckName}
                    </h1>
                    <p className="font-ui text-xs text-primary/40 mt-0.5">
                        {deck.cards.length} card
                        {deck.cards.length !== 1 ? "s" : ""} · changes saved
                        automatically
                    </p>
                </div>
                <button
                    onClick={handleAddCard}
                    className="flex items-center gap-2 font-ui text-sm px-4 py-2 rounded-lg text-paper transition-all"
                    style={{ backgroundColor: "var(--color-secondary)" }}>
                    <Plus className="w-4 h-4" />
                    Add Card
                </button>
            </div>

            {/* Body */}
            <div className="flex flex-1 overflow-hidden">
                {/* Card list sidebar */}
                <div className="w-56 shrink-0 border-r border-primary/10 overflow-y-auto py-2">
                    {deck.cards.length === 0 ? (
                        <p className="font-ui text-xs text-primary/30 px-4 py-3">
                            No cards yet.
                        </p>
                    ) : (
                        deck.cards.map((card, i) => {
                            const isSelected = card.cardId === selectedCardId;
                            return (
                                <div
                                    key={card.cardId}
                                    className="group flex items-center gap-1 px-3 py-1">
                                    <button
                                        onClick={() =>
                                            setSelectedCardId(card.cardId)
                                        }
                                        className="flex-1 text-left font-ui text-xs px-2 py-2 rounded-lg truncate transition-colors"
                                        style={{
                                            backgroundColor: isSelected
                                                ? "rgba(185,49,79,0.10)"
                                                : "transparent",
                                            color: isSelected
                                                ? "var(--color-primary)"
                                                : "rgba(35,0,30,0.45)",
                                            borderLeft: isSelected
                                                ? "2px solid var(--color-secondary)"
                                                : "2px solid transparent",
                                        }}>
                                        {card.question
                                            ? card.question
                                                .replace(/[#*`$\\]/g, "")
                                                .trim()
                                                .slice(0, 28) ||
                                            `Card ${i + 1}`
                                            : `Card ${i + 1}`}
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleDeleteCard(card.cardId)
                                        }
                                        className="shrink-0 p-1 rounded text-primary/20 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                                        title="Delete card">
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Editor pane */}
                <div className="flex-1 overflow-y-auto px-8 py-6">
                    {selectedCard ? (
                        <Editor
                            card={selectedCard}
                            setCard={handleSetCard}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                            <p className="font-display text-2xl text-primary/40">
                                No card selected
                            </p>
                            <p className="font-ui text-sm text-primary/30">
                                Click "Add Card" to get started.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
