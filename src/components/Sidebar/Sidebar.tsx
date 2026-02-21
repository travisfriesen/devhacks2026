import React, { useEffect, useRef, useState } from "react";
import {
    BookOpen,
    ChevronRight,
    ChevronDown,
    FilePlus,
    FolderPlus,
    Flame,
    PanelLeftClose,
    Plus,
    Star,
    Trash2,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { BOTTOM_NAV } from "@/global/constants";
import { IDeck, ICard } from "@/types/types";

const Sidebar = () => {
    const {
        sidebarVisible,
        toggleSidebar,
        openTab,
        activeTabId,
        tabs,
        decks,
        navView,
        setNavView,
        pinnedDeckIds,
        togglePinDeck,
        loadDecksFromDB,
        openEditor,
        createDeck,
        renameDeck,
        removeDeck,
        deleteCard,
        addCard,
        editingDeckId,
        editingCardId,
    } = useAppStore();

    const [expandedDeckIds, setExpandedDeckIds] = useState<Set<string>>(
        new Set(),
    );
    const [renamingDeckId, setRenamingDeckId] = useState<string | null>(null);
    const [renameValue, setRenameValue] = useState("");
    const [isCreatingDeck, setIsCreatingDeck] = useState(false);
    const [newDeckName, setNewDeckName] = useState("");

    const renameInputRef = useRef<HTMLInputElement>(null);
    const newDeckInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadDecksFromDB();
    }, []);

    useEffect(() => {
        if (renamingDeckId && renameInputRef.current) {
            renameInputRef.current.focus();
            renameInputRef.current.select();
        }
    }, [renamingDeckId]);

    useEffect(() => {
        if (isCreatingDeck && newDeckInputRef.current) {
            newDeckInputRef.current.focus();
        }
    }, [isCreatingDeck]);

    const toggleExpand = (deckId: string) => {
        setExpandedDeckIds((prev) => {
            const next = new Set(prev);
            if (next.has(deckId)) next.delete(deckId);
            else next.add(deckId);
            return next;
        });
    };

    const handleAddCardToDeck = (e: React.MouseEvent, deck: IDeck) => {
        e.stopPropagation();
        const newCard: ICard = {
            deckId: deck.deckId,
            cardId: `${deck.deckId}-${crypto.randomUUID()}`,
            question: "",
            answer: "",
            laters: 0,
            dueDate: new Date(),
        };
        addCard(deck.deckId, newCard);
        setExpandedDeckIds((prev) => new Set([...prev, deck.deckId]));
        openEditor(deck.deckId, newCard.cardId);
    };

    const handleStartRename = (e: React.MouseEvent, deck: IDeck) => {
        e.stopPropagation();
        setRenamingDeckId(deck.deckId);
        setRenameValue(deck.deckName);
    };

    const handleConfirmRename = () => {
        if (renamingDeckId && renameValue.trim()) {
            renameDeck(renamingDeckId, renameValue.trim());
        }
        setRenamingDeckId(null);
    };

    const handleRenameKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleConfirmRename();
        if (e.key === "Escape") setRenamingDeckId(null);
    };

    const handleStartCreateDeck = () => {
        setIsCreatingDeck(true);
        setNewDeckName("");
    };

    const handleConfirmCreateDeck = () => {
        const name = newDeckName.trim();
        if (name) createDeck(name);
        setIsCreatingDeck(false);
        setNewDeckName("");
    };

    const handleCreateDeckKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleConfirmCreateDeck();
        if (e.key === "Escape") {
            setIsCreatingDeck(false);
            setNewDeckName("");
        }
    };

    return (
        <aside
            className="h-full shrink-0 bg-primary border-r border-secondary/30 flex flex-col transition-all duration-200 overflow-hidden"
            style={{ width: sidebarVisible ? "16rem" : "2.75rem" }}>
            {/* Header */}
            <div
                className="flex items-center border-b border-secondary/20 shrink-0"
                style={{
                    height: "55px",
                    padding: sidebarVisible ? "0 0.5rem 0 0.5rem" : "0",
                }}>
                {sidebarVisible ? (
                    <>
                        <button
                            className="flex items-center shrink-0"
                            onClick={() => setNavView("decks")}>
                            <img
                                className="brightness-150 hover:brightness-200"
                                src="logo.svg"
                                alt="Logo"
                                style={{ height: "40px", width: "75px" }}
                            />
                        </button>
                        <span className="text-white/80 font-serif text-xl text-center leading-relaxed font-semibold flex-1 select-none">
                            GGC
                        </span>
                        <button
                            onClick={handleStartCreateDeck}
                            className="flex items-center p-1.5 text-paper/40 hover:text-paper transition-colors"
                            title="New Deck">
                            <FolderPlus className="w-4 h-4" />
                        </button>
                        <button
                            onClick={toggleSidebar}
                            className="flex items-center p-1.5 text-paper/40 hover:text-paper transition-colors"
                            title="Hide sidebar">
                            <PanelLeftClose className="w-4 h-4" />
                        </button>
                    </>
                ) : (
                    <button
                        className="w-full flex items-center justify-center"
                        onClick={toggleSidebar}>
                        <img
                            className="brightness-150 hover:brightness-200"
                            src="logo.svg"
                            alt="Logo"
                            style={{ height: "30px", width: "100%" }}
                        />
                    </button>
                )}
            </div>

            <ul className="flex-1 py-1 overflow-y-auto">
                {decks.map((deck) => {
                    const openTab_ = tabs.find(
                        (tab) => tab.deck.deckId === deck.deckId,
                    );
                    const isActiveStudy = openTab_?.tabId === activeTabId;
                    const isEditing =
                        navView === "editor" && editingDeckId === deck.deckId;
                    const isExpanded = expandedDeckIds.has(deck.deckId);
                    const isRenaming = renamingDeckId === deck.deckId;

                    return (
                        <li key={deck.deckId}>
                            <div
                                className="group flex items-center"
                                style={{
                                    backgroundColor:
                                        isActiveStudy || isEditing
                                            ? "rgba(185,49,79,0.12)"
                                            : undefined,
                                    borderLeft:
                                        isActiveStudy || isEditing
                                            ? "2px solid var(--color-secondary)"
                                            : "2px solid transparent",
                                }}>
                                {sidebarVisible ? (
                                    <>
                                        {/* Chevron */}
                                        <button
                                            onClick={() =>
                                                toggleExpand(deck.deckId)
                                            }
                                            className="shrink-0 p-1 pl-1.5 text-paper/30 hover:text-paper/70 transition-colors"
                                            title={
                                                isExpanded
                                                    ? "Collapse"
                                                    : "Expand"
                                            }>
                                            {isExpanded ? (
                                                <ChevronDown className="w-3.5 h-3.5" />
                                            ) : (
                                                <ChevronRight className="w-3.5 h-3.5" />
                                            )}
                                        </button>

                                        {/* Deck name / inline rename */}
                                        {isRenaming ? (
                                            <input
                                                ref={renameInputRef}
                                                value={renameValue}
                                                onChange={(e) =>
                                                    setRenameValue(
                                                        e.target.value,
                                                    )
                                                }
                                                onBlur={handleConfirmRename}
                                                onKeyDown={handleRenameKeyDown}
                                                className="flex-1 bg-transparent font-ui text-sm text-paper border-b border-secondary/60 outline-none min-w-0"
                                                style={{
                                                    padding: "0.4rem 0.25rem",
                                                }}
                                            />
                                        ) : (
                                            <button
                                                onClick={() => openTab(deck)}
                                                onDoubleClick={(e) =>
                                                    handleStartRename(e, deck)
                                                }
                                                title={deck.deckName}
                                                className="flex-1 text-left flex items-center gap-2 font-ui text-sm cursor-pointer min-w-0 transition-colors py-2.5 overflow-hidden"
                                                style={{
                                                    color:
                                                        isActiveStudy ||
                                                            isEditing
                                                            ? "var(--color-paper)"
                                                            : "rgba(255,253,247,0.55)",
                                                }}>
                                                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                                                <span className="truncate flex-1">
                                                    {deck.deckName}
                                                </span>
                                                {deck.streak > 0 && (
                                                    <span className="flex items-center gap-0.5 text-xs text-tertiary shrink-0 group-hover:opacity-0 transition-opacity pointer-events-none">
                                                        <Flame className="w-3 h-3" />
                                                        {deck.streak}
                                                    </span>
                                                )}
                                            </button>
                                        )}

                                        {!isRenaming && (
                                            <div className="shrink-0 flex items-center gap-0.5 pr-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        togglePinDeck(
                                                            deck.deckId,
                                                        );
                                                    }}
                                                    title={
                                                        pinnedDeckIds.includes(
                                                            deck.deckId,
                                                        )
                                                            ? "Unpin"
                                                            : "Pin"
                                                    }
                                                    className={`p-1 rounded transition-colors ${pinnedDeckIds.includes(deck.deckId) ? "text-yellow-400" : "text-paper/50 hover:text-yellow-400"}`}>
                                                    <Star
                                                        className="w-3 h-3"
                                                        fill={
                                                            pinnedDeckIds.includes(
                                                                deck.deckId,
                                                            )
                                                                ? "currentColor"
                                                                : "none"
                                                        }
                                                    />
                                                </button>
                                                <button
                                                    onClick={(e) =>
                                                        handleAddCardToDeck(
                                                            e,
                                                            deck,
                                                        )
                                                    }
                                                    title="Add card"
                                                    className="p-1 rounded text-paper/50 hover:text-paper transition-colors">
                                                    <FilePlus className="w-3 h-3" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeDeck(deck.deckId);
                                                    }}
                                                    title="Delete deck"
                                                    className="p-1 rounded text-paper/50 hover:text-red-400 transition-colors">
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <button
                                        onClick={() => openTab(deck)}
                                        title={deck.deckName}
                                        className="w-full flex items-center justify-center py-2.5 transition-colors"
                                        style={{
                                            color:
                                                isActiveStudy || isEditing
                                                    ? "var(--color-paper)"
                                                    : "rgba(255,253,247,0.5)",
                                        }}>
                                        <BookOpen className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>

                            {/* Card children */}
                            {sidebarVisible && isExpanded && (
                                <ul>
                                    {deck.cards.length === 0 ? (
                                        <li className="flex items-center gap-2 py-1.5 pl-9 pr-3">
                                            <span className="font-ui text-xs text-paper/25 italic flex-1">
                                                No cards yet
                                            </span>
                                            <button
                                                onClick={(e) =>
                                                    handleAddCardToDeck(e, deck)
                                                }
                                                className="flex items-center gap-1 font-ui text-xs text-paper/40 hover:text-paper transition-colors">
                                                <Plus className="w-3 h-3" />
                                                Add
                                            </button>
                                        </li>
                                    ) : (
                                        deck.cards.map((card, i) => {
                                            const label = card.question
                                                ? card.question
                                                    .replace(/[#*`$\\]/g, "")
                                                    .trim()
                                                    .slice(0, 32) ||
                                                `Card ${i + 1}`
                                                : `Card ${i + 1}`;
                                            const isActiveCard =
                                                navView === "editor" &&
                                                editingDeckId === deck.deckId &&
                                                editingCardId === card.cardId;
                                            return (
                                                <li
                                                    key={card.cardId}
                                                    className="group flex items-center"
                                                    style={{
                                                        backgroundColor:
                                                            isActiveCard
                                                                ? "rgba(185,49,79,0.10)"
                                                                : undefined,
                                                        borderLeft: isActiveCard
                                                            ? "2px solid var(--color-secondary)"
                                                            : "2px solid transparent",
                                                    }}>
                                                    <button
                                                        onClick={() =>
                                                            openEditor(
                                                                deck.deckId,
                                                                card.cardId,
                                                            )
                                                        }
                                                        title={
                                                            card.question ||
                                                            `Card ${i + 1}`
                                                        }
                                                        className="flex-1 text-left font-ui text-xs py-1.5 pl-9 pr-2 truncate transition-colors hover:text-paper/70"
                                                        style={{
                                                            color: isActiveCard
                                                                ? "var(--color-paper)"
                                                                : "rgba(255,253,247,0.38)",
                                                        }}>
                                                        {label}
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteCard(
                                                                deck.deckId,
                                                                card.cardId,
                                                            );
                                                        }}
                                                        title="Delete card"
                                                        className="shrink-0 mr-2 p-1 rounded text-paper/20 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all">
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </li>
                                            );
                                        })
                                    )}
                                </ul>
                            )}
                        </li>
                    );
                })}

                {/* Inline new-deck input */}
                {sidebarVisible && isCreatingDeck && (
                    <li className="flex items-center gap-2 px-3 py-1.5 border-l-2 border-secondary/60">
                        <BookOpen className="w-3.5 h-3.5 shrink-0 text-paper/40" />
                        <input
                            ref={newDeckInputRef}
                            value={newDeckName}
                            onChange={(e) => setNewDeckName(e.target.value)}
                            onBlur={handleConfirmCreateDeck}
                            onKeyDown={handleCreateDeckKeyDown}
                            placeholder="Deck name…"
                            className="flex-1 bg-transparent font-ui text-sm text-paper placeholder-paper/30 border-b border-secondary/60 outline-none min-w-0"
                            style={{ padding: "0.2rem 0.25rem" }}
                        />
                    </li>
                )}
            </ul>

            {/* Bottom nav */}
            <div className="border-t border-secondary/20 py-1">
                {BOTTOM_NAV.map(({ view, icon, label }) => {
                    const isActive =
                        navView === view &&
                        navView !== "editor" &&
                        !activeTabId;
                    return (
                        <button
                            key={view}
                            onClick={() => setNavView(view)}
                            title={!sidebarVisible ? label : undefined}
                            className="w-full flex items-center gap-2.5 font-ui text-sm transition-colors text-paper/40 hover:text-paper hover:bg-secondary/10"
                            style={{
                                padding: sidebarVisible
                                    ? "0.625rem 1rem"
                                    : "0.625rem 0",
                                justifyContent: sidebarVisible
                                    ? "flex-start"
                                    : "center",
                                backgroundColor: isActive
                                    ? "rgba(185,49,79,0.12)"
                                    : undefined,
                                color: isActive
                                    ? "var(--color-paper)"
                                    : undefined,
                                borderLeft: isActive
                                    ? "2px solid var(--color-secondary)"
                                    : "2px solid transparent",
                            }}>
                            {icon}
                            {sidebarVisible && <span>{label}</span>}
                        </button>
                    );
                })}
            </div>
        </aside>
    );
};

export default Sidebar;
