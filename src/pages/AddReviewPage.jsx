import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  TextField,
  Paper,
  Rating,
  Card,
  CardMedia,
  IconButton,
  Grid
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  PhotoCamera as PhotoCameraIcon,
  Add as AddIcon
} from '@mui/icons-material';

function AddReviewPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    beerName: '',
    brewery: '',
    style: '',
    rating: 0,
    appearance: 0,
    aroma: 0,
    taste: 0,
    mouthfeel: 0,
    overall: 0,
    notes: '',
    photo: null
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRatingChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement Firebase save
    console.log('Saving review:', formData);
    navigate('/my-reviews');
  };

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" component="h1">
          Dodaj nową recenzję piwa
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Info */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nazwa piwa"
                name="beerName"
                value={formData.beerName}
                onChange={handleChange}
                required
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Browar"
                name="brewery"
                value={formData.brewery}
                onChange={handleChange}
                required
                margin="normal"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Styl piwa"
                name="style"
                value={formData.style}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>

            {/* Photo Section */}
            <Grid item xs={12}>
              <Card sx={{ p: 2, backgroundColor: 'grey.50' }}>
                <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" minHeight={200}>
                  <PhotoCameraIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Dodaj zdjęcie piwa
                  </Typography>
                  <Button variant="outlined" startIcon={<PhotoCameraIcon />}>
                    Wybierz zdjęcie
                  </Button>
                </Box>
              </Card>
            </Grid>

            {/* Ratings */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Oceny szczegółowe
              </Typography>
            </Grid>

            {[
              { field: 'appearance', label: 'Wygląd' },
              { field: 'aroma', label: 'Aromat' },
              { field: 'taste', label: 'Smak' },
              { field: 'mouthfeel', label: 'Tekstura' },
              { field: 'overall', label: 'Ogólna ocena' }
            ].map(({ field, label }) => (
              <Grid item xs={12} sm={6} key={field}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="body1">{label}:</Typography>
                  <Rating
                    value={formData[field]}
                    onChange={(_, value) => handleRatingChange(field, value)}
                    size="large"
                  />
                </Box>
              </Grid>
            ))}

            {/* Notes */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notatki degustacyjne"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                multiline
                rows={4}
                margin="normal"
                placeholder="Opisz swoje wrażenia z degustacji..."
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center" mt={2}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<AddIcon />}
                  sx={{ minWidth: 200 }}
                >
                  Dodaj recenzję
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

export default AddReviewPage;
