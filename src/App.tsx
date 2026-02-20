import { Routes, Route } from "react-router-dom";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<div>Home</div>} />
            <Route path="/flashcard" element={<div>Flashcard</div>} />
        </Routes>
    )
}

export default App;