// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { NavView } from "./store/useAppStore";
import { ICard, IDeck } from "./types/types";

contextBridge.exposeInMainWorld("electronAPI", {
    onNavView: (callback: (view: NavView) => void) => {
        ipcRenderer.on("set-nav-view", (_event, view: NavView) =>
            callback(view),
        );
    },

    openFile: () => ipcRenderer.invoke("dialog:openFile"),
    importDeck: () => ipcRenderer.invoke("yaml:importDeck"),
    saveFile: (filepath: string, content: string) =>
        ipcRenderer.invoke("file:save", filepath, content),
    saveFileDialog: (defaultName: string) =>
        ipcRenderer.invoke("dialog:saveFile", defaultName),

    removeAllListeners: (channel: string) => {
        ipcRenderer.removeAllListeners(channel);
    },
    onOpenFileDialog: (callback: (filepaths: string[]) => void) => {
        ipcRenderer.on("open-file-dialog", (_event, filepaths: string[]) =>
            callback(filepaths),
        );
    },

    retrieveCard: (cardId: string, deckId: string) =>
        ipcRenderer.invoke("db:retrieveCard", cardId, deckId),
    retrieveAllCards: () => ipcRenderer.invoke("db:retrieveAllCards"),
    deleteAllCards: (deckId: string) =>
        ipcRenderer.invoke("db:deleteAllCards", deckId),
    getDeck: (deckId: string) => ipcRenderer.invoke("db:getDeck", deckId),
    getDecks: () => ipcRenderer.invoke("db:getDecks"),
    createDeck: (deckId: string, deckName: string, filepath: string) =>
        ipcRenderer.invoke("db:createDeck", deckId, deckName, filepath),
    deleteDeck: (deckId: string) => ipcRenderer.invoke("db:deleteDeck", deckId),
    createCard: (card: ICard, deckId: string) =>
        ipcRenderer.invoke("db:createCard", card, deckId),
    createCards: (cards: ICard[], deckId: string) =>
        ipcRenderer.invoke("db:createCards", cards, deckId),
    deleteCard: (cardId: string, deckId: string) =>
        ipcRenderer.invoke("db:deleteCard", cardId, deckId),
    updateCard: (card: ICard, field: string, value: any) =>
        ipcRenderer.invoke("db:updateCard", card, field, value),
    updateDeck: (deck: IDeck, field: string, value: any) =>
        ipcRenderer.invoke("db:updateDeck", deck, field, value),
    searchByKeyword: (keyword: string) =>
        ipcRenderer.invoke("db:searchByKeyword", keyword),
    searchDecks: (keyword: string) =>
        ipcRenderer.invoke("db:searchDecks", keyword),
    searchCards: (keyword: string) =>
        ipcRenderer.invoke("db:searchCards", keyword),
});
