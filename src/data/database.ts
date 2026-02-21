import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";
import { card } from "../types/types";

export class AppDB {
    private static instance: AppDB;
    private db: Database;

    private constructor(db: Database) {
        this.db = db;
    }

    public static async getInstance(): Promise<AppDB> {
        if (!AppDB.instance) {
            const db = await open({
                filename: "src/data/cards.db",
                driver: sqlite3.Database,
            });

            // create tables
            await db.exec(`
                CREATE TABLE IF NOT EXISTS decks
                (
                    deckId      INTEGER PRIMARY KEY AUTOINCREMENT,
                    filepath    TEXT NOT NULL,
                    lastUpdated TEXT NOT NULL DEFAULT CURRENT_DATE,
                    created     TEXT NOT NULL DEFAULT CURRENT_DATE,
                    uses        INTEGER       DEFAULT 0 NOT NULL
                );
            `);

            await db.exec(`
                CREATE TABLE IF NOT EXISTS cards
                (
                    cardId   INTEGER PRIMARY KEY AUTOINCREMENT,
                    deckId   INTEGER           NOT NULL,
                    question TEXT              NOT NULL,
                    answer   TEXT              NOT NULL,
                    laters   INTEGER DEFAULT 0 NOT NULL,
                    UNIQUE (cardId, deckId)
                );
            `);

            AppDB.instance = new AppDB(db);
        }

        return AppDB.instance;
    }

    public async retrieveCardByCardId(
        cardId: string,
        deckId: string,
    ): Promise<card> {
        let result: card;
        result = await this.db.get(
            "SELECT * FROM cards WHERE cardId = :cardId AND deckId = :deckId",
            {
                ":cardId": cardId,
                ":deckId": deckId,
            },
        );
        return result;
    }

    public async retrieveCardsByDeckId(deckId: string): Promise<card[]> {
        let result: card[];
        result = await this.db.get(
            "SELECT * FROM cards WHERE deckId = :deckId",
            {
                ":deckId": deckId,
            },
        );
        return result;
    }

    public async retrieveAllCards(): Promise<card[]> {
        let result: card[];
        result = await this.db.get("SELECT * FROM cards");
        return result;
    }

    public async createCard(card: card, deckId: string): Promise<boolean> {
        try {
            await this.db.run(
                "INSERT INTO cards (cardId, deckId, question, answer) VALUES (:cardId, :deckId, :question, :answer)",
                {
                    ":cardId": card.cardId,
                    ":deckId": deckId,
                    ":question": card.question,
                    ":answer": card.answer,
                },
            );
        } catch (error) {
            console.error("Error creating card:", error);
            return false;
        }
    }
}
