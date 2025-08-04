import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box,
  IconButton,
  Paper,
  Button
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Quiz as QuizIcon 
} from '@mui/icons-material';

function QuizPage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate('/')} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" component="h1">
          Quiz Piwny 🍺
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <QuizIcon sx={{ fontSize: 80, color: 'primary.main', mb: 3 }} />
        <Typography variant="h6" gutterBottom>
          Sprawdź swoją wiedzę o piwie!
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Quiz piwny z 1000+ pytań o stylach piwa, składnikach, procesie warzenia i ciekawostkach.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Ta funkcjonalność zostanie wkrótce przeniesiona z oryginalnej aplikacji.
        </Typography>
        <Button 
          variant="contained" 
          size="large"
          startIcon={<QuizIcon />}
          disabled
        >
          Rozpocznij Quiz (Wkrótce)
        </Button>
      </Paper>
    </Container>
  );
}

export default QuizPage;
