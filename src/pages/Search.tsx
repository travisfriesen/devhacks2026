import React, { useState } from "react";
import {
    Search as SearchIcon,
    TrendingUp,
    Calendar,
    Flame,
    ChevronUp,
    ChevronDown,
    X,
    RefreshCw,
    BookOpen,
    ChevronsUpDown,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import LatexRenderer from "@/components/Flashcard/LatexRenderer";
import { ICard } from "@/types/types";

type SortKey = "dueDate" | "laters" | "deck" | "question";
type SortDir = "asc" | "desc";

type EnrichedCard = ICard & { deckName: string };

const Search = () => {
    const { decks, openTab, setNavView } = useAppStore();
    const [query, setQuery] = useState("");
    const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<SortKey>("dueDate");
    const [sortDir, setSortDir] = useState<SortDir>("asc");
    const [selectedCard, setSelectedCard] = useState<EnrichedCard | null>(null);
    const [previewFlipped, setPreviewFlipped] = useState(false);

    const allCards: EnrichedCard[] = decks.flatMap((deck) =>
        deck.cards.map((card) => ({ ...card, deckName: deck.deckName })),
    );

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const filteredCards = allCards
        .filter((c) => {
            const matchesDeck = selectedDeckId ? c.deckId === selectedDeckId : true;
            const q = query.trim().toLowerCase();
            const matchesQuery = q
                ? c.question.toLowerCase().includes(q) ||
                c.answer.toLowerCase().includes(q) ||
                c.deckName.toLowerCase().includes(q)
                : true;
            return matchesDeck && matchesQuery;
        })
        .sort((a, b) => {
            let cmp = 0;
            if (sortBy === "dueDate") {
                cmp = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            } else if (sortBy === "laters") {
                cmp = a.laters - b.laters;
            } else if (sortBy === "deck") {
                cmp = a.deckName.localeCompare(b.deckName);
            } else if (sortBy === "question") {
                cmp = a.question.localeCompare(b.question);
            }
            return sortDir === "asc" ? cmp : -cmp;
        });

    const perDeckStats = decks.map((deck) => {
        const due = deck.cards.filter((c) => new Date(c.dueDate) <= todayEnd).length;
        return { deckId: deck.deckId, deckName: deck.deckName, total: deck.cards.length, due, streak: deck.streak };
    });

    const totalDueToday = allCards.filter((c) => new Date(c.dueDate) <= todayEnd).length;

    function handleDeckClick(deckId: string) {
        setSelectedDeckId((prev) => (prev === deckId ? null : deckId));
        setSelectedCard(null);
        setPreviewFlipped(false);
    }

    function handleSortClick(key: SortKey) {
        if (sortBy === key) {
            setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        } else {
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

    function SortIcon({ col }: { col: SortKey }) {
        if (sortBy !== col) return <ChevronsUpDown className="inline w-3 h-3 ml-1 opacity-25" />;
        return sortDir === "asc"
            ? <ChevronUp className="inline w-3 h-3 ml-1 text-secondary" />
            : <ChevronDown className="inline w-3 h-3 ml-1 text-secondary" />;
    }

    const selectedDeckName = selectedDeckId
        ? decks.find((d) => d.deckId === selectedDeckId)?.deckName
        : null;

    return (
        <div className="flex-1 h-full overflow-y-auto p-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* ── Deck Browser ── */}
                <section>
                    <p className="font-ui text-xs uppercase tracking-widest text-primary/35 mb-3">
                        Decks
                    </p>
                    {decks.length === 0 ? (
                        <p className="font-ui text-sm text-primary/30">No decks yet.</p>
                    ) : (
                        <div className="grid grid-cols-3 gap-3">
                            {decks.map((deck) => {
                                const due = deck.cards.filter((c) => new Date(c.dueDate) <= todayEnd).length;
                                const isSelected = selectedDeckId === deck.deckId;
                                return (
                                    <button
                                        key={deck.deckId}
                                        onClick={() => handleDeckClick(deck.deckId)}
                                        className={`text-left border rounded-xl p-4 bg-paper transition-all cursor-pointer ${isSelected
                                                ? "border-secondary/60 ring-2 ring-secondary/25"
                                                : "border-primary/10 hover:border-primary/20"
                                            }`}
                                        style={{ boxShadow: "0 2px 12px rgba(35,0,30,0.06)" }}>
                                        <div className="flex items-start justify-between gap-2">
                                            <span className="font-display text-base text-primary leading-snug line-clamp-1">
                                                {deck.deckName}
                                            </span>
                                            {deck.streak > 0 && (
                                                <span className="flex items-center gap-0.5 font-ui text-xs text-secondary shrink-0">
                                                    <Flame className="w-3 h-3" />
                                                    {deck.streak}
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-2 flex items-center gap-3 font-ui text-xs text-primary/45">
                                            <span>{deck.cards.length} card{deck.cards.length !== 1 ? "s" : ""}</span>
                                            {due > 0 && (
                                                <span className="text-secondary/80">{due} due</span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* ── Two-column main area ── */}
                <div className="flex gap-6 items-start">

                    {/* ── Left: Search + Table ── */}
                    <div className="flex-1 min-w-0 space-y-4">
                        {/* Search bar */}
                        <div className="relative">
                            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/30 pointer-events-none" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search questions, answers, or decks…"
                                className="w-full pl-10 pr-9 py-2.5 font-ui text-sm bg-paper border border-primary/15 rounded-xl text-primary placeholder:text-primary/30 focus:outline-none focus:border-secondary/50 transition-colors"
                            />
                            {query && (
                                <button
                                    onClick={() => setQuery("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/30 hover:text-primary/60 transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Active filter chip */}
                        {selectedDeckName && (
                            <div className="flex items-center gap-2">
                                <span className="font-ui text-xs text-primary/40">Filtered by:</span>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-secondary/10 border border-secondary/20 rounded-full font-ui text-xs text-secondary">
                                    {selectedDeckName}
                                    <button onClick={() => setSelectedDeckId(null)}>
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            </div>
                        )}

                        {/* Result count */}
                        <p className="font-ui text-xs uppercase tracking-widest text-primary/35">
                            {query.trim() || selectedDeckId
                                ? `${filteredCards.length} of ${allCards.length} card${allCards.length !== 1 ? "s" : ""}`
                                : `All Cards · ${allCards.length}`}
                        </p>

                        {/* Table */}
                        <div
                            className="border border-primary/10 rounded-xl overflow-hidden bg-paper"
                            style={{ boxShadow: "0 2px 12px rgba(35,0,30,0.06)" }}>
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-primary/8">
                                        {(
                                            [
                                                { label: "Question", key: "question" as SortKey },
                                                { label: "Deck", key: "deck" as SortKey },
                                                { label: "Due Date", key: "dueDate" as SortKey },
                                                { label: "Laters", key: "laters" as SortKey },
                                            ] as const
                                        ).map(({ label, key }) => (
                                            <th
                                                key={key}
                                                onClick={() => handleSortClick(key)}
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
                                                {query.trim()
                                                    ? "No cards match your search"
                                                    : "No cards yet — open a deck from the sidebar"}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredCards.map((card) => {
                                            const isActive = selectedCard?.cardId === card.cardId;
                                            const isOverdue = new Date(card.dueDate) <= todayEnd;
                                            return (
                                                <tr
                                                    key={card.cardId}
                                                    onClick={() => handleRowClick(card)}
                                                    className={`border-b border-primary/5 last:border-0 transition-colors cursor-pointer ${isActive
                                                            ? "bg-secondary/[0.06]"
                                                            : "hover:bg-primary/[0.03]"
                                                        }`}>
                                                    <td className="px-5 py-3 font-ui text-sm text-primary/70 max-w-[220px] truncate">
                                                        {card.question.replace(/\$+[^$]+\$+/g, "…")}
                                                    </td>
                                                    <td className="px-5 py-3 font-ui text-sm text-secondary/80">
                                                        {card.deckName}
                                                    </td>
                                                    <td className={`px-5 py-3 font-ui text-sm ${isOverdue ? "text-secondary/80 font-medium" : "text-primary/50"}`}>
                                                        {new Date(card.dueDate).toLocaleDateString()}
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
                    </div>

                    {/* ── Right: Stats + Preview ── */}
                    <div className="w-72 shrink-0 space-y-4">

                        {/* Stats panel */}
                        <div
                            className="border border-primary/10 rounded-xl bg-paper p-5 space-y-4"
                            style={{ boxShadow: "0 2px 12px rgba(35,0,30,0.06)" }}>
                            <p className="font-ui text-xs uppercase tracking-widest text-primary/35">
                                Stats
                            </p>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-0.5">
                                    <span className="font-ui text-xs text-primary/35 flex items-center gap-1">
                                        <BookOpen className="w-3 h-3" /> Total Cards
                                    </span>
                                    <span className="font-display text-2xl text-primary">{allCards.length}</span>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="font-ui text-xs text-primary/35 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> Due Today
                                    </span>
                                    <span className={`font-display text-2xl ${totalDueToday > 0 ? "text-secondary" : "text-primary"}`}>
                                        {totalDueToday}
                                    </span>
                                </div>
                            </div>

                            {perDeckStats.length > 0 && (
                                <div className="space-y-1 pt-1 border-t border-primary/8">
                                    {perDeckStats.map((s) => (
                                        <div
                                            key={s.deckId}
                                            onClick={() => handleDeckClick(s.deckId)}
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
                                                        <Flame className="w-3 h-3" />{s.streak}
                                                    </span>
                                                )}
                                                {s.due > 0 && (
                                                    <span className="font-ui text-xs text-secondary/80">{s.due} due</span>
                                                )}
                                                <span className="font-ui text-xs text-primary/35">{s.total}</span>
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
                                style={{ boxShadow: "0 2px 12px rgba(35,0,30,0.06)" }}>
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
                                        text={previewFlipped ? selectedCard.answer : selectedCard.question}
                                    />
                                </div>

                                <div className="flex items-center gap-2 pt-1">
                                    <button
                                        onClick={() => setPreviewFlipped((f) => !f)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/15 font-ui text-xs text-primary/60 hover:border-primary/30 hover:text-primary/80 transition-colors">
                                        <RefreshCw className="w-3 h-3" />
                                        Flip
                                    </button>
                                    <button
                                        onClick={() => handleOpenDeck(selectedCard)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-ui text-xs text-paper transition-colors"
                                        style={{ background: "var(--color-secondary)" }}>
                                        <TrendingUp className="w-3 h-3" />
                                        Open Deck
                                    </button>
                                </div>

                                <p className="font-ui text-xs text-primary/30">
                                    {selectedCard.deckName} · due {new Date(selectedCard.dueDate).toLocaleDateString()} · {selectedCard.laters} laters
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

