import { Navigate, Route, Routes } from "react-router-dom";
import QuoteListPage from "./pages/QuoteListPage";
import QuoteDetailPage from "./pages/QuoteDetailPage";

function App() {
    return (
        <Routes>
            <Route
                path="/"
                element={<Navigate to="/quotes" replace />}
            />

            <Route
                path="/quotes"
                element={<QuoteListPage />}
            />

            <Route
                path="/quotes/:id"
                element={<QuoteDetailPage />}
            />
        </Routes>
    );
}

export default App;