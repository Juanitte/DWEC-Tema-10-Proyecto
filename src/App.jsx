import './App.css'
import HomePage from './pages/home-page/home-page';
import LoginPage from './pages/login-page/login-page'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from './utils/private-route';

function App() {

  return (
    <>
        <Router>
          <Routes>
            {/* Rutas protegidas */}
            <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
            
            {/* Rutas públicas */}
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </Router>
    </>
  )
}

export default App
