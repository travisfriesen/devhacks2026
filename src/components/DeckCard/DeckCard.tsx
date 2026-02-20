import React from "react";
import { IDeckCardProps } from ".";

const DeckCard: React.FC<IDeckCardProps> = (props) => {
    const {
        deckId,
        deckName,
        filepath,
        lastUpdated,
        created,
        uses,
        streak,
        onClick,
    } = props;

    return (
        <div onClick={() => onClick(deckId)}>
            <h2>{deckName}</h2>
            <p>Last Updated: {lastUpdated.toLocaleDateString()}</p>
            <p>Created: {created.toLocaleDateString()}</p>
            <p>Uses: {uses}</p>
            <p>Streak: {streak}</p>
            <p>Filepath: {filepath}</p>
        </div>
    );
};

export default DeckCard;
