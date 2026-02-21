import React from "react";
import { TrendingUp, Calendar, Flame } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { HEATMAP } from "@/global/constants";

function heatColor(intensity: number): string {
    if (intensity === 0) return "bg-transparent";
    if (intensity <= 0.25) return "bg-primary/25";
    if (intensity <= 0.5) return "bg-primary/50";
    if (intensity <= 0.75) return "bg-primary/75";
    return "bg-primary";
}

const Search = () => {
    const { decks, openTab } = useAppStore();

    const allCards = decks.flatMap((deck) =>
        deck.cards.map((card) => ({ ...card, deckName: deck.deckName })),
    );

    const totalStreak = decks.reduce(
        (sum, deck) => Math.max(sum, deck.streak),
        0,
    );
    const totalCards = allCards.length;

    return (
        <div className="flex-1 h-full overflow-y-auto p-8">
            <div className="max-w-4xl mx-auto space-y-10">
                <section>
                    <p className="font-ui text-xs uppercase tracking-widest text-primary/35 mb-3">
                        All Cards
                    </p>
                    <div
                        className="border border-primary/10 rounded-xl overflow-hidden bg-paper"
                        style={{ boxShadow: "0 2px 12px rgba(35,0,30,0.06)" }}>
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-primary/8">
                                    {[
                                        "Question",
                                        "Deck",
                                        "Due Date",
                                        "Laters",
                                    ].map((heading) => (
                                        <th
                                            key={heading}
                                            className="text-left px-5 py-3 font-ui text-xs uppercase tracking-widest text-primary/35 font-medium">
                                            {heading}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {allCards.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-5 py-8 text-center font-ui text-sm text-primary/30">
                                            No cards yet — open a deck from the
                                            sidebar
                                        </td>
                                    </tr>
                                ) : (
                                    allCards.map((card, index) => (
                                        <tr
                                            key={card.cardId}
                                            className="border-b border-primary/5 last:border-0 hover:bg-primary/[0.03] transition-colors cursor-pointer"
                                            onClick={() => {
                                                const deck = decks.find(
                                                    (deck) =>
                                                        deck.deckId ===
                                                        card.deckId,
                                                );
                                                if (deck) openTab(deck);
                                            }}>
                                            <td className="px-5 py-3 font-ui text-sm text-primary/70 max-w-[280px] truncate">
                                                {card.question.replace(
                                                    // remove LaTeX for table display, ew
                                                    /\$+[^$]+\$+/g,
                                                    "…",
                                                )}
                                            </td>
                                            <td className="px-5 py-3 font-ui text-sm text-secondary/80">
                                                {card.deckName}
                                            </td>
                                            <td className="px-5 py-3 font-ui text-sm text-primary/50">
                                                {card.dueDate.toLocaleDateString()}
                                            </td>
                                            <td className="px-5 py-3 font-ui text-sm text-primary/50">
                                                {card.laters}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Search;

