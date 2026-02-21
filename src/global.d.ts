import { NavView } from "@/store/useAppStore";
import { ICard, IDeck } from "@/types/types";

declare global {
    interface Window {
        electronAPI: {
            onNavView: (callback: (view: NavView) => void) => void;
            removeAllListeners: (channel: string) => void;

            openFile: () => Promise<string | undefined>;
            importDeck: () => Promise<IDeck | null>;
            saveFile: (filepath: string, content: string) => Promise<void>;
            saveFileDialog: (defaultName: string) => Promise<string | undefined>;
            onOpenFileDialog: (callback: (filepaths: string[]) => void) => void;

            getDecks: () => Promise<IDeck[]>;
            getDeck: (deckId: string) => Promise<IDeck>;
            createDeck: (
                deckId: string,
                deckName: string,
                filepath: string,
            ) => Promise<boolean>;
            deleteDeck: (deckId: string) => Promise<boolean>;
            updateDeck: (
                deck: IDeck,
                field: string,
                value: unknown,
            ) => Promise<boolean>;

            retrieveCard: (cardId: string, deckId: string) => Promise<ICard>;
            retrieveAllCards: () => Promise<ICard[]>;
            createCard: (card: ICard, deckId: string) => Promise<boolean>;
            createCards: (cards: ICard[], deckId: string) => Promise<boolean>;
            deleteCard: (cardId: string, deckId: string) => Promise<boolean>;
            deleteAllCards: (deckId: string) => Promise<boolean>;
            updateCard: (
                card: ICard,
                field: string,
                value: unknown,
            ) => Promise<boolean>;

            searchByKeyword: (keyword: string) => Promise<[IDeck[], ICard[]]>;
            searchDecks: (keyword: string) => Promise<IDeck[]>;
            searchCards: (keyword: string) => Promise<ICard[]>;

            openEditor: (filepath: string) => Promise<void>;
        };
    }
}

export {};
