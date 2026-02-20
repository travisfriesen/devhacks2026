export interface IDeck {
    deckId: string;
    deckName: string;
    filepath: string;
    lastUpdated: Date;
    created: Date;
    lastUtilized: Date;
    uses: number;
    streak: number;
    cards: Array<card>
}

export interface ICard {
    deckId: string;
    cardId: string;
    question: string;
    answer: string;
    laters: number;
    dueDate: Date;
}
