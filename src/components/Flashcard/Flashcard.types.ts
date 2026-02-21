import { ICard } from "@/types/types";

export interface IFlashcardProps extends ICard {
    flipped: boolean;
    onClick: (flashcardId: string) => void;
}
