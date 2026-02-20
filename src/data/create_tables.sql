-- Creates the decks table. 
-- Must be done BEFORE cards table is created

CREATE TABLE IF NOT EXISTS decks (
    deckId TEXT PRIMARY KEY,
    filepath TEXT NOT NULL,
    lastUpdated TEXT NOT NULL DEFAULT CURRENT_DATE,
    lastUtilizted TEXT NOT NULL DEFAULT CURRENT_DATE,
    created TEXT NOT NULL DEFAULT CURRENT_DATE,
    uses INTEGER DEFAULT 0 NOT NULL,
    streak INTEGER DEFAULT 0 NOT NULL
);

-- Creates the cards table

CREATE TABLE IF NOT EXISTS cards (
    cardId TEXT UNIQUE, 
    deckId INTEGER NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    laters INTEGER DEFAULT 0 NOT NULL,
    dueDate TEXT NOT NULL DEFAULT CURRENT_DATE,
    
    PRIMARY KEY (cardId, deckId) 
);
