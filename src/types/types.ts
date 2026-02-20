export interface deck {
    deckId: string,
    filepath: string,
    lastUpdated: Date,
    created: Date,
    uses: number
}


export interface card {
    deckId: string,
    cardId: [string, string],
    question: string,
    answer: string,
    laters: number,
    dueDate: Date
}