import { card } from "../types/types";

/**
 * Gets a card from the database. Returns null if the card does not exist.
 * @param cardId
 * @param deckId
 */
export function getCard(cardId: string, deckId: string): card {
    return null;
}

/**
 * Gets all the cards from the database with the given deckId. Returns null if the deck does not exist.
 * @param deckId
 */
export function getCards(deckId: string): card[] {
    return null;
}

/**
 * Sets the card in the database. Returns true if successful, false otherwise.
 * @param card
 * @param deckId
 */
export function setCard(card: card, deckId: string): boolean {
    return false;
}

/**
 * Sets the cards in the database for the given deckId. Should only be used on the first time a deck is created/imported. Returns true if successful.
 * @param cards
 * @param deckId
 */
export function setCards(cards: card[], deckId: string): boolean {
    return false;
}
