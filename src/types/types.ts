export interface IDeck {
    deckId: string;
    deckName: string;
    filepath: string;
    lastUpdated: Date;
    created: Date;
    lastUtilized: Date;
    uses: number;
    streak: number;
    cards: Array<ICard>;
}

export interface ICard {
    deckId: string;
    cardId: string;
    question: string;
    answer: string;
    laters: number;
    dueDate: Date;
}
