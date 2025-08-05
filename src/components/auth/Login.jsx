import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';

function Login({ setUser, setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      setIsLoggedIn(true);
      navigate('/');
    } catch (error) {
      setError('Nieprawidłowy email lub hasło');
    }
    setLoading(false);
  };

  const handleClose = () => {
    navigate('/');
  };

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
      {/* Top Section */}
      <Box>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          backgroundColor: '#102310', 
          p: 2, 
          pb: 1, 
          justifyContent: 'space-between'
        }}>
          <IconButton 
            onClick={handleClose}
            sx={{ 
              color: 'white', 
              width: 48, 
              height: 48,
              flexShrink: 0
            }}
          >
            <CloseIcon />
          </IconButton>
          
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'white',
              fontSize: '18px',
              fontWeight: 700,
              letterSpacing: '-0.015em',
              flex: 1,
              textAlign: 'center',
              pr: 6 // Space for close button
            }}
          >
            Beer App
          </Typography>
        </Box>

        {/* Welcome Title */}
        <Typography 
          variant="h4"
          sx={{ 
            color: 'white',
            fontSize: '22px',
            fontWeight: 700,
            letterSpacing: '-0.015em',
            px: 2,
            textAlign: 'center',
            pb: 1.5,
            pt: 2.5
          }}
        >
          Welcome Back
        </Typography>

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit}>
          {/* Email Field */}
          <Box sx={{ 
            display: 'flex', 
            maxWidth: '480px', 
            flexWrap: 'wrap', 
            alignItems: 'flex-end', 
            gap: 2, 
            px: 2, 
            py: 1.5
          }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              minWidth: '160px', 
              flex: 1
            }}>
              <TextField
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    width: '100%',
                    minWidth: 0,
                    flex: 1,
                    borderRadius: '12px',
                    height: '56px',
                    backgroundColor: '#183418',
                    border: '1px solid #316831',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 400,
                    lineHeight: 'normal',
                    '& fieldset': {
                      border: 'none'
                    },
                    '&:hover fieldset': {
                      border: 'none'
                    },
                    '&.Mui-focused fieldset': {
                      border: '1px solid #316831'
                    },
                    '& input': {
                      padding: '15px',
                      color: 'white',
                      '&::placeholder': {
                        color: '#90cb90ff',
                        opacity: 1
                      }
                    }
                  }
                }}
              />
            </Box>
          </Box>

          {/* Password Field */}
          <Box sx={{ 
            display: 'flex', 
            maxWidth: '480px', 
            flexWrap: 'wrap', 
            alignItems: 'flex-end', 
            gap: 2, 
            px: 2, 
            py: 1.5
          }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              minWidth: '160px', 
              flex: 1
            }}>
              <TextField
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    width: '100%',
                    minWidth: 0,
                    flex: 1,
                    borderRadius: '12px',
                    height: '56px',
                    backgroundColor: '#183418',
                    border: '1px solid #316831',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 400,
                    lineHeight: 'normal',
                    '& fieldset': {
                      border: 'none'
                    },
                    '&:hover fieldset': {
                      border: 'none'
                    },
                    '&.Mui-focused fieldset': {
                      border: '1px solid #316831'
                    },
                    '& input': {
                      padding: '15px',
                      color: 'white',
                      '&::placeholder': {
                        color: '#90cb90',
                        opacity: 1
                      }
                    }
                  }
                }}
              />
            </Box>
          </Box>

          {/* Forgot Password */}
          <Typography
            component={Link}
            to="/password-reset"
            sx={{
              color: '#90cb90',
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: 'normal',
              pb: 1.5,
              pt: 0.5,
              px: 2,
              textAlign: 'center',
              textDecoration: 'underline',
              display: 'block',
              '&:hover': {
                color: '#7bb87b'
              }
            }}
          >
            Forgot Password?
          </Typography>

          {/* Login Button */}
          <Box sx={{ display: 'flex', px: 2, py: 1.5 }}>
            <Button
              type="submit"
              disabled={loading}
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
                flex: 1,
                backgroundColor: '#3ef43e',
                color: '#102310',
                fontSize: '16px',
                fontWeight: 700,
                lineHeight: 'normal',
                letterSpacing: '0.015em',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#35d935'
                },
                '&:disabled': {
                  backgroundColor: '#2d5e2d',
                  color: '#90cb90'
                }
              }}
            >
              {loading ? 'Logowanie...' : 'Log In'}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Bottom Section */}
      <Box>
        <Typography
          component={Link}
          to="/register"
          sx={{
            color: '#90cb90',
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: 'normal',
            pb: 1.5,
            pt: 0.5,
            px: 2,
            textAlign: 'center',
            textDecoration: 'underline',
            display: 'block',
            '&:hover': {
              color: '#7bb87b'
            }
          }}
        >
          Don't have an account? Sign Up
        </Typography>
        
        {/* Bottom Spacer */}
        <Box sx={{ height: '20px', backgroundColor: '#102310' }} />
      </Box>
    </Box>
  );
}

export default Login;
