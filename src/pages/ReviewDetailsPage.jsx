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
  // Mock data for now with new structure
  const review = {
    id: id,
    beerName: 'Żywiec Porter',
    brewery: 'Grupa Żywiec',
    style: 'Porter',
    tastingDate: '2024-01-15',
    // Aromat
    aromaIntensity: 4,
    aromaQuality: 4,
    aromaNotesText: 'Intensywny aromat prażonych ziaren, nuty czekolady i kawy',
    // Wygląd
    color: 'Czarne',
    clarity: 4,
    foam: 3,
    // Smak
    tasteIntensity: 4,
    tasteBalance: 4,
    bitterness: 3,
    sweetness: 2,
    acidity: 2,
    tasteNotes: 'Bogaty smak z nutami czekolady, kawy i lekką goryczką',
    // Dodatkowe
    drinkability: 4,
    complexity: 4,
    overallRating: 8, // 1-10 scale
    // Meta
    comments: 'Degustacja w pubie Starka w Krakowie. Bardzo dobre piwo na zimowy wieczór.',
    selectedIcon: 'thumbUp',
    photoUrl: null,
    createdAt: new Date('2024-01-15'),
    location: 'Kraków, Pub Starka'
  };

  const aromaCategories = [
    { field: 'aromaIntensity', label: 'Intensywność aromatu', value: review.aromaIntensity },
    { field: 'aromaQuality', label: 'Jakość aromatu', value: review.aromaQuality }
  ];

  const appearanceCategories = [
    { field: 'clarity', label: 'Klarowność', value: review.clarity },
    { field: 'foam', label: 'Piana', value: review.foam }
  ];

  const tasteCategories = [
    { field: 'tasteIntensity', label: 'Intensywność smaku', value: review.tasteIntensity },
    { field: 'tasteBalance', label: 'Równowaga smaku', value: review.tasteBalance },
    { field: 'bitterness', label: 'Goryczka', value: review.bitterness },
    { field: 'sweetness', label: 'Słodycz', value: review.sweetness },
    { field: 'acidity', label: 'Kwasowość', value: review.acidity }
  ];

  const additionalCategories = [
    { field: 'drinkability', label: 'Pijalność', value: review.drinkability },
    { field: 'complexity', label: 'Złożoność', value: review.complexity }
  ];

  const renderIcon = () => {
    switch (review.selectedIcon) {
      case 'heart':
        return <span style={{ color: 'red', fontSize: '24px' }}>❤️</span>;
      case 'star':
        return <span style={{ color: 'gold', fontSize: '24px' }}>⭐</span>;
      case 'thumbUp':
        return <span style={{ color: 'green', fontSize: '24px' }}>👍</span>;
      case 'thumbDown':
        return <span style={{ color: 'gray', fontSize: '24px' }}>👎</span>;
      default:
        return null;
    }
  };

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
              <Typography variant="h4" sx={{ mr: 2 }}>
                {review.overallRating}/10
              </Typography>
              <Rating value={review.overallRating / 2} readOnly size="large" max={5} />
              {renderIcon() && (
                <Box sx={{ ml: 2 }}>
                  {renderIcon()}
                </Box>
              )}
            </Box>

            <Typography variant="body2" color="text.secondary" gutterBottom>
              Degustacja: {new Date(review.tastingDate).toLocaleDateString()}
            </Typography>
            {review.location && (
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Miejsce: {review.location}
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Kolor: {review.color}
            </Typography>
          </Paper>
        </Grid>

        {/* Aromat */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Aromat
            </Typography>
            <Grid container spacing={2}>
              {aromaCategories.map(({ field, label, value }) => (
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
            {review.aromaNotesText && (
              <Box mt={2}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Nuty:</strong> {review.aromaNotesText}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Wygląd */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Wygląd
            </Typography>
            <Grid container spacing={2}>
              {appearanceCategories.map(({ field, label, value }) => (
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

        {/* Smak */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Smak
            </Typography>
            <Grid container spacing={2}>
              {tasteCategories.map(({ field, label, value }) => (
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
            {review.tasteNotes && (
              <Box mt={2}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Nuty smakowe:</strong> {review.tasteNotes}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Dodatkowe właściwości */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Dodatkowe właściwości
            </Typography>
            <Grid container spacing={2}>
              {additionalCategories.map(({ field, label, value }) => (
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

        {/* Komentarze */}
        {review.comments && (
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Dodatkowe uwagi
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                {review.comments}
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default ReviewDetailsPage;
