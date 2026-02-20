import React from "react";
import { IDeckCardProps } from ".";

const DeckCard: React.FC<IDeckCardProps> = (props) => {
    const { deckId, title, description, flashcardCount, onClick } = props;

    return (
        <div>
            <h2>{title}</h2>
        </div>
    );
};

export default DeckCard;
