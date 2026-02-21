import { IDeck } from "../types/types";
import { getDatabase } from "./database";

// @ts-expect-error aaaaHHHH
let db: Database | undefined;

function fixDeckType(deck: Record<string, unknown>): IDeck {
    return {
        deckId: deck.deckId as string,
        deckName: (deck.name ?? deck.deckName) as string, // DB column is 'name', IDeck uses 'deckName'
        filepath: deck.filepath as string,
        lastUpdated: new Date(deck.lastUpdated as string),
        lastUtilized: new Date(deck.lastUtilized as string),
        created: new Date(deck.created as string),
        uses: deck.uses as number,
        streak: deck.streak as number,
        cards: [],
    };
}

function fixDeckTypeArray(decks: Record<string, unknown>[]): IDeck[] {
    return decks.map(fixDeckType);
}

/**
 * Retrieves a deck from the database.
 * Returns null if the deck does not exist.
 * @param deckId
 */
export function retrieveDeck(deckId: string): IDeck {
    if (db === undefined) {
        db = getDatabase();
    }

    const statement = db.prepare(`SELECT * FROM decks WHERE deckId = ?`);

    const output = statement.get(deckId);
    return fixDeckType(output);
}

/**
 * Retrieves all decks from the database.
 * Returns null if there are no decks.
 */
export function retrieveDecks(): IDeck[] {
    if (db === undefined) {
        db = getDatabase();
    }

    const statement = db.prepare(`SELECT * FROM decks`);

    const output = statement.all();
    return fixDeckTypeArray(output);
}

/**
 * Creates the deck in the database.
 * Returns true if successful, false otherwise.
 * @param deckId
 * @param deck
 */
export function createDeck(deckId: string, deck: IDeck): boolean {
    if (db === undefined) {
        db = getDatabase();
    }

    const statement = db.prepare(
        `INSERT INTO decks (deckId, name, filepath) VALUES (?,?,?)`,
    );

    return statement.run(deckId, deck.deckName, deck.filepath).changes > 0;
}

/**
 * Deletes the deck in the database.
 * Returns true if successful, false otherwise
 * @param deckId
 */
export function deleteDeck(deckId: string): boolean {
    if (db === undefined) {
        db = getDatabase();
    }

    const statement = db.prepare(`DELETE FROM decks WHERE deckId = ?`);

    return statement.run(deckId).changes > 0;
}

/**
 * Updates the deck's filepath in the database.
 * Returns true if successful, false otherwise
 * @param deck
 * @param filepath
 */
export function updateDeckFilepath(deck: IDeck, filepath: string): boolean {
    if (db === undefined) {
        db = getDatabase();
    }

    const statement = db.prepare(
        `UPDATE decks SET filepath = ? WHERE deckId = ?`,
    );

    return statement.run(filepath, deck.deckId).changes > 0;
}

/**
 * Updates the deck's name in the database.
 * Returns true if successful, false otherwise
 * @param deck
 * @param name
 */
export function updateDeckName(deck: IDeck, name: string): boolean {
    if (db === undefined) {
        db = getDatabase();
    }

    const statement = db.prepare(`UPDATE decks SET name = ? WHERE deckId = ?`);

    return statement.run(name, deck.deckId).changes > 0;
}

/**
 * Updates the deck's last updated streak in the database.
 * Returns true if successful, false otherwise
 * @param deck
 * @param date
 */
export function updateDeckLastUpdated(deck: IDeck, date: Date): boolean {
    if (db === undefined) {
        db = getDatabase();
    }

    const statement = db.prepare(
        `UPDATE decks SET lastUpdated = ? WHERE deckId = ?`,
    );

    const dateStr = date instanceof Date ? date.toISOString().slice(0, 10) : String(date);
    return statement.run(dateStr, deck.deckId).changes > 0;
}

/**
 * Updates the deck's uses in the database.
 * Returns true if successful, false otherwise
 * @param deck
 * @param uses
 */
export function updateDeckUses(deck: IDeck, uses: number): boolean {
    if (db === undefined) {
        db = getDatabase();
    }

    const statement = db.prepare(`UPDATE decks SET uses = ? WHERE deckId = ?`);

    return statement.run(uses, deck.deckId).changes > 0;
}

/**
 * Updates the deck's streak in the database.
 * Returns true if successful, false otherwise
 * @param deck
 * @param streak
 */
export function updateDeckStreak(deck: IDeck): boolean {
    if (db === undefined) {
        db = getDatabase();
    }

    const statement = db.prepare(
        `UPDATE decks SET streak = ?, lastUtilized = ? WHERE deckId = ?`,
    );

    const todayStr = new Date().toISOString().slice(0, 10);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    const lastUtilizedStr =
        deck.lastUtilized instanceof Date
            ? deck.lastUtilized.toISOString().slice(0, 10)
            : String(deck.lastUtilized).slice(0, 10);

    let newStreak: number;
    if (lastUtilizedStr === todayStr) {
        newStreak = deck.streak; // already updated today
    } else if (lastUtilizedStr === yesterdayStr) {
        newStreak = deck.streak + 1; // consecutive day
    } else {
        newStreak = 1; // streak broken
    }

    return statement.run(newStreak, todayStr, deck.deckId).changes > 0;
}
