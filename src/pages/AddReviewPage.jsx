import React, { useState, useEffect } from 'react';
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
  Grid,
  Alert,
  CircularProgress,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  PhotoCamera as PhotoCameraIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

function AddReviewPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    beerName: '',
    brewery: '',
    style: '',
    tastingDate: '',
    // Aromat
    aromaIntensity: 3,
    aromaQuality: 3,
    aromaNotesText: '',
    // Wygląd  
    color: '',
    clarity: 3,
    foam: 3,
    // Smak
    tasteIntensity: 3,
    tasteBalance: 3,
    bitterness: 3,
    sweetness: 3,
    acidity: 3,
    tasteNotes: '',
    // Dodatkowe
    drinkability: 3,
    complexity: 3,
    overallRating: 5, // 1-10 skala
    // Meta
    comments: '',
    selectedIcon: null,
    photo: null
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('Musisz być zalogowany, aby dodać recenzję');
      return;
    }

    if (!formData.beerName.trim() || !formData.brewery.trim()) {
      setError('Nazwa piwa i browar są wymagane');
      return;
    }

    if (formData.overallRating === 0) {
      setError('Musisz wystawić ogólną ocenę');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const reviewData = {
        beerName: formData.beerName.trim(),
        brewery: formData.brewery.trim(),
        style: formData.style.trim() || 'Inne',
        tastingDate: formData.tastingDate || new Date().toISOString().split('T')[0],
        // Aromat
        aromaIntensity: formData.aromaIntensity,
        aromaQuality: formData.aromaQuality,
        aromaNotesText: formData.aromaNotesText.trim(),
        // Wygląd
        color: formData.color || 'Inne',
        clarity: formData.clarity,
        foam: formData.foam,
        // Smak
        tasteIntensity: formData.tasteIntensity,
        tasteBalance: formData.tasteBalance,
        bitterness: formData.bitterness,
        sweetness: formData.sweetness,
        acidity: formData.acidity,
        tasteNotes: formData.tasteNotes.trim(),
        // Dodatkowe
        drinkability: formData.drinkability,
        complexity: formData.complexity,
        overallRating: formData.overallRating,
        // Meta
        comments: formData.comments.trim(),
        selectedIcon: formData.selectedIcon,
        photoUrl: null, // TODO: Implement photo upload
        userId: user.uid,
        userEmail: user.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      console.log('Saving review to Firebase:', reviewData);
      
      const docRef = await addDoc(collection(db, 'reviews'), reviewData);
      console.log('Review saved with ID:', docRef.id);
      
      // Navigate back to my reviews page
      navigate('/my-reviews');
    } catch (error) {
      console.error('Error saving review:', error);
      setError('Błąd podczas zapisywania recenzji: ' + error.message);
    } finally {
      setLoading(false);
    }
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
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
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

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Styl piwa"
                name="style"
                value={formData.style}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Data degustacji"
                name="tastingDate"
                type="date"
                value={formData.tastingDate}
                onChange={handleChange}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Aromat Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2, color: 'primary.main' }}>
                Aromat
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Intensywność aromatu</Typography>
              <Slider
                name="aromaIntensity"
                value={formData.aromaIntensity}
                onChange={(_, value) => handleRatingChange('aromaIntensity', value)}
                step={1}
                marks
                min={1}
                max={5}
                valueLabelDisplay="auto"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Jakość aromatu</Typography>
              <Slider
                name="aromaQuality"
                value={formData.aromaQuality}
                onChange={(_, value) => handleRatingChange('aromaQuality', value)}
                step={1}
                marks
                min={1}
                max={5}
                valueLabelDisplay="auto"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nuty aromatyczne"
                name="aromaNotesText"
                value={formData.aromaNotesText}
                onChange={handleChange}
                margin="normal"
                placeholder="Np. owocowe, kwiatowe, chmielowe, słodowe..."
              />
            </Grid>

            {/* Wygląd Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2, color: 'primary.main' }}>
                Wygląd
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Kolor</InputLabel>
                <Select
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  label="Kolor"
                >
                  <MenuItem value="Jasne">Jasne</MenuItem>
                  <MenuItem value="Bursztynowe">Bursztynowe</MenuItem>
                  <MenuItem value="Ciemne">Ciemne</MenuItem>
                  <MenuItem value="Czarne">Czarne</MenuItem>
                  <MenuItem value="Inne">Inne</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" gutterBottom>Klarowność</Typography>
              <Slider
                name="clarity"
                value={formData.clarity}
                onChange={(_, value) => handleRatingChange('clarity', value)}
                step={1}
                marks
                min={1}
                max={5}
                valueLabelDisplay="auto"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" gutterBottom>Piana</Typography>
              <Slider
                name="foam"
                value={formData.foam}
                onChange={(_, value) => handleRatingChange('foam', value)}
                step={1}
                marks
                min={1}
                max={5}
                valueLabelDisplay="auto"
              />
            </Grid>

            {/* Smak Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2, color: 'primary.main' }}>
                Smak
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Intensywność smaku</Typography>
              <Slider
                name="tasteIntensity"
                value={formData.tasteIntensity}
                onChange={(_, value) => handleRatingChange('tasteIntensity', value)}
                step={1}
                marks
                min={1}
                max={5}
                valueLabelDisplay="auto"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Równowaga smaku</Typography>
              <Slider
                name="tasteBalance"
                value={formData.tasteBalance}
                onChange={(_, value) => handleRatingChange('tasteBalance', value)}
                step={1}
                marks
                min={1}
                max={5}
                valueLabelDisplay="auto"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" gutterBottom>Goryczka</Typography>
              <Slider
                name="bitterness"
                value={formData.bitterness}
                onChange={(_, value) => handleRatingChange('bitterness', value)}
                step={1}
                marks
                min={1}
                max={5}
                valueLabelDisplay="auto"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" gutterBottom>Słodycz</Typography>
              <Slider
                name="sweetness"
                value={formData.sweetness}
                onChange={(_, value) => handleRatingChange('sweetness', value)}
                step={1}
                marks
                min={1}
                max={5}
                valueLabelDisplay="auto"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" gutterBottom>Kwasowość</Typography>
              <Slider
                name="acidity"
                value={formData.acidity}
                onChange={(_, value) => handleRatingChange('acidity', value)}
                step={1}
                marks
                min={1}
                max={5}
                valueLabelDisplay="auto"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nuty smakowe"
                name="tasteNotes"
                value={formData.tasteNotes}
                onChange={handleChange}
                margin="normal"
                placeholder="Opisz smaki, które wyczuwasz..."
              />
            </Grid>

            {/* Dodatkowe właściwości */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2, color: 'primary.main' }}>
                Dodatkowe właściwości
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Pijalność</Typography>
              <Slider
                name="drinkability"
                value={formData.drinkability}
                onChange={(_, value) => handleRatingChange('drinkability', value)}
                step={1}
                marks
                min={1}
                max={5}
                valueLabelDisplay="auto"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Złożoność</Typography>
              <Slider
                name="complexity"
                value={formData.complexity}
                onChange={(_, value) => handleRatingChange('complexity', value)}
                step={1}
                marks
                min={1}
                max={5}
                valueLabelDisplay="auto"
              />
            </Grid>

            {/* Ogólna ocena - skala 1-10 */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2, color: 'secondary.main' }}>
                Ogólna ocena (1-10)
              </Typography>
              <Slider
                name="overallRating"
                value={formData.overallRating}
                onChange={(_, value) => handleRatingChange('overallRating', value)}
                step={1}
                marks
                min={1}
                max={10}
                valueLabelDisplay="auto"
                sx={{ mb: 2 }}
              />
            </Grid>

            {/* Ikony wyrażające emocje */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Wyrażenie emocji
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 2 }}>
                {[
                  { value: 'heart', icon: '❤️', label: 'Ulubione', color: 'red' },
                  { value: 'star', icon: '⭐', label: 'Specjalne', color: 'gold' },
                  { value: 'thumbUp', icon: '👍', label: 'Polecam', color: 'green' },
                  { value: 'thumbDown', icon: '👎', label: 'Nie polecam', color: 'gray' }
                ].map(({ value, icon, label, color }) => (
                  <Box key={value} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Tooltip title={label}>
                      <IconButton
                        onClick={() => handleRatingChange('selectedIcon', value)}
                        sx={{
                          color: formData.selectedIcon === value ? color : 'inherit',
                          backgroundColor: formData.selectedIcon === value ? 'rgba(0,0,0,0.1)' : 'transparent'
                        }}
                      >
                        {icon}
                      </IconButton>
                    </Tooltip>
                    <Typography variant="caption">{label}</Typography>
                  </Box>
                ))}
              </Box>
            </Grid>

            {/* Uwagi */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dodatkowe uwagi"
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                multiline
                rows={3}
                margin="normal"
                placeholder="Dodatkowe komentarze, kontekst degustacji..."
              />
            </Grid>

            {/* Photo Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Zdjęcie piwa
              </Typography>
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

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center" mt={2}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
                  disabled={loading}
                  sx={{ minWidth: 200 }}
                >
                  {loading ? 'Zapisywanie...' : 'Dodaj recenzję'}
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
