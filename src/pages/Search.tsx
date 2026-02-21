import {TrendingUp, Calendar, Flame, X} from "lucide-react";
import React, { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

const Search = () => {
    const { decks, openTab, setNavView } = useAppStore();
    const [query, setQuery] = useState("");

    const allCards = decks.flatMap((deck) =>
        deck.cards.map((card) => ({ ...card, deckName: deck.deckName })),
    );

    const filteredCards = query.trim()
        ? allCards.filter(
            (c) =>
                c.question.toLowerCase().includes(query.toLowerCase()) ||
                c.answer.toLowerCase().includes(query.toLowerCase()) ||
                c.deckName.toLowerCase().includes(query.toLowerCase()),
        )
        : allCards;

    return (
        <div className="flex-1 h-full overflow-y-auto p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Search input */}
                <div className="relative">
                    <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/30 pointer-events-none" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search questions, answers, or decks…"
                        className="w-full pl-10 pr-4 py-2.5 font-ui text-sm bg-paper border border-primary/15 rounded-xl text-primary placeholder:text-primary/30 focus:outline-none focus:border-secondary/50 transition-colors"
                    />
                </div>

                <section>
                    <p className="font-ui text-xs uppercase tracking-widest text-primary/35 mb-3">
                        {query.trim()
                            ? `${filteredCards.length} result${filteredCards.length !== 1 ? "s" : ""}`
                            : "All Cards"}
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
                                {filteredCards.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-5 py-8 text-center font-ui text-sm text-primary/30">
                                            {query.trim()
                                                ? "No cards match your search"
                                                : "No cards yet — open a deck from the sidebar"}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCards.map((card) => (
                                        <tr
                                            key={card.cardId}
                                            className="border-b border-primary/5 last:border-0 hover:bg-primary/[0.03] transition-colors cursor-pointer"
                                            onClick={() => {
                                                const deck = decks.find(
                                                    (d) =>
                                                        d.deckId === card.deckId,
                                                );
                                                if (deck) openTab(deck);
                                            }}>
                                            <td className="px-5 py-3 font-ui text-sm text-primary/70 max-w-[280px] truncate">
                                                {card.question.replace(
                                                    /\$+[^$]+\$+/g,
                                                    "…",
                                                )}
                                            </td>
                                            <td className="px-5 py-3 font-ui text-sm text-secondary/80">
                                                {card.deckName}
                                            </td>
                                            <td className="px-5 py-3 font-ui text-sm text-primary/50">
                                                {new Date(card.dueDate).toLocaleDateString()}
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

