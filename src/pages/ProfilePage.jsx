import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box,
  Paper,
  Grid,
  Avatar,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { 
  Person as PersonIcon,
  Email as EmailIcon,
  RateReview as ReviewIcon,
  Quiz as QuizIcon,
  EmojiEvents as TrophyIcon,
  LocalDrink as DrinkIcon
} from '@mui/icons-material';

function ProfilePage({ user, handleLogout }) {
  const navigate = useNavigate();

  const stats = {
    reviewsCount: 12,
    averageRating: 3.8,
    beersDrank: 89,
    quizScore: 750,
    favoriteStyle: 'IPA'
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom textAlign="center">
        Mój Profil
      </Typography>

      <Grid container spacing={3}>
        {/* User Info */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <Avatar 
              sx={{ 
                width: 100, 
                height: 100, 
                mx: 'auto', 
                mb: 2,
                bgcolor: 'primary.main',
                fontSize: '2rem'
              }}
            >
              {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>
            <Typography variant="h6" gutterBottom>
              {user?.displayName || 'Użytkownik'}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {user?.email}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Członek od: {new Date().toLocaleDateString()}
            </Typography>
          </Paper>
        </Grid>

        {/* Stats */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Statystyki
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Box textAlign="center">
                  <ReviewIcon color="primary" sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="h6">{stats.reviewsCount}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Recenzje
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <Box textAlign="center">
                  <DrinkIcon color="secondary" sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="h6">{stats.beersDrank}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Piw wypitych
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <Box textAlign="center">
                  <TrophyIcon sx={{ color: '#FFD700', fontSize: 32, mb: 1 }} />
                  <Typography variant="h6">{stats.averageRating}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Średnia ocena
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <Box textAlign="center">
                  <QuizIcon color="primary" sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="h6">{stats.quizScore}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Punkty quiz
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Achievements */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Osiągnięcia
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <TrophyIcon sx={{ color: '#FFD700' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Pierwsza recenzja" 
                  secondary="Dodałeś swoją pierwszą recenzję piwa"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ReviewIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Recenzent" 
                  secondary={`Dodałeś ${stats.reviewsCount} recenzji`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <DrinkIcon color="secondary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Entuzjasta piwa" 
                  secondary={`Wypiłeś już ${stats.beersDrank} piw!`}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Actions */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center" gap={2}>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/my-reviews')}
            >
              Moje Recenzje
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/add-review')}
            >
              Dodaj Recenzję
            </Button>
            <Button 
              variant="outlined" 
              color="error"
              onClick={handleLogout}
            >
              Wyloguj się
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ProfilePage;
