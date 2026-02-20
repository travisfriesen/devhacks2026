export interface deck {
    deckId: string;
    deckName: string;
    filepath: string;
    lastUpdated: Date;
    created: Date;
    uses: number;
    streak: number;
}

export interface card {
    deckId: string;
    cardId: string;
    question: string;
    answer: string;
    laters: number;
    dueDate: Date;
}
