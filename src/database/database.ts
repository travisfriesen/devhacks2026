import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { Database } from "sqlite3"

export class AppDB {
    private static instance: AppDB
    private db: Database

    private constructor() {
        (async () => {
            // open the database
            const db = await open({
                filename: '/cards.db',
                driver: sqlite3.Database
            })

            // create decks table
            await db.exec(`
                CREATE TABLE IF NOT EXISTS decks (
                    deckId INTEGER PRIMARY KEY AUTOINCREMENT,
                    filepath TEXT NOT NULL,
                    lastUpdated TEXT NOT NULL DEFAULT CURRENT_DATE,
                    created TEXT NOT NULL DEFAULT CURRENT_DATE,
                    uses INTEGER DEFAULT 0 NOT NULL
                );
            `)

            // create cards table
            await db.exec(`
                CREATE TABLE IF NOT EXISTS cards (
                    cardId INTEGER PRIMARY KEY AUTOINCREMENT,
                    deckId INTEGER NOT NULL,
                    question TEXT NOT NULL,
                    answer TEXT NOT NULL,
                    laters INTEGER DEFAULT 0 NOT NULL,
    
                    UNIQUE (cardId, deckId)
                );
            `)
        })()
    }

    public static getInstance() : AppDB {
        if (!AppDB.instance) {
            AppDB.instance = new AppDB();
        }
        return AppDB.instance;
    }

}