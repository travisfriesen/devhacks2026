export interface IFlashcardProps {
    flashcardId: number;
    question: string;
    answer: string;
    flipped: boolean;
    onClick: (flashcardId: number) => void;
}
