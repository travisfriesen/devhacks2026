import { card, deck } from "../types/types";

/**
 * Searches by keyword and returns all decks that contain the keyword,
 * all cards (questions or answers) that contains the keywords.
 * Returns empty arrays if nothing is found.
 * @param keyword
 */
function searchByKeyword(keyword: string): [decks: deck[], cards: card[]] {
    return [searchDecks(keyword), searchCards(keyword)];
}

/**
 * Searches all decks in the database by keyword and returns all decks that contain the keyword.
 * Returns an empty array if nothing is found.
 * @param keyword
 */
function searchDecks(keyword: string): deck[] {
    return null;
}

/**
 * Searches all cards in the database by keyword and returns all cards that contain the keyword.
 * Returns an empty array if nothing is found.
 * @param keyword
 */
function searchCards(keyword: string): card[] {
    return null;
}
