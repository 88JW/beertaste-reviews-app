import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box,
  Alert,
  IconButton,
  InputAdornment
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';

function Login({ setUser, setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      setIsLoggedIn(true);
      navigate('/');
    } catch (error) {
      console.error('Błąd logowania:', error);
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'Nie znaleziono użytkownika z tym adresem email.';
      case 'auth/wrong-password':
        return 'Nieprawidłowe hasło.';
      case 'auth/invalid-email':
        return 'Nieprawidłowy format adresu email.';
      case 'auth/too-many-requests':
        return 'Zbyt wiele nieudanych prób logowania. Spróbuj ponownie później.';
      default:
        return 'Wystąpił błąd podczas logowania. Spróbuj ponownie.';
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box textAlign="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom sx={{
          background: 'linear-gradient(45deg, #FF6B35, #FFD700)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          🍺 Zaloguj się
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Wprowadź swoje dane, aby kontynuować
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Hasło"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            {loading ? 'Logowanie...' : 'Zaloguj się'}
          </Button>

          <Box textAlign="center">
            <Button
              component={Link}
              to="/password-reset"
              color="primary"
              sx={{ mb: 1 }}
            >
              Zapomniałeś hasła?
            </Button>
          </Box>
        </Box>
      </Paper>

      <Box textAlign="center" mt={3}>
        <Typography variant="body2" color="text.secondary">
          Nie masz konta?{' '}
          <Button component={Link} to="/register" color="primary">
            Zarejestruj się
          </Button>
        </Typography>
      </Box>
    </Container>
  );
}

export default Login;
