import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { 
  Container, 
  Typography, 
  Box, 
  Grid,
  Card,
  CardContent,
  CardMedia,
  Rating,
  IconButton,
  Chip,
  Button,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Sort as SortIcon
} from '@mui/icons-material';

function MyReviewsPage() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest'); // newest, oldest, highest, lowest

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      getReviews();
    }
  }, [user]);

  const getReviews = async () => {
    if (!user) {
      setError("Użytkownik nie jest zalogowany.");
      setLoading(false);
      return;
    }
    
    setError(null);
    setLoading(true);
    
    const reviewsRef = collection(db, "reviews");
    const q = query(reviewsRef, where("userId", "==", user.uid));
    
    try {
      const querySnapshot = await getDocs(q);
      const fetchedReviews = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        photoUrl: doc.data().photoUrl || null,
      }));
      
      console.log("Pobrane recenzje:", fetchedReviews);
      console.log(`Użytkownik ${user.email} ma ${fetchedReviews.length} recenzji`);
      
      // Debug: sprawdźmy strukturę pierwszej recenzji
      if (fetchedReviews.length > 0) {
        console.log("Przykładowa recenzja:", fetchedReviews[0]);
        console.log("Dostępne pola daty:", {
          createdAt: fetchedReviews[0].createdAt,
          tastingDate: fetchedReviews[0].tastingDate,
          date: fetchedReviews[0].date,
          timestamp: fetchedReviews[0].timestamp
        });
      }
      
      setReviews(fetchedReviews);
    } catch (err) {
      setError("Wystąpił błąd podczas pobierania recenzji.");
      console.error("Błąd pobierania recenzji:", err);
    } finally {
      setLoading(false);
    }
  };

  const sortReviews = (reviewsArray, order) => {
    const sorted = [...reviewsArray];
    
    console.log("Sortowanie:", order, "Liczba recenzji:", sorted.length);
    
    switch (order) {
      case 'newest':
        return sorted.sort((a, b) => {
          // Używamy timestamp (Firebase) lub tastingDate jako fallback
          const dateA = a.timestamp?.toDate?.() || new Date(a.tastingDate) || new Date(0);
          const dateB = b.timestamp?.toDate?.() || new Date(b.tastingDate) || new Date(0);
          
          console.log("Porównanie dat:", {
            a: a.beerName || a.name,
            timestampA: a.timestamp,
            tastingDateA: a.tastingDate,
            finalDateA: dateA.toISOString(),
            b: b.beerName || b.name, 
            timestampB: b.timestamp,
            tastingDateB: b.tastingDate,
            finalDateB: dateB.toISOString()
          });
          return dateB - dateA;
        });
      case 'oldest':
        return sorted.sort((a, b) => {
          const dateA = a.timestamp?.toDate?.() || new Date(a.tastingDate) || new Date(0);
          const dateB = b.timestamp?.toDate?.() || new Date(b.tastingDate) || new Date(0);
          return dateA - dateB;
        });
      case 'highest':
        return sorted.sort((a, b) => {
          console.log("Porównanie ocen:", {
            a: a.beerName || a.name,
            ocenaA: a.overall,
            b: b.beerName || b.name,
            ocenaB: b.overall
          });
          return (b.overall || 0) - (a.overall || 0);
        });
      case 'lowest':
        return sorted.sort((a, b) => (a.overall || 0) - (b.overall || 0));
      default:
        return sorted;
    }
  };

  const sortedReviews = sortReviews(reviews, sortOrder);

  const handleEdit = (reviewId) => {
    navigate(`/edit-review/${reviewId}`);
  };

  const handleDelete = (reviewId) => {
    if (window.confirm('Czy na pewno chcesz usunąć tę recenzję?')) {
      // TODO: Delete from Firebase
      setReviews(reviews.filter(review => review.id !== reviewId));
    }
  };

  const handleViewDetails = (reviewId) => {
    navigate(`/review/${reviewId}`);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Ładowanie recenzji...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/')}>
          Powrót do głównej
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => navigate('/')} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" component="h1">
            Moje recenzje ({reviews.length})
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => navigate('/add-review')}
        >
          Dodaj nową
        </Button>
      </Box>

      {/* Sortowanie */}
      {reviews.length > 0 && (
        <Box mb={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Sortuj według</InputLabel>
              <Select
                value={sortOrder}
                label="Sortuj według"
                onChange={(e) => setSortOrder(e.target.value)}
                startAdornment={<SortIcon sx={{ mr: 1, color: 'text.secondary' }} />}
              >
                <MenuItem value="newest">Najnowsze</MenuItem>
                <MenuItem value="oldest">Najstarsze</MenuItem>
                <MenuItem value="highest">Najwyższa ocena</MenuItem>
                <MenuItem value="lowest">Najniższa ocena</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="body2" color="text.secondary">
              {sortedReviews.length} {sortedReviews.length === 1 ? 'recenzja' : 
               sortedReviews.length < 5 ? 'recenzje' : 'recenzji'}
            </Typography>
          </Stack>
        </Box>
      )}

      {reviews.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nie masz jeszcze żadnych recenzji
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Dodaj swoją pierwszą recenzję piwa!
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            startIcon={<AddIcon />}
            onClick={() => navigate('/add-review')}
            sx={{ mt: 2 }}
          >
            Dodaj recenzję
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {sortedReviews.map((review) => (
            <Grid item xs={12} sm={6} md={4} key={review.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.2s ease-in-out'
                  }
                }}
                onClick={() => handleViewDetails(review.id)}
              >
                {review.photoUrl && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={review.photoUrl}
                    alt={review.beerName}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom noWrap>
                    {review.beerName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {review.brewery}
                  </Typography>
                  <Chip 
                    label={review.style} 
                    size="small" 
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <Box display="flex" alignItems="center" mb={1}>
                    <Rating value={review.overall} readOnly size="small" />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      ({review.overall}/5)
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {review.notes}
                  </Typography>
                </CardContent>
                <Box display="flex" justifyContent="space-between" p={1}>
                  <Typography variant="caption" color="text.secondary">
                    {(() => {
                      // Używamy timestamp (Firebase) lub tastingDate jako fallback
                      const date = review.timestamp?.toDate?.() || new Date(review.tastingDate);
                      return date.toLocaleDateString('pl-PL', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      });
                    })()}
                  </Typography>
                  <Box>
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(review.id);
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(review.id);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default MyReviewsPage;
