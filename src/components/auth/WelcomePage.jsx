import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Card, 
  CardContent,
  Stack
} from '@mui/material';
import { 
  RateReview as ReviewIcon,
  Quiz as QuizIcon,
  TrendingUp as TrendingIcon
} from '@mui/icons-material';

function WelcomePage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h1" component="h1" gutterBottom sx={{ 
          background: 'linear-gradient(45deg, #FF6B35, #FFD700)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 2
        }}>
          🍺 BeerTaste
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Oceniaj, recenzuj i odkrywaj niesamowite piwa
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
          Dołącz do społeczności miłośników piwa. Dziel się swoimi doświadczeniami, 
          odkrywaj nowe smaki i znajdź swoje ulubione piwa.
        </Typography>
      </Box>

      {/* Features */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} mb={4}>
        <Card sx={{ flex: 1 }}>
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <ReviewIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Recenzje Piw
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Oceniaj piwa, dodawaj zdjęcia i dziel się swoimi wrażeniami z innymi
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <QuizIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Quiz Piwny
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sprawdź swoją wiedzę o piwie i poznaj ciekawe fakty
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <TrendingIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Statystyki
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Śledź swoje degustacje i odkrywaj trendy w świecie piwa
            </Typography>
          </CardContent>
        </Card>
      </Stack>

      {/* Action Buttons */}
      <Box textAlign="center">
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          <Button 
            variant="contained" 
            size="large"
            component={Link}
            to="/login"
            sx={{ minWidth: 140 }}
          >
            Zaloguj się
          </Button>
          <Button 
            variant="outlined" 
            size="large"
            component={Link}
            to="/register"
            sx={{ minWidth: 140 }}
          >
            Zarejestruj się
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}

export default WelcomePage;
