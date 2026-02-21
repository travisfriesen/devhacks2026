import { IDeck } from "../types/types";
import { getDatabase } from "@/data/database";

// @ts-expect-error aaaaHHHH
let db: Database | undefined;

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

    return statement.get(deckId);
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

    return statement.all();
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

    return statement.run(deckId, deck.deckName, deck.filepath);
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

    return statement.run(deckId);
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

    return statement.run(filepath, deck.deckId);
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

    return statement.run(name, deck.deckId);
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
        `UPDATE decks SET name = ? WHERE lastUpdated = ?`,
    );

    return statement.run(deck.deckName, date);
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

    const statement = db.prepare(`UPDATE decks SET name = ? WHERE uses = ?`);

    return statement.run(deck.deckName, uses);
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

    const statement = db.prepare(`UPDATE decks SET name = ? WHERE streak = ?`);

    const today = new Date();
    // stupid yesterday function because Date.getDate(Date() -1) errors sometimes,
    // and doesn't necessarily handle the ends of the months.
    const yesterday = (): Date => {
        let day = new Date().getDay();
        let month = new Date().getMonth();
        let year = new Date().getFullYear();

        const day31 = [1, 3, 5, 7, 8, 10, 12];
        const day30 = [4, 6, 9, 11];

        if (day == 1) {
            if (month == 1) {
                month = 12;
                year = year - 1;
            } else {
                month = month - 1;
            }
            if (day31.includes(month)) {
                day = 31;
            } else if (day30.includes(month)) {
                day = 30;
            } else {
                //february's am i right?
                day = 28;
            }
        } else {
            day = day - 1;
            month = month - 1;
        }

        return new Date(year, month, day);
    };

    if (deck.lastUtilized != today || deck.lastUtilized != yesterday()) {
        deck.streak = 0;
    } else {
        deck.streak += 1;
    }

    return statement.run(deck.deckName, deck.streak);
}
