import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Auth from './pages/Auth';
import ListItem from './pages/ListItem';
import Search from './pages/Search';
import ItemDetail from './pages/ItemDetail';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import { ItemsPage } from './pages/ItemsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/search" element={<Search />} />
              <Route path="/items/:id" element={<ItemDetail />} />
              <Route
                path="/list-item"
                element={
                  <PrivateRoute>
                    <ListItem />
                  </PrivateRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route path="/items" element={<ItemsPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;