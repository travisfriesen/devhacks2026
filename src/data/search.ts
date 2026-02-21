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
function searchByKeyword(keyword: string): [decks: IDeck[], cards: ICard[]] {
    if (db === undefined) {
        db = getDatabase();
    }
    return [searchDecks(keyword), searchCards(keyword)];
}

/**
 * Searches all decks in the database by keyword and returns all decks that contain the keyword.
 * Returns an empty array if nothing is found.
 * @param keyword
 */
function searchDecks(keyword: string): IDeck[] {
    if (db === undefined) {
        db = getDatabase();
    }

    const statement = db.prepare(
        `SELECT * FROM decks WHERE name LIKE '%' + ? '%'`,
    );

    return statement.all(keyword);
}

/**
 * Searches all cards in the database by keyword and returns all cards that contain the keyword.
 * Returns an empty array if nothing is found.
 * @param keyword
 */
function searchCards(keyword: string): ICard[] {
    if (db === undefined) {
        db = getDatabase();
    }

    const statement = db.prepare(
        `SELECT * FROM cards WHERE question LIKE '%' + ?  + '%' OR answer LIKE '%' + ? + '%'`,
    );

    return statement.all(keyword);
}
