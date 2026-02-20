import sqlite3 from 'sqlite3'
import { Database, open} from 'sqlite'
import {card} from "../types/types";

export class AppDB {
    private static instance: AppDB
    private db: Database

    private constructor() {
        (async () => {
            // open the database
            this.db = await open({
                filename: 'src/data/cards.db',
                driver: sqlite3.Database
            })

            // create decks table
            await this.db.exec(`
                CREATE TABLE IF NOT EXISTS decks
                (
                    deckId      INTEGER PRIMARY KEY AUTOINCREMENT,
                    filepath    TEXT NOT NULL,
                    lastUpdated TEXT NOT NULL DEFAULT CURRENT_DATE,
                    created     TEXT NOT NULL DEFAULT CURRENT_DATE,
                    uses        INTEGER       DEFAULT 0 NOT NULL
                );
            `)

            // create cards table
            await this.db.exec(`
                CREATE TABLE IF NOT EXISTS cards
                (
                    cardId   INTEGER PRIMARY KEY AUTOINCREMENT,
                    deckId   INTEGER           NOT NULL,
                    question TEXT              NOT NULL,
                    answer   TEXT              NOT NULL,
                    laters   INTEGER DEFAULT 0 NOT NULL,

                    UNIQUE (cardId, deckId)
                );
            `)
        })()
    }

    public static getInstance(): AppDB {
        if (!AppDB.instance) {
            AppDB.instance = new AppDB();
        }
        return AppDB.instance;
    }

    public async getCardByCardId(cardId: string, deckId: string): Promise<card> {
        let result : card
        result = await this.db.get('SELECT * FROM cards WHERE cardId = :cardId AND deckId = :deckId', {
            ':cardId': cardId,
            ':deckId': deckId
        })
        return result
    }

    public async getCardsByDeckId(deckId: string): Promise<card[]> {
        let result : card[]
        result = await this.db.get('SELECT * FROM cards WHERE deckId = :deckId', {
            ':deckId': deckId
        })
        return result
    }

}