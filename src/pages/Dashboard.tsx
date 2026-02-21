import React from "react";
import { TrendingUp, Calendar, Flame, PlayCircle, Star, Pencil } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { HEATMAP } from "@/global/constants";
import InspirationalQuotes from "@/components/InspirationalQuotes/InspirationalQuotes";

function heatColor(intensity: number): string {
    if (intensity === 0) return "bg-transparent";
    if (intensity <= 0.25) return "bg-primary/25";
    if (intensity <= 0.5) return "bg-primary/50";
    if (intensity <= 0.75) return "bg-primary/75";
    return "bg-primary";
}

const Dashboard = () => {
    const { decks, openTab, pinnedDeckIds, togglePinDeck, openEditor } = useAppStore();

    const allCards = decks.flatMap((deck) =>
        deck.cards.map((card) => ({ ...card, deckName: deck.deckName })),
    );

    const totalStreak = decks.reduce(
        (sum, deck) => Math.max(sum, deck.streak),
        0,
    );

    const lastDeck =
        decks.length > 0
            ? [...decks].sort(
                (a, b) =>
                    new Date(b.lastUtilized).getTime() -
                    new Date(a.lastUtilized).getTime(),
            )[0]
            : null;

    const totalCards = allCards.length;

    const pinnedDecks = decks.filter((d) => pinnedDeckIds.includes(d.deckId));

    return (
        <div className="flex flex-col flex-1 h-full overflow-y-auto p-8 items-center justify-center">
            <div className="max-w-4xl mx-auto space-y-10">
                <section>
                    <InspirationalQuotes />
                </section>
                {lastDeck && (
                    <section>
                        <p className="font-ui text-xs uppercase tracking-widest text-primary/35 mb-3">
                            Continue Where You Left Off
                        </p>
                        <div
                            className="flex items-center justify-between border border-primary/10 rounded-xl p-5 bg-paper"
                            style={{
                                boxShadow: "0 2px 12px rgba(35,0,30,0.06)",
                            }}>
                            <div className="flex flex-col gap-1">
                                <span className="font-display text-2xl text-primary">
                                    {lastDeck.deckName}
                                </span>
                                <span className="font-ui text-xs text-primary/40">
                                    {lastDeck.cards.length} cards · Last studied{" "}
                                    {new Date(
                                        lastDeck.lastUtilized,
                                    ).toLocaleDateString(undefined, {
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => openEditor(lastDeck.deckId)}
                                    className="flex items-center gap-2 font-ui text-sm px-4 py-2.5 rounded-lg border border-primary/15 text-primary/50 hover:text-primary hover:border-primary/30 transition-all">
                                    <Pencil className="w-4 h-4" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => openTab(lastDeck)}
                                    className="flex items-center gap-2 font-ui text-sm px-5 py-2.5 rounded-lg text-paper transition-all"
                                    style={{
                                        backgroundColor: "var(--color-secondary)",
                                    }}>
                                    <PlayCircle className="w-4 h-4" />
                                    Resume
                                </button>
                            </div>
                        </div>
                    </section>
                )}
                {pinnedDecks.length > 0 && (
                    <section>
                        <p className="font-ui text-xs uppercase tracking-widest text-primary/35 mb-3">
                            Pinned Decks
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            {pinnedDecks.map((deck) => (
                                <div
                                    key={deck.deckId}
                                    className="group flex items-center justify-between border border-primary/10 rounded-xl px-4 py-3 bg-paper transition-colors hover:border-primary/20"
                                    style={{
                                        boxShadow:
                                            "0 2px 12px rgba(35,0,30,0.06)",
                                    }}>
                                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                                        <span className="font-display text-base text-primary truncate">
                                            {deck.deckName}
                                        </span>
                                        <span className="font-ui text-xs text-primary/40">
                                            {deck.cards.length} cards
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0 ml-3">
                                        <button
                                            onClick={() =>
                                                togglePinDeck(deck.deckId)
                                            }
                                            title="Unpin"
                                            className="p-1 rounded text-yellow-500 opacity-40 hover:opacity-100 transition-opacity">
                                            <Star
                                                className="w-3.5 h-3.5"
                                                fill="currentColor"
                                            />
                                        </button>
                                        <button
                                            onClick={() => openEditor(deck.deckId)}
                                            title="Edit deck"
                                            className="p-1 rounded text-primary/30 hover:text-primary/70 transition-colors">
                                            <Pencil className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => openTab(deck)}
                                            className="flex items-center gap-1.5 font-ui text-xs px-3 py-1.5 rounded-lg text-paper transition-all"
                                            style={{
                                                backgroundColor:
                                                    "var(--color-secondary)",
                                            }}>
                                            <PlayCircle className="w-3.5 h-3.5" />
                                            Open
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                <section>
                    <p className="font-ui text-xs uppercase tracking-widest text-primary/35 mb-3">
                        Activity — Last 6 Months
                    </p>
                    <div className="flex gap-1">
                        {HEATMAP.map((week, wi) => (
                            <div
                                key={wi}
                                className="flex flex-col gap-1">
                                {week.map((val, di) => (
                                    <div
                                        key={di}
                                        className={`w-3 h-3 rounded-sm border border-primary/10 ${heatColor(val)}`}
                                        title={`${val} cards reviewed`}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </section>

                {/* TODO: Replace this with actual DB data */}
                <section className="grid grid-cols-3 gap-4">
                    {[
                        {
                            icon: <TrendingUp className="w-4 h-4" />,
                            label: "Retention Rate",
                            value: "87.3%",
                        },
                        {
                            icon: <Calendar className="w-4 h-4" />,
                            label: "Cards Due Today",
                            value: totalCards.toString(),
                        },
                        {
                            icon: <Flame className="w-4 h-4" />,
                            label: "Best Streak",
                            value: `${totalStreak} days`,
                        },
                    ].map(({ icon, label, value }) => (
                        <div
                            key={label}
                            className="border border-primary/10 rounded-xl p-5 bg-paper"
                            style={{
                                boxShadow: "0 2px 12px rgba(35,0,30,0.06)",
                            }}>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-secondary">{icon}</span>
                                <span className="font-ui text-xs uppercase tracking-widest text-primary/40">
                                    {label}
                                </span>
                            </div>
                            <div className="font-display text-4xl text-primary">
                                {value}
                            </div>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
