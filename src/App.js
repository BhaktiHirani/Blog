import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/homepage/homepage';
import SportsPage from './components/sports/sports';
import Fashion from './components/fashion/fashion'; 
import WorldPage from './components/world/world'; 
import Business from './components/business/business';  
import Culture from './components/culture/culture';
import TechPage from './components/tech/tech';   
import HealthBlog from './components/health/health'; 
import BlogDetail from './components/blogdeatils';   

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sports" element={<SportsPage />} />
        <Route path="/fashion" element={<Fashion />} />
        <Route path="/world" element={<WorldPage />} />
        <Route path="/business" element={<Business />} />
        <Route path="/culture" element={<Culture />} />
        <Route path="/tech" element={<TechPage />} />
        <Route path="/health" element={<HealthBlog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />

      </Routes>
    </Router>
  );
}

export default App;
