import React from "react";
import { useNavigate } from "react-router-dom";
import { DeckCard, IDeckCardProps } from "@/components/DeckCard";

const Dashboard = () => {
    const navigate = useNavigate();
    const decks: IDeckCardProps[] = [
        {
            deckId: "1",
            deckName: "Spanish Vocabulary",
            filepath: "/decks/spanish-vocab.json",
            lastUpdated: new Date(),
            created: new Date(),
            uses: 10,
            streak: 5,
            onClick: (deckId: number) => navigate(`/decks/${deckId}`),
        },
        {
            deckId: "2",
            deckName: "History Facts",
            filepath: "/decks/history-facts.json",
            lastUpdated: new Date(),
            created: new Date(),
            uses: 20,
            streak: 10,
            onClick: (deckId: number) => navigate(`/decks/${deckId}`),
        },
        {
            deckId: "3",
            deckName: "Science Concepts",
            filepath: "/decks/science-concepts.json",
            lastUpdated: new Date(),
            created: new Date(),
            uses: 15,
            streak: 7,
            onClick: (deckId: number) => navigate(`/decks/${deckId}`),
        },
    ];

    return (
        <div>
            <h1>Dashboard</h1>
            <ul>
                {decks.map((deck) => (
                    <DeckCard {...deck} />
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
