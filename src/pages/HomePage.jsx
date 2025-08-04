import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Grid,
  Card,
  CardContent,
  CardActions,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import { 
  Add as AddIcon,
  RateReview as ReviewIcon,
  Quiz as QuizIcon,
  AccountCircle,
  Logout as LogoutIcon,
  Assessment as StatsIcon
} from '@mui/icons-material';

function HomePage({ user, handleLogout }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    handleClose();
    handleLogout();
  };

  const handleProfileClick = () => {
    handleClose();
    navigate('/profile');
  };

  return (
    <>
      {/* Top App Bar */}
      <AppBar position="static" sx={{ backgroundColor: 'primary.main' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            🍺 BeerTaste
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
              Witaj, {user?.displayName || 'Użytkowniku'}!
            </Typography>
            <IconButton
              size="large"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleProfileClick}>
                <AccountCircle sx={{ mr: 1 }} />
                Profil
              </MenuItem>
              <MenuItem onClick={handleLogoutClick}>
                <LogoutIcon sx={{ mr: 1 }} />
                Wyloguj
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Welcome Section */}
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Witaj w BeerTaste! 🍻
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Odkrywaj świat piwa, dziel się swoimi doświadczeniami i znajdź nowe ulubione smaki
          </Typography>
        </Box>

        {/* Main Actions */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <AddIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Dodaj Recenzję
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Oceń nowe piwo i podziel się swoją opinią
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button 
                  variant="contained" 
                  component={Link} 
                  to="/add-review"
                  startIcon={<AddIcon />}
                >
                  Dodaj
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <ReviewIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Moje Recenzje
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Przeglądaj swoje dotychczasowe oceny
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button 
                  variant="outlined" 
                  component={Link} 
                  to="/my-reviews"
                  startIcon={<ReviewIcon />}
                >
                  Zobacz
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <QuizIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Quiz Piwny
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sprawdź swoją wiedzę o piwie
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button 
                  variant="outlined" 
                  component={Link} 
                  to="/quiz"
                  startIcon={<QuizIcon />}
                >
                  Zagraj
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <StatsIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Statystyki
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Zobacz swoje osiągnięcia
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button 
                  variant="outlined" 
                  component={Link} 
                  to="/profile"
                  startIcon={<StatsIcon />}
                >
                  Profil
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>

        {/* Quick Stats */}
        <Box textAlign="center" sx={{ 
          background: 'linear-gradient(135deg, #FF6B35, #FFD700)',
          color: 'white',
          p: 3,
          borderRadius: 3,
          mb: 3
        }}>
          <Typography variant="h6" gutterBottom>
            Twoje statystyki
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="h4" component="div">
                🍺
              </Typography>
              <Typography variant="body2">
                Recenzje
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h4" component="div">
                ⭐
              </Typography>
              <Typography variant="body2">
                Średnia ocena
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h4" component="div">
                🏆
              </Typography>
              <Typography variant="body2">
                Poziom
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}

export default HomePage;
