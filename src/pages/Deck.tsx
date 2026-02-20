import React from "react";
import { useParams } from "react-router-dom";
import { Flashcard } from '../components/Flashcard';

const Deck = () => {
    const { deckId } = useParams();
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [flipped, setFlipped] = React.useState(false);

    const cards = [
      {
      id: 1,
      question: "What is the capital of France?",
      answer: "Paris"
    },
    {
      id: 2,
      question: "What is the largest planet in our solar system?",
      answer: "Jupiter"
    },
    {
      id: 3,
      question: "What is the chemical symbol for water?",
      answer: "H2O"
    }
  ];

  if(!cards || cards.length === 0) return <div>No cards in this deck</div>;

  return (
    <div>
      <Flashcard 
        flashcardId={cards[currentIndex].id}
        question={cards[currentIndex].question}
        answer={cards[currentIndex].answer}
        flipped={flipped}
        onClick={() => setFlipped(!flipped)}
      />
      <button onClick={() => setCurrentIndex((currentIndex + 1) % cards.length)}>Next</button>
    </div>
  );
};

export default Deck;
