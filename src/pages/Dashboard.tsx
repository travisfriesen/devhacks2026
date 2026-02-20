import React from 'react'
import { useNavigate } from 'react-router-dom'
import { IDeckCardProps } from 'src/components/DeckCard';

const Dashboard = () => {
  const navigate = useNavigate();
  const decks: IDeckCardProps[] = [
    {
      deckId: 1,
      title: 'Deck 1',
      description: 'Description for Deck 1',
      flashcardCount: 10,
      onClick: () => navigate('/deck/1')
    },
    {
      deckId: 2,
      title: 'Deck 2',
      description: 'Description for Deck 2',
      flashcardCount: 20,
      onClick: () => navigate('/deck/2')
    },
    {
      deckId: 3,
      title: 'Deck 3',
      description: 'Description for Deck 3',
      flashcardCount: 15,
      onClick: () => navigate('/deck/3')
    }
  ]
  return (
    <div>
      <h1>Dashboard</h1>
      <ul>
        {decks.map(deck => (
          <li role="button" key={deck.deckId} onClick={deck.onClick}>
            <h2>{deck.title}</h2>
            <p>{deck.description}</p>
            <p>Flashcards: {deck.flashcardCount}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Dashboard
