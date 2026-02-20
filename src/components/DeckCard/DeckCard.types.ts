import { IDeck } from '@/types/types';

export interface IDeckCardProps extends IDeck {
    onClick: (deckId: number) => void;
}
