import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { auth } from './firebase'; // Import your Firebase configuration
import LoginPage from './components/Login/login';
import Signup from './components/Register/register';
import HomePage from './components/homepage/homepage';
import SportsPage from './components/sports/sports';
import FashionPage from './components/fashion/fashion';
import WorldPage from './components/world/world';
import BusinessPage from './components/business/business';
import Culture from './components/culture/culture';
import TechPage from './components/tech/tech';
import HealthBlog from './components/health/health';
import ProfilePage from './components/profile/profile';
import BookmarkPage from './components/bookmark/bookmark';
import FavoritesPage from './components/favourite/favourite';
import EditBlogPost from './components/blogpost/editblog';
import AboutUs from './components/aboutus/aboutus';
import NewBlogPost from './components/blogpost/blogpost';
import BlogList from './components/blogpost/bloglist';
import BlogDetail from './components/blogpost/blogdetail';
import MyBlogUI from './components/my blogs';
import { FavoritesProvider } from './components/favourite/FavoritesContext'; // Import FavoritesProvider
import { BookmarkProvider } from './components/bookmark/BookmarkContext';  // Import the provider
import Dashboard from './components/adminpanel/dashboard';
import Settings from './components/adminpanel/setting';
import PendingBlogs from './components/adminpanel/pendingblogs';
import ManageUsers from './components/adminpanel/manageusers';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true); // User is logged in
      } else {
        setIsLoggedIn(false); // No user, so not logged in
      }
      setLoading(false); // Stop loading after authentication check
    });

    return () => unsubscribe(); // Clean up the listener when the component unmounts
  }, []);

  const navigate = useNavigate(); // Now useNavigate() can be used inside Router context

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setIsLoggedIn(false);
      navigate('/'); // Redirect to home or login page after logout
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading while checking auth state
  }

  return (
    <BookmarkProvider> 
    <FavoritesProvider>
      <Routes>
        {/* Conditional rendering based on user authentication */}
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/edit-blog/:postId"  element={<EditBlogPost />} />
        <Route path="/fashion" element={<FashionPage />} />
        <Route path="/world" element={<WorldPage />} />
        <Route path="/business" element={<BusinessPage />} />
        <Route path="/culture" element={<Culture />} />
        <Route path="/tech" element={<TechPage />} />
        <Route path="/health" element={<HealthBlog />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/favourite" element={<FavoritesPage />} />
        <Route path="/bookmark" element={<BookmarkPage />} />
        <Route path="/bloglist" element={<BlogList />} />
        <Route path="/myblog" element={<MyBlogUI />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/blogpost" element={<NewBlogPost />} />
        <Route path="/sportsblog" element={<SportsPage /> } />
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/adminpanel/pendingblogs" element={<PendingBlogs />}/>
        <Route path="/adminpanel/manageusers" element={<ManageUsers />}/>
        <Route path="/adminpanel/setting" element={<Settings />}/>


       



      </Routes>
    </FavoritesProvider>
    </BookmarkProvider>
  );
}

function Root() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default Root;
