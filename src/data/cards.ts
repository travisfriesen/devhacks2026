import { ICard } from "../types/types";
import { AppDB } from "./database";

/**
 * Retrieves a card from the database.
 * Returns null if the card does not exist.
 * @param cardId
 * @param deckId
 */
export function retrieveCard(cardId: string, deckId: string): ICard {
    AppDB.getInstance().then((db) => {
        db.retrieveCardByCardId(cardId, deckId).then((card) => {
            return card;
        });
    });
    return null;
}

/**
 * Retrieves all the cards from the database with the given deckId.
 * Returns null if the deck does not exist.
 * @param deckId
 */
export function retrieveCards(deckId: string): ICard[] {
    return null;
}

/**
 * Retrieves all the cards from the database.
 * Returns null if the deck does not exist.
 */
export function retrieveAllCards(): ICard[] {
    return null;
}

/**
 * Creates the card in the database.
 * Returns true if successful, false otherwise.
 * @param card
 * @param deckId
 */
export function createCard(card: ICard, deckId: string): boolean {
    AppDB.getInstance().then((db) => {
        db.createCard(card, deckId).then((success) => {
            return success;
        });
    });
    return false;
}

/**
 * Creates the cards in the database for the given deckId.
 * Should only be used on the first time a deck is created/imported.
 * Returns true if successful, false otherwise.
 * @param cards
 * @param deckId
 */
export function createCards(cards: ICard[], deckId: string): boolean {
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

/**
 * Deletes all card from the database for the given deckId
 * Returns true if successful, false otherwise.
 * @param deckId
 */
export function deleteAllCards(deckId: string): boolean {
    return false;
}

/**
 * Updates the card's question for the given cardId and deckId
 * @param card
 * @param question
 */
export function updateCardQuestion(card: ICard, question: string): boolean {
    return false;
}

/**
 * Updates the card's answer for the given cardId and deckId
 * @param card
 * @param answer
 */
export function updateCardAnswer(card: ICard, answer: string): boolean {
    return false;
}

/**
 * Updates the card's later value for the given cardId and deckId
 * @param card
 * @param later
 */
export function updateCardLaters(card: ICard, later: number): boolean {
    return false;
}

/**
 * Updates the card's due date for the given cardId and deckId
 * @param card
 * @param dueDate
 */
export function updateCardDueDate(card: ICard, dueDate: Date): boolean {
    return false;
}
