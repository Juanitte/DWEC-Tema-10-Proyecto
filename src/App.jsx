import './App.css'
import HomePage from './pages/home-page/home-page';
import LoginPage from './pages/login-page/login-page'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from './utils/private-route';
import SiteLayout from './components/layout/site-layout';
import SignupPage from './pages/signup-page/signup-page';
import BaseLayout from './components/layout/base-layout';
import ExplorePage from './pages/explore-page/explore-page';
import ProfilePage from './pages/profile-page/profile-page';
import PostPage from './pages/post-page/post-page';

function App() {

  return (
    <>
        <Router>
          <Routes>
            {/* Rutas protegidas */}
            <Route path="/" element={<PrivateRoute><SiteLayout><HomePage /></SiteLayout></PrivateRoute>} />
            <Route path="/explore" element={<PrivateRoute><SiteLayout><ExplorePage /></SiteLayout></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><SiteLayout><ProfilePage /></SiteLayout></PrivateRoute>} />
            <Route path="/post/:postId" element={<PrivateRoute><SiteLayout><PostPage /></SiteLayout></PrivateRoute>} />

            {/* Rutas públicas */}
            <Route path="/login" element={<BaseLayout><LoginPage /></BaseLayout>} />
            <Route path="/signup" element={<BaseLayout><SignupPage /></BaseLayout>} />
          </Routes>
        </Router>
    </>
  )
}

export default App
