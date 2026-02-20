-- Creates the decks table. 
-- Must be done BEFORE cards table is created

CREATE TABLE IF NOT EXISTS decks (
    deckId INTEGER PRIMARY KEY AUTOINCREMENT,
    filepath TEXT NOT NULL,
    lastUpdated TEXT NOT NULL DEFAULT CURRENT_DATE,
    created TEXT NOT NULL DEFAULT CURRENT_DATE,
    uses INTEGER DEFAULT 0 NOT NULL
);

-- Creates the cards table

CREATE TABLE IF NOT EXISTS cards (
    cardId INTEGER PRIMARY KEY AUTOINCREMENT,
    deckId INTEGER NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    laters INTEGER DEFAULT 0 NOT NULL,
    
    UNIQUE (cardId, deckId) 
);
