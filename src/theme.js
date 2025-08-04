import { createTheme } from '@mui/material/styles';

// BeerTaste theme - focused on beer rating and social features
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FF6B35', // Beer amber color
      light: '#FF8A65',
      dark: '#E64A19',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FFD700', // Beer gold color
      light: '#FFECB3',
      dark: '#FFA000',
      contrastText: '#000000',
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2C2C2C',
      secondary: '#666666',
    },
    rating: {
      excellent: '#4CAF50',
      good: '#8BC34A',
      average: '#FFC107',
      poor: '#FF9800',
      terrible: '#F44336',
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#2C2C2C',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#2C2C2C',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#2C2C2C',
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25,
          padding: '10px 24px',
          fontSize: '1rem',
          fontWeight: 500,
        },
        contained: {
          boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(255, 107, 53, 0.4)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiRating: {
      styleOverrides: {
        root: {
          fontSize: '1.5rem',
        },
        iconFilled: {
          color: '#FFD700',
        },
        iconEmpty: {
          color: '#E0E0E0',
        },
      },
    },
  },
});

export default theme;
