import './App.css'
import HomePage from './pages/home-page/home-page';
import LoginPage from './pages/login-page/login-page'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from './utils/private-route';
import SiteLayout from './components/layout/site-layout';
import SignupPage from './pages/signup-page/signup-page';
import BaseLayout from './components/layout/base-layout';
import ExplorePage from './pages/explore-page/explore-page';
import PostPage from './pages/post-page/post-page';
import UserPage from './pages/user-page/user-page';
import { useEffect } from 'react';
import { handleStorageChange } from './utils/utils';

function App() {
/*
  useEffect(() => {

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
*/
  return (
    <>
        <Router>
          <Routes>
            {/* Rutas protegidas */}
            <Route path="/" element={<PrivateRoute><SiteLayout><HomePage /></SiteLayout></PrivateRoute>} />
            <Route path="/explore" element={<PrivateRoute><SiteLayout><ExplorePage /></SiteLayout></PrivateRoute>} />
            <Route path="/user/:userId" element={<PrivateRoute><SiteLayout><UserPage /></SiteLayout></PrivateRoute>} />
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
