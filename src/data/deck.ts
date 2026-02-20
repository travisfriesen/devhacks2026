import { deck } from "../types/types";

/**
 * Retrieves a deck from the database.
 * Returns null if the deck does not exist.
 * @param deckId
 */
export function retrieveDeck(deckId: string): deck {
    return null;
}

/**
 * Retrieves all decks from the database.
 * Returns null if there are no decks.
 */
export function retrieveDecks(): deck[] {
    return null;
}

/**
 * Creates the deck in the database.
 * Returns true if successful, false otherwise.
 * @param deckId
 * @param deck
 */
export function createDeck(deckId: string, deck: deck): boolean {
    return false;
}

/**
 * Deletes the deck in the database.
 * Returns true if successful, false otherwise
 * @param deckId
 */
export function deleteDeck(deckId: string): boolean {
    return false;
}

function updateDeckStreak(deck: deck) {
    const today = new Date()
    // stupid yesterday function because Date.getDate(Date() -1) errors sometimes,
    // and doesn't necessarily handle the ends of the months.
    const yesterday = ():Date => {
        let day = new Date().getDay();
        let month = new Date().getMonth();
        let year = new Date().getFullYear();

        const day31 = [1,3,5,7,8,10,12];
        const day30 = [4,6,9,11];

        if (day == 1) {
            if (month == 1) {
                month = 12;
                year = year - 1;
            } else {
                month = month -1
            }
            if (day31.includes(month)) {
                day = 31;
            } else if (day30.includes(month)) {
                day = 30;
            } else {
                //february's am i right?
                day = 28;
            }
        } else {
            day = day - 1;
            month = month - 1;
        }

        return new Date(year, month, day);
    };

    if (deck.lastUtilized != today || deck.lastUtilized != yesterday()) {
        deck.streak = 0;
    } else {
        deck.streak += 1;
    }

    // setDeck(deck.deckId, deck);
}
