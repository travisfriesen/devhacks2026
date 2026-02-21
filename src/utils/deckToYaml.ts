import YAML from "yaml";
import { IDeck } from "@/types/types";

function toIso(date: Date | string | undefined | null): string | null {
    if (!date) return null;
    return date instanceof Date ? date.toISOString() : date;
}

/**
 * Serializes an IDeck to a YAML string that round-trips cleanly through
 * parseYaml(). Uses `name` (not `deckName`) to match the expected YAML key,
 * and converts all Date objects to ISO strings so they are not emitted as
 * YAML !!timestamp tags.
 */
export function deckToYaml(deck: IDeck): string {
    const plain = {
        deckId: deck.deckId,
        name: deck.deckName,
        filepath: deck.filepath,
        lastUpdated: toIso(deck.lastUpdated),
        created: toIso(deck.created),
        lastUtilized: toIso(deck.lastUtilized),
        uses: deck.uses,
        streak: deck.streak,
        cards: deck.cards.map((card) => ({
            cardId: card.cardId,
            deckId: card.deckId,
            question: card.question,
            answer: card.answer,
            laters: card.laters ?? 0,
            dueDate: toIso(card.dueDate),
        })),
    };
    return YAML.stringify(plain);
}
