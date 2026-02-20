export interface IDeck {
    deckId: string;
    deckName: string;
    filepath: string;
    lastUpdated: Date;
    created: Date;
    uses: number;
    streak: number;
}

export interface ICard {
    deckId: string;
    cardId: [string, string];
    question: string;
    answer: string;
    laters: number;
    dueDate: Date;
}
