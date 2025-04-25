import React, { useEffect, useState } from 'react';
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
import PaymentPage from './pages/PaymentPage';
import { ensurePublicBucket, supabase } from './lib/supabase';

const App = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check authentication and initialize storage
    const initApp = async () => {
      try {
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        
        // Only try to initialize storage if user is authenticated
        if (session) {
          await ensurePublicBucket();
          console.log('Storage bucket initialized successfully');
        } else {
          console.log('User not authenticated, skipping storage initialization');
        }
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setIsInitialized(true);
      }
    };
    
    initApp();
  }, []);

  // Show loading state while initializing
  if (!isInitialized) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

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
              <Route
                path="/payment/:bookingId"
                element={
                  <PrivateRoute>
                    <PaymentPage />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;