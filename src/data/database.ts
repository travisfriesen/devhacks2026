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
                CREATE TABLE IF NOT EXISTS decks (
                     deckId TEXT PRIMARY KEY,
                     name TEXT NOT NULL,
                     filepath TEXT NOT NULL,
                     lastUpdated TEXT NOT NULL DEFAULT CURRENT_DATE,
                     lastUtilized TEXT NOT NULL DEFAULT CURRENT_DATE,
                     created TEXT NOT NULL DEFAULT CURRENT_DATE,
                     uses INTEGER DEFAULT 0 NOT NULL,
                     streak INTEGER DEFAULT 0 NOT NULL
                );
            `);

            await db.exec(`
                CREATE TABLE IF NOT EXISTS cards
                (
                    cardId TEXT UNIQUE,
                    deckId INTEGER NOT NULL,
                    question TEXT NOT NULL,
                    answer TEXT NOT NULL,
                    laters INTEGER DEFAULT 0 NOT NULL,
                    dueDate TEXT NOT NULL DEFAULT CURRENT_DATE,

                    PRIMARY KEY (cardId, deckId)
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
        return await this.db.get(
            "SELECT * FROM cards WHERE cardId = :cardId AND deckId = :deckId",
            {
                ":cardId": cardId,
                ":deckId": deckId,
            },
        );
    }

    public async retrieveCardsByDeckId(deckId: string): Promise<card[]> {
        return await this.db.get("SELECT * FROM cards WHERE deckId = :deckId", {
            ":deckId": deckId,
        });
    }

    public async retrieveAllCards(): Promise<card[]> {
        return await this.db.get("SELECT * FROM cards");
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

    public async deleteCard(cardId: string, deckId: string): Promise<boolean> {
        try {
            await this.db.run(
                "DELETE FROM cards WHERE cardId = :cardId AND deckId = :deckId",
                {
                    ":cardId": cardId,
                    ":deckId": deckId,
                },
            );
        } catch (error) {
            console.error("Error deleting card:", error);
            return false;
        }
    }

    public async updateCardQuestion(
        card: card,
        question: string,
    ): Promise<boolean> {
        try {
            await this.db.run(
                "UPDATE cards SET question = :question WHERE cardId = :cardId AND deckId = :deckId",
                {
                    ":question": question,
                    ":cardId": card.cardId,
                    ":deckId": card.deckId,
                },
            );
        } catch (error) {
            console.error("Error updating card question:", error);
            return false;
        }
    }

    public async updateCardAnswer(
        card: card,
        answer: string,
    ): Promise<boolean> {
        try {
            await this.db.run(
                "UPDATE cards SET answer = :answer WHERE cardId = :cardId AND deckId = :deckId",
                {
                    ":answer": answer,
                    ":cardId": card.cardId,
                    ":deckId": card.deckId,
                },
            );
        } catch (error) {
            console.error("Error updating card answer:", error);
            return false;
        }
    }

    public async updateCardLaters(
        card: card,
        laters: string,
    ): Promise<boolean> {
        try {
            await this.db.run(
                "UPDATE cards SET laters = :laters WHERE cardId = :cardId AND deckId = :deckId",
                {
                    ":laters": laters,
                    ":cardId": card.cardId,
                    ":deckId": card.deckId,
                },
            );
        } catch (error) {
            console.error("Error updating card laters:", error);
            return false;
        }
    }

    public async updateCardDueDate(
        card: card,
        dueDate: string,
    ): Promise<boolean> {
        try {
            await this.db.run(
                "UPDATE cards SET dueDate = :dueDate WHERE cardId = :cardId AND deckId = :deckId",
                {
                    ":dueDate": dueDate,
                    ":cardId": card.cardId,
                    ":deckId": card.deckId,
                },
            );
        } catch (error) {
            console.error("Error updating card dueDate:", error);
            return false;
        }
    }
}
