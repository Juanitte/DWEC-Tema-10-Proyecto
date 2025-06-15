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
import SavedPage from './pages/saved-page/saved-page';
import ConfigPage from './pages/config-page/config-page';
import { ToastContainer } from 'react-toastify';
import FollowsPage from './pages/follows-page/follows-page';
import MessagesPage from './pages/messages-page/messages-page';
import ChatMessagesPage from './pages/messages-page/chat-messages-page';

function App() {

  useEffect(() => {

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <>
      <ToastContainer
        position="bottom-center"
        newestOnTop={false}
        closeButton={true}
        autoClose={2000}
        limit={3}
        theme='light'
      />
      <Router>
        <Routes>
          {/* Rutas protegidas */}
          <Route path="/" element={<PrivateRoute><SiteLayout><HomePage /></SiteLayout></PrivateRoute>} />
          <Route path="/explore" element={<PrivateRoute><SiteLayout isExplorePage={true}><ExplorePage /></SiteLayout></PrivateRoute>} />
          <Route path="/saved/:userId" element={<PrivateRoute><SiteLayout><SavedPage /></SiteLayout></PrivateRoute>} />
          <Route path="/user/:userId" element={<PrivateRoute><SiteLayout><UserPage /></SiteLayout></PrivateRoute>} />
          <Route path="/user/:userId/follows" element={<PrivateRoute><SiteLayout><FollowsPage /></SiteLayout></PrivateRoute>} />
          <Route path="/post/:postId" element={<PrivateRoute><SiteLayout><PostPage /></SiteLayout></PrivateRoute>} />
          <Route path="/chats/:userId" element={<PrivateRoute><SiteLayout><MessagesPage /></SiteLayout></PrivateRoute>} />
          <Route path="/messages/:chatId" element={<PrivateRoute><SiteLayout><ChatMessagesPage /></SiteLayout></PrivateRoute>} />
          <Route path='/settings' element={<PrivateRoute><SiteLayout><ConfigPage /></SiteLayout></PrivateRoute>} />

          {/* Rutas públicas */}
          <Route path="/login" element={<BaseLayout><LoginPage /></BaseLayout>} />
          <Route path="/signup" element={<BaseLayout><SignupPage /></BaseLayout>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
