import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Box, 
  TextField, 
  Button, 
  Typography 
} from '@mui/material';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Hasła nie są identyczne');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Hasło musi mieć co najmniej 6 znaków');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Utworz profil użytkownika w Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: formData.email,
        createdAt: new Date(),
        reviewsCount: 0
      });

      navigate('/');
    } catch (error) {
      setError('Błąd podczas rejestracji: ' + error.message);
    }
    setLoading(false);
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
        {/* Title */}
        <Typography 
          variant="h2"
          sx={{ 
            color: 'white',
            fontSize: '28px',
            fontWeight: 700,
            lineHeight: 1.2,
            px: 2,
            textAlign: 'center',
            pb: 1.5,
            pt: 2.5
          }}
        >
          Join the Beer Community
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
              <Typography
                sx={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 500,
                  lineHeight: 'normal',
                  pb: 1
                }}
              >
                Email
              </Typography>
              <TextField
                name="email"
                placeholder="Enter your email"
                type="email"
                value={formData.email}
                onChange={handleChange}
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
              <Typography
                sx={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 500,
                  lineHeight: 'normal',
                  pb: 1
                }}
              >
                Password
              </Typography>
              <TextField
                name="password"
                placeholder="Enter your password"
                type="password"
                value={formData.password}
                onChange={handleChange}
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

          {/* Confirm Password Field */}
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
              <Typography
                sx={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 500,
                  lineHeight: 'normal',
                  pb: 1
                }}
              >
                Confirm Password
              </Typography>
              <TextField
                name="confirmPassword"
                placeholder="Confirm your password"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
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

          {/* Sign Up Button */}
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
              {loading ? 'Rejestracja...' : 'Sign Up'}
            </Button>
          </Box>

          {/* Login Link */}
          <Typography
            component={Link}
            to="/login"
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
            Already have an account? Log In
          </Typography>

          {/* Error Message */}
          {error && (
            <Typography
              sx={{
                color: '#ff4444',
                fontSize: '14px',
                fontWeight: 400,
                px: 2,
                textAlign: 'center',
                pb: 1
              }}
            >
              {error}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Bottom Section with Decorative Images */}
      <Box>
        {/* Dark theme image */}
        <Box
          sx={{
            width: '100%',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            aspectRatio: '390 / 320',
            borderRadius: 0,
            backgroundImage: 'url("/dark.svg")',
            display: { xs: 'block', md: 'none' } // Show only on mobile
          }}
        />
        
        {/* Light theme image (hidden in dark mode) */}
        <Box
          sx={{
            width: '100%',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            aspectRatio: '390 / 320',
            borderRadius: 0,
            backgroundImage: 'url("/light.svg")',
            display: 'none' // Hidden since we're in dark mode
          }}
        />
      </Box>
    </Box>
  );
}

export default Register;
