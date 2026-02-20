import { Routes, Route, useNavigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Deck from "./pages/Deck";
import Header from './components/Header/Header';

const App = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <Routes>
                <Route
                    path="/"
                    element={<Dashboard />}
                />
                <Route
                    path="/decks/:deckId"
                    element={<Deck />}
                />
                <Route
                    path="*"
                    element={
                        <div>
                            404 Not Found
                            <button onClick={() => navigate("/")}>
                                Go Home
                            </button>
                        </div>
                    }
                />
            </Routes>
        </div>
    );
};

export default App;
