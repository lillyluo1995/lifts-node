import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LiftHomepage } from './components/lift/LiftHomepage';
import { LiftPage } from './components/lift/LiftPage';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LiftHomepage />} />
                <Route path="/lift/:id" element={<LiftPage />} />
            </Routes>
        </BrowserRouter>
    );
}
