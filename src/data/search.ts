import { ICard, IDeck } from "../types/types";
import { getDatabase } from "./database";

// @ts-expect-error aaaaHHHH
let db: Database | undefined;

/**
 * Searches by keyword and returns all decks that contain the keyword,
 * all cards (questions or answers) that contains the keywords.
 * Returns empty arrays if nothing is found.
 * @param keyword
 */
export function searchByKeyword(dbPath: string, keyword: string): [decks: IDeck[], cards: ICard[]] {
    return [searchDecks(dbPath, keyword), searchCards(dbPath, keyword)];
}

/**
 * Searches all decks in the database by keyword and returns all decks that contain the keyword.
 * Returns an empty array if nothing is found.
 * @param keyword
 */
export function searchDecks(dbPath: string, keyword: string): IDeck[] {
    if (db === undefined) {
        db = getDatabase(dbPath);
    }

    const statement = db.prepare(
        `SELECT * FROM decks WHERE name LIKE '%' || ? || '%'`,
    );

    return statement.all(keyword);
}

/**
 * Searches all cards in the database by keyword and returns all cards that contain the keyword.
 * Returns an empty array if nothing is found.
 * @param keyword
 */
export function searchCards(dbPath: string, keyword: string): ICard[] {
    if (db === undefined) {
        db = getDatabase(dbPath);
    }

    const statement = db.prepare(
        `SELECT * FROM cards WHERE question LIKE '%' || ? || '%' OR answer LIKE '%' || ? || '%'`,
    );

    return statement.all(keyword, keyword);
}
