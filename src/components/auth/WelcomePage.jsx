import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

function WelcomePage() {
  return (
    <Box 
      sx={{ 
        position: 'relative',
        display: 'flex',
        minHeight: '100vh',
        flexDirection: 'column',
        backgroundColor: '#102310',
        justifyContent: 'space-between',
        overflow: 'hidden',
        fontFamily: '"Space Grotesk", "Noto Sans", sans-serif'
      }}
    >
      {/* Top Section with Image and Title */}
      <Box>
        {/* Hero Image */}
        <Box sx={{ 
          p: { xs: 0, sm: 2 },
          pt: { xs: 0, sm: 1.5 }
        }}>
          <Box
            sx={{
              width: '100%',
              backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDhjEn5LQ9KuTcHfvNlqEDRf4TTYYBhnA9pKH3VBmbPBtkkmTTygGR_vTrf_R1RE93TlAVq2EyXaXYjxN4HNN5MeThx5gr8CeCl3VKuPu3c4WctHCU4XK6zwlt1V6D1KbF0VARLbYZZ2PiprnDdh9w0dm9zZnz4I1lEm8R27KrqgHFDwYAgmWYN8xgGK7RgoCpyCgzmXG-7F5FqG4kErEB5trT59BFPxq5qWU35vf_adMijVKUYAvlJeG69m8ZdPyi-zKzK7Nf-zZy1")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundColor: '#102310',
              borderRadius: { xs: 0, sm: '12px' },
              minHeight: '320px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              overflow: 'hidden'
            }}
          />
        </Box>

        {/* Title */}
        <Typography 
          variant="h4"
          sx={{ 
            color: 'white',
            fontSize: '22px',
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: '-0.015em',
            px: 2,
            textAlign: 'center',
            pb: 1.5,
            pt: 2.5
          }}
        >
          Beerly
        </Typography>

        {/* Subtitle */}
        <Typography 
          variant="h5"
          sx={{ 
            color: 'white',
            fontSize: '24px',
            fontWeight: 700,
            lineHeight: 1.2,
            px: 2,
            textAlign: 'center',
            pb: 1,
            pt: 2.5
          }}
        >
          Discover, Rate, and Share Your Favorite Beers.
        </Typography>
      </Box>

      {/* Bottom Section with Buttons */}
      <Box>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center'
        }}>
          <Box sx={{ 
            display: 'flex', 
            flex: 1, 
            gap: 1.5, 
            maxWidth: '480px', 
            flexDirection: 'column', 
            alignItems: 'stretch', 
            px: 2, 
            py: 1.5
          }}>
            {/* Sign Up Button */}
            <Button
              component={Link}
              to="/register"
              sx={{
                minWidth: '84px',
                maxWidth: '480px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                borderRadius: '12px',
                height: '48px',
                px: 2.5,
                backgroundColor: '#3ef43e',
                color: '#102310',
                fontSize: '16px',
                fontWeight: 700,
                lineHeight: 'normal',
                letterSpacing: '0.015em',
                width: '100%',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#35d935'
                }
              }}
            >
              Sign Up
            </Button>

            {/* Log In Button */}
            <Button
              component={Link}
              to="/login"
              sx={{
                minWidth: '84px',
                maxWidth: '480px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                borderRadius: '12px',
                height: '48px',
                px: 2.5,
                backgroundColor: '#224922',
                color: 'white',
                fontSize: '16px',
                fontWeight: 700,
                lineHeight: 'normal',
                letterSpacing: '0.015em',
                width: '100%',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#2d5e2d'
                }
              }}
            >
              Log In
            </Button>
          </Box>
        </Box>

        {/* Bottom Spacer */}
        <Box sx={{ height: '20px', backgroundColor: '#102310' }} />
      </Box>
    </Box>
  );
}

export default WelcomePage;
