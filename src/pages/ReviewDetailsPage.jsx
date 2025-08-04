import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper,
  Grid,
  Rating,
  Chip,
  IconButton,
  Button
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Share as ShareIcon
} from '@mui/icons-material';

function ReviewDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  // TODO: Fetch review by ID from Firebase
  // Mock data for now
  const review = {
    id: id,
    beerName: 'Żywiec Porter',
    brewery: 'Grupa Żywiec',
    style: 'Porter',
    overall: 4,
    appearance: 4,
    aroma: 4,
    taste: 4,
    mouthfeel: 4,
    notes: 'Bardzo dobre piwo z nutami czekolady i kawy. Kremowa piana, ciemny kolor. Aromat intensywny, z wyczuwalnymi nutami prażonych ziaren. Smak bogaty, dobrze zbalansowany z lekką goryczką na końcu.',
    photoUrl: null,
    createdAt: new Date('2024-01-15'),
    tastingDate: '2024-01-15',
    location: 'Kraków, Pub Starka'
  };

  const ratingCategories = [
    { field: 'appearance', label: 'Wygląd', value: review.appearance },
    { field: 'aroma', label: 'Aromat', value: review.aroma },
    { field: 'taste', label: 'Smak', value: review.taste },
    { field: 'mouthfeel', label: 'Tekstura', value: review.mouthfeel },
    { field: 'overall', label: 'Ogólna ocena', value: review.overall }
  ];

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => navigate('/my-reviews')} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" component="h1">
            Szczegóły recenzji
          </Typography>
        </Box>
        <Box>
          <IconButton color="primary">
            <ShareIcon />
          </IconButton>
          <Button 
            variant="outlined" 
            startIcon={<EditIcon />}
            onClick={() => navigate(`/edit-review/${id}`)}
            sx={{ ml: 1 }}
          >
            Edytuj
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Beer Photo */}
        {review.photoUrl && (
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 1 }}>
              <img 
                src={review.photoUrl} 
                alt={review.beerName}
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '8px'
                }}
              />
            </Paper>
          </Grid>
        )}

        {/* Beer Info */}
        <Grid item xs={12} md={review.photoUrl ? 8 : 12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              {review.beerName}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {review.brewery}
            </Typography>
            <Box mb={3}>
              <Chip label={review.style} variant="outlined" size="large" />
            </Box>

            <Box display="flex" alignItems="center" mb={3}>
              <Rating value={review.overall} readOnly size="large" />
              <Typography variant="h6" sx={{ ml: 2 }}>
                {review.overall}/5
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" gutterBottom>
              Degustacja: {new Date(review.tastingDate).toLocaleDateString()}
            </Typography>
            {review.location && (
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Miejsce: {review.location}
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Detailed Ratings */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Szczegółowe oceny
            </Typography>
            <Grid container spacing={2}>
              {ratingCategories.map(({ field, label, value }) => (
                <Grid item xs={12} sm={6} key={field}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="body1">{label}:</Typography>
                    <Box display="flex" alignItems="center">
                      <Rating value={value} readOnly />
                      <Typography variant="body2" sx={{ ml: 1, minWidth: 30 }}>
                        {value}/5
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Tasting Notes */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Notatki degustacyjne
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              {review.notes}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ReviewDetailsPage;
