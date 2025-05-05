import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Auth from './pages/Auth';
import ListItem from './pages/ListItem';
import Search from './pages/Search';
import ItemDetail from './pages/ItemDetail';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import { ItemsPage } from './pages/ItemsPage';
import PaymentPage from './pages/PaymentPage';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import ResetPassword from './pages/ResetPassword';
import { ensurePublicBucket, supabase } from './lib/supabase';

// Debug log for initial render
console.log('App component initializing');

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <pre className="text-sm text-gray-600">{this.state.error?.toString()}</pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const App = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    console.log('App useEffect running');
    // Check authentication and initialize storage
    const initApp = async () => {
      try {
        console.log('Initializing app...');
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Auth session:', session ? 'exists' : 'none');
        
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
        console.log('App initialization complete');
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
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pt-16 bg-gray-50">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/auth/reset-password" element={<ResetPassword />} />
                <Route path="/search" element={<Search />} />
                <Route path="/items" element={<ItemsPage />} />
                <Route path="/item/:id" element={<ItemDetail />} />
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
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <PrivateRoute>
                      <Checkout />
                    </PrivateRoute>
                  }
                />
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
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;