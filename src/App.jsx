import './App.css'
import HomePage from './pages/home-page/home-page';
import LoginPage from './pages/login-page/login-page'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from './utils/private-route';
import SiteLayout from './components/layout/site-layout';
import SignupPage from './pages/signup-page/signup-page';
import BaseLayout from './components/layout/base-layout';

function App() {

  return (
    <>
        <Router>
          <Routes>
            {/* Rutas protegidas */}
            <Route path="/" element={<PrivateRoute><SiteLayout><HomePage /></SiteLayout></PrivateRoute>} />

            {/* Rutas públicas */}
            <Route path="/login" element={<BaseLayout><LoginPage /></BaseLayout>} />
            <Route path="/signup" element={<BaseLayout><SignupPage /></BaseLayout>} />
          </Routes>
        </Router>
    </>
  )
}

export default App
