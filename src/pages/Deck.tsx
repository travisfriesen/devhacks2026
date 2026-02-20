import React from "react";
import { useParams } from "react-router-dom";
import { Flashcard, IFlashcardProps } from "../components/Flashcard";

const Deck = () => {
    const { deckId } = useParams();
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [flipped, setFlipped] = React.useState(false);

    const cards: IFlashcardProps[] = [
        {
            deckId: deckId,
            cardId: ["1", "1"],
            question: "What is the capital of France?",
            answer: "Paris",
            laters: 0,
            dueDate: new Date(),
        },
    ];

    if (!cards || cards.length === 0) return <div>No cards in this deck</div>;

    return (
        <div>
            <Flashcard
                {...cards[currentIndex]}
                flipped={flipped}
                onClick={() => setFlipped(!flipped)}
            />
            <button
                onClick={() =>
                    setCurrentIndex((currentIndex + 1) % cards.length)
                }>
                Next
            </button>
        </div>
    );
};

export default Deck;
