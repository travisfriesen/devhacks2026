import React, { useRef, useState } from "react";
import {
    Search as SearchIcon,
    TrendingUp,
    Calendar,
    Flame,
    X,
    ChevronUp,
    ChevronDown,
    RefreshCw,
    BookOpen,
    ChevronsUpDown,
    PlayCircle,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import LatexRenderer from "@/components/Flashcard/LatexRenderer";
import { ICard } from "@/types/types";

function Highlight({ text, query }: { text: string; query: string }) {
    if (!query.trim()) return <>{text}</>;
    const idx = text.toLowerCase().indexOf(query.toLowerCase().trim());
    if (idx === -1) return <>{text}</>;
    return (
        <>
            {text.slice(0, idx)}
            <mark className="bg-secondary/20 text-secondary rounded px-0.5">
                {text.slice(idx, idx + query.trim().length)}
            </mark>
            {text.slice(idx + query.trim().length)}
        </>
    );
}

type SortKey = "dueDate" | "laters" | "deck" | "question";
type SortDir = "asc" | "desc";
type EnrichedCard = ICard & { deckName: string };

const Search = () => {
    const { decks, openTab } = useAppStore();
    const inputRef = useRef<HTMLInputElement>(null);

    const [query, setQuery] = useState("");
    const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<SortKey>("dueDate");
    const [sortDir, setSortDir] = useState<SortDir>("asc");
    const [selectedCard, setSelectedCard] = useState<EnrichedCard | null>(null);
    const [previewFlipped, setPreviewFlipped] = useState(false);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const allCards: EnrichedCard[] = decks.flatMap((deck) =>
        deck.cards.map((card) => ({ ...card, deckName: deck.deckName })),
    );

    const q = query.trim().toLowerCase();
    const isSearching = q.length > 0;

    const matchedDecks = isSearching
        ? decks.filter((d) => d.deckName.toLowerCase().includes(q))
        : [];

    const matchedCards: EnrichedCard[] = isSearching
        ? allCards.filter(
            (c) =>
                c.question.toLowerCase().includes(q) ||
                c.answer.toLowerCase().includes(q) ||
                c.deckName.toLowerCase().includes(q),
        )
        : [];

    const filteredCards = allCards
        .filter((c) => (selectedDeckId ? c.deckId === selectedDeckId : true))
        .sort((a, b) => {
            let cmp = 0;
            if (sortBy === "dueDate")
                cmp =
                    new Date(a.dueDate).getTime() -
                    new Date(b.dueDate).getTime();
            else if (sortBy === "laters") cmp = a.laters - b.laters;
            else if (sortBy === "deck")
                cmp = a.deckName.localeCompare(b.deckName);
            else if (sortBy === "question")
                cmp = a.question.localeCompare(b.question);
            return sortDir === "asc" ? cmp : -cmp;
        });

    const perDeckStats = decks.map((deck) => {
        const due = deck.cards.filter(
            (c) => new Date(c.dueDate) <= todayEnd,
        ).length;
        return {
            deckId: deck.deckId,
            deckName: deck.deckName,
            total: deck.cards.length,
            due,
            streak: deck.streak,
        };
    });

    const totalDueToday = allCards.filter(
        (c) => new Date(c.dueDate) <= todayEnd,
    ).length;

    function handleDeckClick(deckId: string) {
        setSelectedDeckId((prev) => (prev === deckId ? null : deckId));
        setSelectedCard(null);
        setPreviewFlipped(false);
    }

    function handleSortClick(key: SortKey) {
        if (sortBy === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        else {
            setSortBy(key);
            setSortDir("asc");
        }
    }

    function handleRowClick(card: EnrichedCard) {
        setSelectedCard(card);
        setPreviewFlipped(false);
    }

    function handleOpenDeck(card: EnrichedCard) {
        const deck = decks.find((d) => d.deckId === card.deckId);
        if (deck) openTab(deck);
        setSelectedCard(null);
    }

    function clearQuery() {
        setQuery("");
        inputRef.current?.focus();
    }

    function SortIcon({ col }: { col: SortKey }) {
        if (sortBy !== col)
            return (
                <ChevronsUpDown className="inline w-3 h-3 ml-1 opacity-25" />
            );
        return sortDir === "asc" ? (
            <ChevronUp className="inline w-3 h-3 ml-1 text-secondary" />
        ) : (
            <ChevronDown className="inline w-3 h-3 ml-1 text-secondary" />
        );
    }

    const selectedDeckName = selectedDeckId
        ? decks.find((d) => d.deckId === selectedDeckId)?.deckName
        : null;

    return (
        <div className="flex-1 h-full overflow-y-auto p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="relative">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/30 pointer-events-none" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        autoFocus
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search decks, questions, answers…"
                        className="w-full pl-12 pr-10 py-3.5 font-ui text-base bg-paper border border-primary/15 rounded-2xl text-primary placeholder:text-primary/30 focus:outline-none focus:border-secondary/50 focus:ring-2 focus:ring-secondary/10 transition-all"
                        style={{ boxShadow: "0 2px 16px rgba(35,0,30,0.06)" }}
                    />
                    {query && (
                        <button
                            onClick={clearQuery}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/30 hover:text-primary/60 transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <div className="flex gap-6 items-start">
                    <div className="flex-1 min-w-0 space-y-6">
                        {isSearching ? (
                            <>
                                {matchedDecks.length > 0 && (
                                    <section>
                                        <p className="font-ui text-xs uppercase tracking-widest text-primary/35 mb-3">
                                            Decks · {matchedDecks.length}
                                        </p>
                                        <div
                                            className="border border-primary/10 rounded-xl overflow-hidden bg-paper"
                                            style={{
                                                boxShadow:
                                                    "0 2px 12px rgba(35,0,30,0.06)",
                                            }}>
                                            {matchedDecks.map((deck, i) => {
                                                const due = deck.cards.filter(
                                                    (c) =>
                                                        new Date(c.dueDate) <=
                                                        todayEnd,
                                                ).length;
                                                return (
                                                    <div
                                                        key={deck.deckId}
                                                        className={`flex items-center justify-between px-5 py-3.5 cursor-pointer transition-colors hover:bg-primary/[0.03] ${i > 0 ? "border-t border-primary/5" : ""}`}
                                                        onClick={() =>
                                                            openTab(deck)
                                                        }>
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <BookOpen className="w-4 h-4 text-secondary/60 shrink-0" />
                                                            <div className="min-w-0">
                                                                <p className="font-ui text-sm text-primary truncate">
                                                                    <Highlight
                                                                        text={
                                                                            deck.deckName
                                                                        }
                                                                        query={
                                                                            query
                                                                        }
                                                                    />
                                                                </p>
                                                                <p className="font-ui text-xs text-primary/40 mt-0.5">
                                                                    {
                                                                        deck
                                                                            .cards
                                                                            .length
                                                                    }{" "}
                                                                    card
                                                                    {deck.cards
                                                                        .length !==
                                                                        1
                                                                        ? "s"
                                                                        : ""}
                                                                    {due >
                                                                        0 && (
                                                                            <span className="text-secondary/80">
                                                                                {" "}
                                                                                ·{" "}
                                                                                {
                                                                                    due
                                                                                }{" "}
                                                                                due
                                                                            </span>
                                                                        )}
                                                                    {deck.streak >
                                                                        0 && (
                                                                            <span className="inline-flex items-center gap-0.5 ml-1 text-secondary">
                                                                                <Flame className="w-3 h-3" />
                                                                                {
                                                                                    deck.streak
                                                                                }
                                                                            </span>
                                                                        )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openTab(deck);
                                                            }}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-ui text-xs text-paper shrink-0 ml-4"
                                                            style={{
                                                                background:
                                                                    "var(--color-secondary)",
                                                            }}>
                                                            <PlayCircle className="w-3.5 h-3.5" />
                                                            Open
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </section>
                                )}

                                {/* Card results */}
                                <section>
                                    <p className="font-ui text-xs uppercase tracking-widest text-primary/35 mb-3">
                                        Cards · {matchedCards.length}
                                    </p>
                                    {matchedCards.length === 0 &&
                                        matchedDecks.length === 0 ? (
                                        <div className="flex flex-col items-center gap-2 py-12 text-center">
                                            <SearchIcon className="w-8 h-8 text-primary/15" />
                                            <p className="font-ui text-sm text-primary/35">
                                                No results for{" "}
                                                <span className="italic">
                                                    "{query}"
                                                </span>
                                            </p>
                                        </div>
                                    ) : matchedCards.length === 0 ? (
                                        <p className="font-ui text-sm text-primary/30 px-1">
                                            No matching cards.
                                        </p>
                                    ) : (
                                        <div
                                            className="border border-primary/10 rounded-xl overflow-hidden bg-paper"
                                            style={{
                                                boxShadow:
                                                    "0 2px 12px rgba(35,0,30,0.06)",
                                            }}>
                                            {matchedCards.map((card, i) => {
                                                const isActive =
                                                    selectedCard?.cardId ===
                                                    card.cardId;
                                                const isOverdue =
                                                    new Date(card.dueDate) <=
                                                    todayEnd;
                                                const plainQuestion =
                                                    card.question.replace(
                                                        /\$+[^$]+\$+/g,
                                                        "…",
                                                    );
                                                const answerMatches =
                                                    !card.question
                                                        .toLowerCase()
                                                        .includes(q) &&
                                                    card.answer
                                                        .toLowerCase()
                                                        .includes(q);
                                                const snippet = answerMatches
                                                    ? card.answer.replace(
                                                        /\$+[^$]+\$+/g,
                                                        "…",
                                                    )
                                                    : plainQuestion;
                                                return (
                                                    <div
                                                        key={card.cardId}
                                                        onClick={() =>
                                                            handleRowClick(card)
                                                        }
                                                        className={`flex items-center justify-between px-5 py-3.5 cursor-pointer transition-colors ${i > 0 ? "border-t border-primary/5" : ""} ${isActive ? "bg-secondary/[0.06]" : "hover:bg-primary/[0.03]"}`}>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="font-ui text-sm text-primary/80 truncate">
                                                                <Highlight
                                                                    text={
                                                                        snippet
                                                                    }
                                                                    query={
                                                                        query
                                                                    }
                                                                />
                                                            </p>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                <span className="font-ui text-xs text-secondary/70">
                                                                    {
                                                                        card.deckName
                                                                    }
                                                                </span>
                                                                <span
                                                                    className={`font-ui text-xs ${isOverdue ? "text-secondary/80 font-medium" : "text-primary/35"}`}>
                                                                    due{" "}
                                                                    {new Date(
                                                                        card.dueDate,
                                                                    ).toLocaleDateString()}
                                                                </span>
                                                                {answerMatches && (
                                                                    <span className="font-ui text-xs text-primary/30 italic">
                                                                        match in
                                                                        answer
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </section>
                            </>
                        ) : (
                            <>
                                <section>
                                    <p className="font-ui text-xs uppercase tracking-widest text-primary/35 mb-3">
                                        Decks
                                    </p>
                                    {decks.length === 0 ? (
                                        <p className="font-ui text-sm text-primary/30">
                                            No decks yet.
                                        </p>
                                    ) : (
                                        <div className="grid grid-cols-3 gap-3">
                                            {decks.map((deck) => {
                                                const due = deck.cards.filter(
                                                    (c) =>
                                                        new Date(c.dueDate) <=
                                                        todayEnd,
                                                ).length;
                                                const isSelected =
                                                    selectedDeckId ===
                                                    deck.deckId;
                                                return (
                                                    <button
                                                        key={deck.deckId}
                                                        onClick={() =>
                                                            handleDeckClick(
                                                                deck.deckId,
                                                            )
                                                        }
                                                        className={`text-left border rounded-xl p-4 bg-paper transition-all cursor-pointer ${isSelected
                                                            ? "border-secondary/60 ring-2 ring-secondary/25"
                                                            : "border-primary/10 hover:border-primary/20"
                                                            }`}
                                                        style={{
                                                            boxShadow:
                                                                "0 2px 12px rgba(35,0,30,0.06)",
                                                        }}>
                                                        <div className="flex items-start justify-between gap-2">
                                                            <span className="font-display text-base text-primary leading-snug line-clamp-1">
                                                                {deck.deckName}
                                                            </span>
                                                            {deck.streak >
                                                                0 && (
                                                                    <span className="flex items-center gap-0.5 font-ui text-xs text-secondary shrink-0">
                                                                        <Flame className="w-3 h-3" />
                                                                        {
                                                                            deck.streak
                                                                        }
                                                                    </span>
                                                                )}
                                                        </div>
                                                        <div className="mt-2 flex items-center gap-3 font-ui text-xs text-primary/45">
                                                            <span>
                                                                {
                                                                    deck.cards
                                                                        .length
                                                                }{" "}
                                                                card
                                                                {deck.cards
                                                                    .length !==
                                                                    1
                                                                    ? "s"
                                                                    : ""}
                                                            </span>
                                                            {due > 0 && (
                                                                <span className="text-secondary/80">
                                                                    {due} due
                                                                </span>
                                                            )}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </section>

                                {/* Active filter chip */}
                                {selectedDeckName && (
                                    <div className="flex items-center gap-2">
                                        <span className="font-ui text-xs text-primary/40">
                                            Filtered by:
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-secondary/10 border border-secondary/20 rounded-full font-ui text-xs text-secondary">
                                            {selectedDeckName}
                                            <button
                                                onClick={() =>
                                                    setSelectedDeckId(null)
                                                }>
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    </div>
                                )}

                                <p className="font-ui text-xs uppercase tracking-widest text-primary/35 mb-2">
                                    {selectedDeckId
                                        ? `${filteredCards.length} of ${allCards.length} card${allCards.length !== 1 ? "s" : ""}`
                                        : `All Cards · ${allCards.length}`}
                                </p>

                                <div
                                    className="border border-primary/10 rounded-xl overflow-hidden bg-paper"
                                    style={{
                                        boxShadow:
                                            "0 2px 12px rgba(35,0,30,0.06)",
                                    }}>
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-primary/8">
                                                {(
                                                    [
                                                        {
                                                            label: "Question",
                                                            key: "question" as SortKey,
                                                        },
                                                        {
                                                            label: "Deck",
                                                            key: "deck" as SortKey,
                                                        },
                                                        {
                                                            label: "Due Date",
                                                            key: "dueDate" as SortKey,
                                                        },
                                                        {
                                                            label: "Laters",
                                                            key: "laters" as SortKey,
                                                        },
                                                    ] as const
                                                ).map(({ label, key }) => (
                                                    <th
                                                        key={key}
                                                        onClick={() =>
                                                            handleSortClick(key)
                                                        }
                                                        className="text-left px-5 py-3 font-ui text-xs uppercase tracking-widest text-primary/35 font-medium cursor-pointer select-none hover:text-primary/60 transition-colors">
                                                        {label}
                                                        <SortIcon col={key} />
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
                                                        No cards yet — create a
                                                        deck to get started
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredCards.map((card) => {
                                                    const isActive =
                                                        selectedCard?.cardId ===
                                                        card.cardId;
                                                    const isOverdue =
                                                        new Date(
                                                            card.dueDate,
                                                        ) <= todayEnd;
                                                    return (
                                                        <tr
                                                            key={card.cardId}
                                                            onClick={() =>
                                                                handleRowClick(
                                                                    card,
                                                                )
                                                            }
                                                            className={`border-b border-primary/5 last:border-0 transition-colors cursor-pointer ${isActive ? "bg-secondary/[0.06]" : "hover:bg-primary/[0.03]"}`}>
                                                            <td className="px-5 py-3 font-ui text-sm text-primary/70 max-w-[220px] truncate">
                                                                {card.question.replace(
                                                                    /\$+[^$]+\$+/g,
                                                                    "…",
                                                                )}
                                                            </td>
                                                            <td className="px-5 py-3 font-ui text-sm text-secondary/80">
                                                                {card.deckName}
                                                            </td>
                                                            <td
                                                                className={`px-5 py-3 font-ui text-sm ${isOverdue ? "text-secondary/80 font-medium" : "text-primary/50"}`}>
                                                                {new Date(
                                                                    card.dueDate,
                                                                ).toLocaleDateString()}
                                                            </td>
                                                            <td className="px-5 py-3 font-ui text-sm text-primary/50">
                                                                {card.laters}
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>

                    {/* ── Right: Stats + Preview ── */}
                    <div className="w-72 shrink-0 space-y-4">
                        {/* Stats panel */}
                        <div
                            className="border border-primary/10 rounded-xl bg-paper p-5 space-y-4"
                            style={{
                                boxShadow: "0 2px 12px rgba(35,0,30,0.06)",
                            }}>
                            <p className="font-ui text-xs uppercase tracking-widest text-primary/35">
                                Stats
                            </p>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-0.5">
                                    <span className="font-ui text-xs text-primary/35 flex items-center gap-1">
                                        <BookOpen className="w-3 h-3" /> Total
                                        Cards
                                    </span>
                                    <span className="font-display text-2xl text-primary">
                                        {allCards.length}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="font-ui text-xs text-primary/35 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> Due
                                        Today
                                    </span>
                                    <span
                                        className={`font-display text-2xl ${totalDueToday > 0 ? "text-secondary" : "text-primary"}`}>
                                        {totalDueToday}
                                    </span>
                                </div>
                            </div>

                            {perDeckStats.length > 0 && (
                                <div className="space-y-1 pt-1 border-t border-primary/8">
                                    {perDeckStats.map((s) => (
                                        <div
                                            key={s.deckId}
                                            onClick={() =>
                                                handleDeckClick(s.deckId)
                                            }
                                            className={`flex items-center justify-between py-1.5 px-2 rounded-lg cursor-pointer transition-colors ${selectedDeckId === s.deckId
                                                ? "bg-secondary/10"
                                                : "hover:bg-primary/[0.04]"
                                                }`}>
                                            <span className="font-ui text-xs text-primary/70 truncate max-w-[120px]">
                                                {s.deckName}
                                            </span>
                                            <div className="flex items-center gap-2 shrink-0">
                                                {s.streak > 0 && (
                                                    <span className="flex items-center gap-0.5 font-ui text-xs text-secondary">
                                                        <Flame className="w-3 h-3" />
                                                        {s.streak}
                                                    </span>
                                                )}
                                                {s.due > 0 && (
                                                    <span className="font-ui text-xs text-secondary/80">
                                                        {s.due} due
                                                    </span>
                                                )}
                                                <span className="font-ui text-xs text-primary/35">
                                                    {s.total}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Card preview pane */}
                        {selectedCard && (
                            <div
                                className="border border-primary/10 rounded-xl bg-paper p-5 space-y-3"
                                style={{
                                    boxShadow: "0 2px 12px rgba(35,0,30,0.06)",
                                }}>
                                <div className="flex items-center justify-between">
                                    <p className="font-ui text-xs uppercase tracking-widest text-primary/35">
                                        {previewFlipped ? "Answer" : "Question"}
                                    </p>
                                    <button
                                        onClick={() => setSelectedCard(null)}
                                        className="text-primary/30 hover:text-primary/60 transition-colors">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="min-h-[80px] font-ui text-sm text-primary/80 leading-relaxed">
                                    <LatexRenderer
                                        text={
                                            previewFlipped
                                                ? selectedCard.answer
                                                : selectedCard.question
                                        }
                                    />
                                </div>

                                <div className="flex items-center gap-2 pt-1">
                                    <button
                                        onClick={() =>
                                            setPreviewFlipped((f) => !f)
                                        }
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/15 font-ui text-xs text-primary/60 hover:border-primary/30 hover:text-primary/80 transition-colors">
                                        <RefreshCw className="w-3 h-3" />
                                        Flip
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleOpenDeck(selectedCard)
                                        }
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-ui text-xs text-paper transition-colors"
                                        style={{
                                            background:
                                                "var(--color-secondary)",
                                        }}>
                                        <TrendingUp className="w-3 h-3" />
                                        Open Deck
                                    </button>
                                </div>

                                <p className="font-ui text-xs text-primary/30">
                                    {selectedCard.deckName} · due{" "}
                                    {new Date(
                                        selectedCard.dueDate,
                                    ).toLocaleDateString()}{" "}
                                    · {selectedCard.laters} laters
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Search;
