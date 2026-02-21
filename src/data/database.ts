import Database from "better-sqlite3";

/*
 * All database functions are sourced from here
 * https://github.com/WiseLibs/better-sqlite3/blob/HEAD/docs/api.md#class-statement
 */

export function getDatabase(dbPath: string) {
    if (dbPath === undefined) {
        throw new Error("Database path is not set. Call init() first.");
    }
    const db = new Database(dbPath + "/database.db");
    const makeDeck = db.prepare(`CREATE TABLE IF NOT EXISTS decks (
    deckId TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    filepath TEXT NOT NULL,
    lastUpdated TEXT NOT NULL DEFAULT CURRENT_DATE,
    lastUtilized TEXT NOT NULL DEFAULT CURRENT_DATE,
    created TEXT NOT NULL DEFAULT CURRENT_DATE,
    uses INTEGER DEFAULT 0 NOT NULL,
    streak INTEGER DEFAULT 0 NOT NULL
);`);
    const makeCards = db.prepare(`CREATE TABLE IF NOT EXISTS cards (
    cardId TEXT UNIQUE, 
    deckId TEXT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    laters INTEGER DEFAULT 0 NOT NULL,
    dueDate TEXT NOT NULL DEFAULT CURRENT_DATE,
    
    PRIMARY KEY (cardId, deckId) 
);`);

    makeDeck.run();
    makeCards.run();

    return db;
}
