import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage.js';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BookPage from './pages/BookPage.js';
import UserPage from './pages/UserPage.js';
import LoanPage from './pages/LoanPage.js';
import InventoryPage from './pages/InventoryPage.js';
import PopularBooksPage from './pages/PopulerBooksPage.js';
import Dashboard from './pages/Dashboard.js';
import ExportData from './pages/ExportData.js';
import Navbar from './components/Navbar';
import useAuth from './hooks/useAuth';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  const authenticated = useAuth();
  return authenticated ? element : <Navigate to="/login" />;
};

const AppContent = () => {
  const location = useLocation();
  const showNavbar = !['/', '/login', '/signup'].includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} exact />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/books" element={<BookPage />} />
        <Route path="/users" element={<UserPage />} />
        <Route path="/loans" element={<LoanPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/popular-books" element={<PopularBooksPage />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<Dashboard />} />}
        />
        <Route path="/export" element={<ExportData />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <AppContent />
      </div>
    </Router>
  );
}

export default App;
