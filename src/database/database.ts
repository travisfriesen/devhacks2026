import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

class Database {
    private static instance: Database;

    private db: sqlite3.Database;

    private constructor() {
        // Private constructor to prevent direct instantiation
    }

}
async function initDatabase() {
    // open the database
    const db = await open({
        filename: 'cards.db',
        driver: sqlite3.Database
    })
}