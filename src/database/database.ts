import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import {Database} from "sqlite3"

class AppDB {
    private static instance: AppDB;
    private db: Database

    private constructor() {
        (async () => {
            // open the database
            const db = await open({
                filename: '/cards.db',
                driver: sqlite3.Database
            })
        })()
    }

    public getInstance() : AppDB {
        if (!AppDB.instance) {
            AppDB.instance = new AppDB();
        }
        return AppDB.instance;
    }

}