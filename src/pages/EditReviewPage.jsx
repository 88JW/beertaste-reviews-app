import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  IconButton
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

function EditReviewPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" component="h1">
          Edytuj recenzję
        </Typography>
      </Box>
      
      <Typography variant="body1">
        Edycja recenzji o ID: {id}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Ta funkcjonalność zostanie wkrótce dodana.
      </Typography>
    </Container>
  );
}

export default EditReviewPage;
