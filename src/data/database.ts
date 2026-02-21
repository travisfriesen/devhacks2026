import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";
import { ICard, IDeck } from "../types/types";

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
    ): Promise<ICard> {
        return await this.db.get(
            "SELECT * FROM cards WHERE cardId = :cardId AND deckId = :deckId",
            {
                ":cardId": cardId,
                ":deckId": deckId,
            },
        );
    }

    public async retrieveCardsByDeckId(deckId: string): Promise<ICard[]> {
        return await this.db.get("SELECT * FROM cards WHERE deckId = :deckId", {
            ":deckId": deckId,
        });
    }

    public async retrieveAllCards(): Promise<ICard[]> {
        return await this.db.get("SELECT * FROM cards");
    }

    public async createCard(card: ICard, deckId: string): Promise<boolean> {
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
        card: ICard,
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
        card: ICard,
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
        card: ICard,
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
        card: ICard,
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

    public async retrieveDeckByDeckId(deckId: string): Promise<IDeck> {
        return await this.db.get("SELECT * FROM decks WHERE deckId = :deckId", {
            ":deckId": deckId,
        });
    }

    public async retrieveAllDecks(): Promise<IDeck[]> {
        return await this.db.get("SELECT * FROM decks");
    }

    public async createDeck(deckId: string, deck: IDeck): Promise<boolean> {
        try {
            await this.db.run(
                "INSERT INTO decks (deckId, name, filepath) VALUES (:deckId, :name, :filepath)",
                {
                    ":deckId": deckId,
                    ":name": deck.deckName,
                    ":filepath": deck.filepath,
                },
            );
        } catch (error) {
            console.error("Error creating deck:", error);
            return false;
        }
    }

    public async deleteDeck(deckId: string): Promise<boolean> {
        try {
            await this.db.run("DELETE FROM cards WHERE deckId = :deckId", {
                ":deckId": deckId,
            });
            await this.db.run("DELETE FROM decks WHERE deckId = :deckId", {
                ":deckId": deckId,
            });
        } catch (error) {
            console.error("Error deleting deck:", error);
            return false;
        }
    }

    public async updateDeckFilepath(
        deck: IDeck,
        filepath: string,
    ): Promise<boolean> {
        try {
            await this.db.run(
                "UPDATE decks SET filepath = :filepath WHERE deckId = :deckId",
                {
                    ":filepath": filepath,
                    ":deckId": deck.deckId,
                },
            );
        } catch (error) {
            console.error("Error updating deck filepath:", error);
            return false;
        }
    }

    public async updateDeckName(deck: IDeck, name: string): Promise<boolean> {
        try {
            await this.db.run(
                "UPDATE decks SET name = :name WHERE deckId = :deckId",
                {
                    ":name": name,
                    ":deckId": deck.deckId,
                },
            );
        } catch (error) {
            console.error("Error updating deck name:", error);
            return false;
        }
    }

    public async searchDecksByName(name: string): Promise<IDeck[]> {
        return await this.db.get(
            "SELECT * FROM decks WHERE name LIKE :keyword",
            {
                ":keyword": `%${name}%`,
            },
        );
    }

    public async searchCardsByKeywords(keywords: string): Promise<ICard[]> {
        return await this.db.get(
            "SELECT * FROM cards WHERE question LIKE :keyword OR answer LIKE :keyword",
            {
                ":keyword": `%${keywords}%`,
            },
        );
    }
}
