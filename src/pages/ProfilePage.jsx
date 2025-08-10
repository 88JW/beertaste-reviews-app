import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Button,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Favorite as FavoriteIcon
} from '@mui/icons-material';
import { db } from '../firebase';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';

// Placeholder for a beer icon if no photo is available
const BeerPlaceholderIcon = () => (
  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 2H16V3H8V2Z" fill="#a1a1aa"/>
    <path d="M18 4H6C5.44772 4 5 4.44772 5 5V20C5 21.1046 5.89543 22 7 22H17C18.1046 22 19 21.1046 19 20V5C19 4.44772 18.5523 4 18 4ZM17 20H7V6H17V20Z" fill="#a1a1aa"/>
    <path d="M14 9H16V17H14V9Z" fill="#a1a1aa"/>
  </svg>
);


function ProfilePage({ user, handleLogout }) {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [favoriteBeers, setFavoriteBeers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        return;
      }
      setLoading(true);
      try {
        const reviewsRef = collection(db, 'reviews');

        // Query for recent reviews
        const recentReviewsQuery = query(
          reviewsRef,
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(5)
        );

        // Query for favorite beers (top rated)
        const favoriteBeersQuery = query(
          reviewsRef,
          where('userId', '==', user.uid),
          orderBy('overallRating', 'desc'),
          limit(3)
        );

        const [recentReviewsSnapshot, favoriteBeersSnapshot] = await Promise.all([
          getDocs(recentReviewsQuery),
          getDocs(favoriteBeersQuery)
        ]);

        const recentReviews = recentReviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const topBeers = favoriteBeersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setReviews(recentReviews);
        setFavoriteBeers(topBeers);

      } catch (error) {
        console.error("Error fetching user data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#102310' }}>
        <CircularProgress sx={{ color: 'white' }} />
      </Box>
    );
  }

  return (
    <Box sx={{
      bgcolor: '#102310',
      minHeight: '100vh',
      color: 'white',
      fontFamily: '"Space Grotesk", "Noto Sans", sans-serif'
    }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', p: '16px', justifyContent: 'space-between' }}>
        <IconButton onClick={() => navigate(-1)} sx={{ color: 'white' }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" component="h2" sx={{ flex: 1, textAlign: 'center', pr: '48px' /* to balance the icon button */ }}>
          Profile
        </Typography>
      </Box>

      {/* User Info */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: '16px', gap: 2 }}>
        <Avatar
          src={user?.photoURL}
          alt={user?.displayName || 'User Avatar'}
          sx={{ width: 128, height: 128, mb: 1, border: '2px solid #90cb90' }}
        >
          {/* Fallback to first letter of display name */}
          {user?.displayName?.charAt(0)?.toUpperCase()}
        </Avatar>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          {user?.displayName || 'Użytkownik'}
        </Typography>
        <Typography sx={{ color: '#90cb90' }}>
          {user?.email}
        </Typography>
      </Box>

      {/* My Ratings */}
      <Typography variant="h6" sx={{ fontWeight: 'bold', px: '16px', pt: '16px', pb: '8px' }}>
        My Ratings
      </Typography>
      <List sx={{ p: 0 }}>
        {reviews.map((review, index) => (
          <React.Fragment key={review.id}>
            <ListItem sx={{ py: '8px', px: '16px' }}>
              <ListItemAvatar>
                 <Avatar
                  variant="rounded"
                  src={review.photoUrl}
                  sx={{ width: 56, height: 56, bgcolor: 'transparent' }}
                >
                  <BeerPlaceholderIcon/>
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<Typography sx={{ color: 'white', fontWeight: 'medium' }}>{review.beerName}</Typography>}
                secondary={<Typography sx={{ color: '#90cb90', fontSize: '0.875rem' }}>{review.style}</Typography>}
              />
              <Typography variant="body1" sx={{ color: 'white' }}>
                {review.overallRating.toFixed(1)}
              </Typography>
            </ListItem>
            {index < reviews.length - 1 && <Divider sx={{ bgcolor: '#224922', mx: '16px' }} />}
          </React.Fragment>
        ))}
      </List>

      {/* Favorite Beers */}
      <Typography variant="h6" sx={{ fontWeight: 'bold', px: '16px', pt: '16px', pb: '8px' }}>
        Favorite Beers
      </Typography>
      <List sx={{ p: 0 }}>
        {favoriteBeers.map((beer, index) => (
          <React.Fragment key={beer.id}>
            <ListItem sx={{ py: '8px', px: '16px' }}>
              <ListItemAvatar>
                <Avatar
                    variant="rounded"
                    src={beer.photoUrl}
                    sx={{ width: 56, height: 56, bgcolor: 'transparent' }}
                  >
                  <BeerPlaceholderIcon/>
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<Typography sx={{ color: 'white', fontWeight: 'medium' }}>{beer.beerName}</Typography>}
                secondary={<Typography sx={{ color: '#90cb90', fontSize: '0.875rem' }}>{beer.style}</Typography>}
              />
              <IconButton sx={{ color: 'white' }}>
                <FavoriteIcon />
              </IconButton>
            </ListItem>
            {index < favoriteBeers.length - 1 && <Divider sx={{ bgcolor: '#224922', mx: '16px' }} />}
          </React.Fragment>
        ))}
      </List>

      {/* Action Buttons */}
      <Box sx={{ p: '16px', display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
         <Button
            fullWidth
            variant="contained"
            onClick={() => navigate('/my-reviews')}
            sx={{
              bgcolor: '#224922',
              color: 'white',
              fontWeight: 'bold',
              borderRadius: '12px',
              maxWidth: '480px',
              '&:hover': { bgcolor: '#336933' }
            }}
          >
            Account Settings
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleLogout}
             sx={{
              borderColor: '#224922',
              color: '#90cb90',
              fontWeight: 'bold',
              borderRadius: '12px',
               '&:hover': { borderColor: '#336933' }
            }}
          >
            Log Out
          </Button>
      </Box>
    </Box>
  );
}

export default ProfilePage;
