export interface IDeckCardProps {
    deckId: number;
    title: string;
    description: string;
    flashcardCount: number;
    onClick: (deckId: number) => void;
}
