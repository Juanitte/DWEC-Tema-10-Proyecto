import './App.css'
import HomePage from './pages/home-page/home-page';
import LoginPage from './pages/login-page/login-page'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {

  return (
    <>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            {/* <Route path="/about" element={<About />} /> */}
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </Router>
    </>
  )
}

export default App
