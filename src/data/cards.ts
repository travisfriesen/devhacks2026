import {ICard} from "../types/types";
import Database from "better-sqlite3";
import { getDatabase } from "./database";

// @ts-expect-error just let it be its a typescript thing for now
let db: Database | undefined;

function fixCardType(card: ICard): ICard {
    return {
        cardId: card.cardId as string,
        deckId: card.deckId as string,
        question: card.question as string,
        answer: card.answer as string,
        laters: card.laters as number,
        dueDate: new Date(card.dueDate)
    };
}

function fixCardTypeArray(card: ICard[]): ICard[] {
    let newCards: ICard[] = [];

    for (const key in card) {
        newCards.push(fixCardType(card[key]));
    }

    return newCards;
}

/**
 * Gets a card from the database.
 * Returns null if the card does not exist.
 * @param cardId
 * @param deckId
 */
export function retrieveCard(dbPath: string, cardId: string, deckId: string): ICard {
    if (db === undefined) {
        db = getDatabase(dbPath);
    }

    const statement = db.prepare(
        `SELECT * FROM cards WHERE cardId = ? AND deckId = ?`,
    );

    const output = statement.get(cardId, deckId);
    return fixCardType(output);
}

/**
 * Gets all the cards from the database with the given deckId.
 * Returns null if the deck does not exist.
 * @param deckId
 */
export function retrieveCards(dbPath: string, deckId: string): ICard[] {
    if (db === undefined) {
        db = getDatabase(dbPath);
    }

    const statement = db.prepare(`SELECT * FROM cards WHERE deckId = ?`);

    const output = statement.all(deckId);
    return fixCardTypeArray(output);
}

/**
 * Gets all the cards from the database.
 * Returns null if the deck does not exist.
 */
export function retrieveAllCards(dbPath: string, ): ICard[] {
    if (db === undefined) {
        db = getDatabase(dbPath);
    }

    const statement = db.prepare(`SELECT * FROM cards`);

    const output = statement.all();
    return fixCardTypeArray(output);
}

/**
 * Sets the card in the database.
 * Returns true if successful, false otherwise.
 * @param card
 * @param deckId
 */
export function createCard(dbPath: string, card: ICard, deckId: string): boolean {
    if (db === undefined) {
        db = getDatabase(dbPath);
    }

    const statement = db.prepare(
        `INSERT INTO cards (cardId, deckId, question, answer) VALUES (?, ?, ?, ?)`,
    );

    const changes = statement.run(
        card.cardId,
        deckId,
        card.question,
        card.answer,
    );
    return changes.changes == 1;
}

/**
 * Sets the cards in the database for the given deckId.
 * Should only be used on the first time a deck is created/imported.
 * Returns true if successful.
 * @param cards
 * @param deckId
 */
export function createCards(dbPath: string, cards: ICard[], deckId: string): boolean {
    let returnValue = true;
    for (const key in cards) {
        returnValue = createCard(dbPath, cards[key], deckId);
    }
    return returnValue;
}

/**
 * Deletes a card from the database for the given cardId and deckId
 * Returns true if successful, false otherwise.
 * @param cardId
 * @param deckId
 */
export function deleteCard(dbPath: string, cardId: string, deckId: string): boolean {
    if (db === undefined) {
        db = getDatabase(dbPath);
    }

    const statement = db.prepare(
        `DELETE FROM cards WHERE cardId = ? AND deckId = ?`,
    );

    return statement.run(cardId, deckId).changes > 0;
}

/**
 * Deletes all card from the database for the given deckId
 * Returns true if successful, false otherwise.
 * @param deckId
 */
export function deleteAllCards(dbPath: string, deckId: string): boolean {
    if (db === undefined) {
        db = getDatabase(dbPath);
    }

    const statement = db.prepare(`DELETE FROM cards WHERE deckId = ?`);

    return statement.run(deckId).changes > 0;
}

/**
 * Updates the card's question for the given cardId and deckId
 * @param card
 * @param question
 */
export function updateCardQuestion(dbPath: string, card: ICard, question: string): boolean {
    if (db === undefined) {
        db = getDatabase(dbPath);
    }

    const statement = db.prepare(
        `UPDATE cards SET question = ? WHERE cardId = ? AND deckId = ?`,
    );

    return statement.run(question, card.cardId, card.deckId).changes > 0;
}

/**
 * Updates the card's answer for the given cardId and deckId
 * @param card
 * @param answer
 */
export function updateCardAnswer(dbPath: string, card: ICard, answer: string): boolean {
    if (db === undefined) {
        db = getDatabase(dbPath);
    }

    const statement = db.prepare(
        `UPDATE cards SET answer = ? WHERE cardId = ? AND deckId = ?`,
    );

    return statement.run(answer, card.cardId, card.deckId).changes > 0;
}

/**
 * Updates the card's later value for the given cardId and deckId
 * @param card
 * @param later
 */
export function updateCardLaters(dbPath: string, card: ICard, later: number): boolean {
    if (db === undefined) {
        db = getDatabase(dbPath);
    }

    const statement = db.prepare(
        `UPDATE cards SET laters = ? WHERE cardId = ? AND deckId = ?`,
    );

    return statement.run(later, card.cardId, card.deckId).changes > 0;
}

/**
 * Updates the card's due date for the given cardId and deckId
 * @param card
 * @param dueDate
 */
export function updateCardDueDate(dbPath: string, card: ICard, dueDate: Date): boolean {
    if (db === undefined) {
        db = getDatabase(dbPath);
    }

    const statement = db.prepare(
        `UPDATE cards SET dueDate = ? WHERE cardId = ? AND deckId = ?`,
    );

    const dueDateStr = dueDate instanceof Date ? dueDate.toISOString().slice(0, 10) : String(dueDate);
    return statement.run(dueDateStr, card.cardId, card.deckId).changes > 0;
}
