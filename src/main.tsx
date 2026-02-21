import { app, Menu, BrowserWindow, dialog, ipcMain } from "electron";
import path from "node:path";
import fs from "node:fs";
import started from "electron-squirrel-startup";

import {
    retrieveDecks,
    retrieveDeck,
    createDeck,
    deleteDeck,
    updateDeckFilepath,
    updateDeckName,
    updateDeckLastUpdated,
    updateDeckUses,
    updateDeckStreak,
} from "./data/deck";
import { searchCards, searchByKeyword, searchDecks } from "./data/search";
import {
    retrieveCard,
    retrieveCards,
    retrieveAllCards,
    createCard,
    createCards,
    deleteCard,
    deleteAllCards,
    updateCardQuestion,
    updateCardAnswer,
    updateCardLaters,
    updateCardDueDate,
} from "./data/cards";

import { ICard, IDeck } from "./types/types";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
    app.quit();
}

let dbPath: string = app.getPath('userData');

async function handleFileOpen() {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ["openFile"],
        filters: [{ name: "YAML", extensions: ["yaml"] }],
    });
    if (!canceled) {
        return filePaths[0];
    }
}

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1100,
        height: 750,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true,
        },
    });

    const menu = Menu.buildFromTemplate([
        {
            label: app.name,
            submenu: [{ role: "quit" }],
        },
        {
            label: "View",
            submenu: [
                {
                    label: "Decks",
                    accelerator: "CmdOrCtrl+1",
                    click: () => {
                        mainWindow.webContents.send("set-nav-view", "decks");
                    },
                },
                {
                    label: "Search",
                    accelerator: "CmdOrCtrl+2",
                    click: () => {
                        mainWindow.webContents.send("set-nav-view", "search");
                    },
                },
                {
                    label: "Settings",
                    accelerator: "CmdOrCtrl+3",
                    click: () => {
                        mainWindow.webContents.send("set-nav-view", "settings");
                    },
                },
                { type: "separator" },
                { role: "reload" },
                { role: "forceReload" },
                { role: "toggleDevTools" },
            ],
        },
        {
            label: "File",
            submenu: [
                {
                    label: "Open Deck...",
                    accelerator: "CmdOrCtrl+O",
                    click: () =>
                        mainWindow.webContents.send("open-file-dialog"),
                },
            ],
        },
    ]);

    Menu.setApplicationMenu(menu);

    // and load the index.html of the app.
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(
            path.join(
                __dirname,
                `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`,
            ),
        );
    }
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
    ipcMain.handle("dialog:openFile", handleFileOpen);
    ipcMain.handle(
        "file:save",
        async (_event, filepath: string, content: string) => {
            fs.writeFileSync(filepath, content, "utf-8");
        },
    );
    ipcMain.handle("db:getDeck", async (_event, deckId: string) => {
        const deck = retrieveDeck(dbPath, deckId);
        if (!deck) {
            throw new Error("Deck not found");
        }
        const cards = retrieveCards(dbPath, deckId);
        return { ...deck, cards };
    });
    ipcMain.handle(
        "db:retrieveCard",
        async (_event, cardId: string, deckId: string) => {
            const card = retrieveCard(dbPath, cardId, deckId);
            if (!card) {
                throw new Error("Card not found");
            }
            return card;
        },
    );
    ipcMain.handle("db:retrieveAllCards", async () => {
        const cards = retrieveAllCards(dbPath);
        if (!cards) {
            throw new Error("No cards found");
        }
        return cards;
    });
    ipcMain.handle("db:deleteAllCards", async (_event, deckId: string) => {
        return deleteAllCards(dbPath, deckId);
    });
    ipcMain.handle("db:getDecks", async () => {
        // call retrieveDecks, for each deck call retrieveCards and add to the deck object, then return the array of decks
        const decks = retrieveDecks(dbPath) || [];
        const decksWithCards = decks.map((deck) => {
            const cards = retrieveCards(dbPath, deck.deckId);
            return { ...deck, cards };
        });

        return decksWithCards;
    });
    ipcMain.handle(
        "db:createDeck",
        async (_event, deckId: string, deckName: string, filepath: string) => {
            const deck = { deckId, deckName, filepath } as IDeck;
            return createDeck(dbPath, deckId, deck);
        },
    );
    ipcMain.handle("db:deleteDeck", async (_event, deckId: string) => {
        return deleteDeck(dbPath, deckId);
    });
    ipcMain.handle(
        "db:createCard",
        async (_event, card: ICard, deckId: string) => {
            return createCard(dbPath, card, deckId);
        },
    );
    ipcMain.handle(
        "db:createCards",
        async (_event, cards: ICard[], deckId: string) => {
            return createCards(dbPath, cards, deckId);
        },
    );
    ipcMain.handle(
        "db:deleteCard",
        async (_event, cardId: string, deckId: string) => {
            return deleteCard(dbPath, cardId, deckId);
        },
    );
    ipcMain.handle(
        "db:updateCard",
        async (_event, card: ICard, field: string, value: any) => {
            switch (field) {
                case "question":
                    return updateCardQuestion(dbPath, card, value);
                case "answer":
                    return updateCardAnswer(dbPath, card, value);
                case "laters":
                    return updateCardLaters(dbPath, card, value);
                case "dueDate":
                    return updateCardDueDate(dbPath, card, value);
                default:
                    throw new Error("Invalid field");
            }
        },
    );
    ipcMain.handle(
        "db:updateDeck",
        async (_event, deck: IDeck, field: string, value: any) => {
            switch (field) {
                case "name":
                    return updateDeckName(dbPath, deck, value);
                case "filepath":
                    return updateDeckFilepath(dbPath, deck, value);
                case "lastUpdated":
                    return updateDeckLastUpdated(dbPath, deck, value);
                case "uses":
                    return updateDeckUses(dbPath, deck, value);
                case "streak":
                    return updateDeckStreak(dbPath, deck);
                default:
                    throw new Error("Invalid field");
            }
        },
    );

    ipcMain.handle("db:searchByKeyword", async (_event, keyword: string) => {
        return searchByKeyword(dbPath, keyword);
    });
    ipcMain.handle("db:searchDecks", async (_event, keyword: string) => {
        return searchDecks(dbPath, keyword);
    });
    ipcMain.handle("db:searchCards", async (_event, keyword: string) => {
        return searchCards(dbPath, keyword);
    });

    createWindow();
    app.on("activate", function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
