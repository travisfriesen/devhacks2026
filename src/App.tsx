import { Routes, Route, useNavigate } from "react-router-dom";
import Dashboard from './pages/Dashboard';
import Deck from './pages/Deck';

const App = () => {
    const navigate = useNavigate();
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/deck/:deckId" element={<Deck />} />
            <Route path="*" element={<div>404 Not Found 
                <button onClick={() => navigate('/')}>Go Home</button>
            </div>} />
        </Routes>
    )
}

export default App;
