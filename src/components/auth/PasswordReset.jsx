import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box,
  Alert,
  InputAdornment
} from '@mui/material';
import { Email as EmailIcon } from '@mui/icons-material';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase';

function PasswordReset() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Link do resetowania hasła został wysłany na Twój adres email.');
    } catch (error) {
      console.error('Błąd resetowania hasła:', error);
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'Nie znaleziono użytkownika z tym adresem email.';
      case 'auth/invalid-email':
        return 'Nieprawidłowy format adresu email.';
      default:
        return 'Wystąpił błąd. Spróbuj ponownie.';
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
          🔑 Resetuj hasło
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Wprowadź swój adres email, aby otrzymać link do resetowania hasła
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {message && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {message}
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

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            {loading ? 'Wysyłanie...' : 'Wyślij link resetujący'}
          </Button>
        </Box>
      </Paper>

      <Box textAlign="center" mt={3}>
        <Typography variant="body2" color="text.secondary">
          Pamiętasz hasło?{' '}
          <Button component={Link} to="/login" color="primary">
            Zaloguj się
          </Button>
        </Typography>
      </Box>
    </Container>
  );
}

export default PasswordReset;
