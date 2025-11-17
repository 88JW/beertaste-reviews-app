import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Container } from '@mui/material';
import { onAuthStateChanged, signOut } from 'firebase/auth';

// Theme and Firebase
import theme from './theme';
import { auth } from './firebase';

// Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import WelcomePage from './components/auth/WelcomePage';
import PasswordReset from './components/auth/PasswordReset';

// Pages
import HomePage from './pages/HomePage';
import AddReviewPage from './pages/AddReviewPage';
import MyReviewsPage from './pages/MyReviewsPage';
import ReviewDetailsPage from './pages/ReviewDetailsPage';
import EditReviewPage from './pages/EditReviewPage';
import QuizPage from './pages/QuizPage';
import ProfilePage from './pages/ProfilePage';
import AddSimpleReviewPage from './pages/AddSimpleReviewPage';

function App() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Zaczynamy z false zamiast null
  const [loading, setLoading] = useState(false); // Nie ładujemy na starcie

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Błąd wylogowania:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Routes>
            {!isLoggedIn ? (
              // Routes for non-authenticated users
              <>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/login" element={<Login setUser={setUser} setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/password-reset" element={<PasswordReset />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            ) : (
              // Routes for authenticated users
              <>
                <Route path="/" element={<HomePage user={user} handleLogout={handleLogout} />} />
                <Route path="/add-review" element={<AddReviewPage />} />
                <Route path="/add-simple-review" element={<AddSimpleReviewPage />} />
                <Route path="/my-reviews" element={<MyReviewsPage />} />
                <Route path="/review/:id" element={<ReviewDetailsPage />} />
                <Route path="/edit-review/:id" element={<EditReviewPage />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/profile" element={<ProfilePage user={user} handleLogout={handleLogout} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            )}
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
