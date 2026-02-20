import { card } from "../types/types";

/**
 * Retrieves a card from the database.
 * Returns null if the card does not exist.
 * @param cardId
 * @param deckId
 */
export function retrieveCard(cardId: string, deckId: string): card {
    return null;
}

/**
 * Retrieves all the cards from the database with the given deckId.
 * Returns null if the deck does not exist.
 * @param deckId
 */
export function retrieveCards(deckId: string): card[] {
    return null;
}

/**
 * Retrieves all the cards from the database.
 * Returns null if the deck does not exist.
 */
export function retrieveAllCards(): card[] {
    return null;
}

/**
 * Creates the card in the database.
 * Returns true if successful, false otherwise.
 * @param card
 * @param deckId
 */
export function createCard(card: card, deckId: string): boolean {
    return false;
}

/**
 * Creates the cards in the database for the given deckId.
 * Should only be used on the first time a deck is created/imported.
 * Returns true if successful, false otherwise.
 * @param cards
 * @param deckId
 */
export function createCards(cards: card[], deckId: string): boolean {
    return false;
}

/**
 * Deletes a card from the database for the given cardId and deckId
 * Returns true if successful, false otherwise.
 * @param cardId
 * @param deckId
 */
export function deleteCard(cardId: string, deckId: string): boolean {
    return false;
}
