import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

function AddSimpleReviewPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    beerName: '',
    brewery: '',
    tastingDate: '',
    overallRating: 5,       // Added
    selectedIcon: null,     // Added
  });
  const [photoUrl, setPhotoUrl] = useState(null);

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

  // Added handleRatingChange function
  const handleRatingChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = 800;
          canvas.height = (img.height * 800) / img.width;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const base64String = canvas.toDataURL('image/jpeg');
          setPhotoUrl(base64String);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
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

    setLoading(true);
    setError('');

    try {
      const reviewData = {
        beerName: formData.beerName.trim(),
        brewery: formData.brewery.trim(),
        tastingDate: formData.tastingDate || new Date().toISOString().split('T')[0],
        photoUrl: photoUrl,
        overallRating: formData.overallRating,         // Added
        selectedIcon: formData.selectedIcon,         // Added
        userId: user.uid,
        userEmail: user.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        // Setting default values for the fields that are not in the simple form
        style: 'Inne',
        aromaIntensity: 3,
        aromaQuality: 3,
        aromaNotesText: '',
        color: 'Inne',
        clarity: 3,
        foam: 3,
        tasteIntensity: 3,
        tasteBalance: 3,
        bitterness: 3,
        sweetness: 3,
        acidity: 3,
        tasteNotes: '',
        drinkability: 3,
        complexity: 3,
        comments: '',
      };

      await addDoc(collection(db, 'reviews'), reviewData);
      
      navigate('/my-reviews');
    } catch (error) {
      setError('Błąd podczas zapisywania recenzji: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-[#102310] text-white font-sans">
      <div className="flex items-center bg-[#102310] p-4 pb-2 justify-between">
        <button onClick={() => navigate(-1)} className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
            <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
          </svg>
        </button>
        <h2 className="text-lg font-bold text-center flex-1">Dodaj szybką recenzję</h2>
      </div>

      {error && <div className="bg-red-500 text-white p-2 text-center">{error}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
        <input
          type="text"
          name="beerName"
          placeholder="Nazwa piwa"
          value={formData.beerName}
          onChange={handleChange}
          className="form-input w-full rounded-xl bg-[#224922] text-white p-4"
          required
        />
        <input
          type="text"
          name="brewery"
          placeholder="Browar"
          value={formData.brewery}
          onChange={handleChange}
          className="form-input w-full rounded-xl bg-[#224922] text-white p-4"
          required
        />
        <input
          type="date"
          name="tastingDate"
          value={formData.tastingDate}
          onChange={handleChange}
          className="form-input w-full rounded-xl bg-[#224922] text-white p-4"
        />

        {/* Added Overall Rating and Emotion sections */}
        <h3 className="text-lg font-bold">Ogólna ocena</h3>
        <input
          type="range"
          name="overallRating"
          min="1"
          max="10"
          value={formData.overallRating}
          onChange={(e) => handleRatingChange('overallRating', parseInt(e.target.value))}
          className="w-full"
        />

        <h3 className="text-lg font-bold">Wyrażenie emocji</h3>
        <div className="flex gap-4">
          {[{ value: 'heart', label: '❤️' }, { value: 'star', label: '⭐' }, { value: 'thumbUp', label: '👍' }, { value: 'thumbDown', label: '👎' }].map((icon) => (
            <button
              key={icon.value}
              type="button"
              onClick={() => handleRatingChange('selectedIcon', icon.value)}
              className={`p-2 rounded-full ${formData.selectedIcon === icon.value ? 'bg-green-500' : 'bg-gray-500'}`}
            >
              {icon.label}
            </button>
          ))}
        </div>

        <h3 className="text-lg font-bold">Zdjęcie piwa</h3>
        <div className="flex flex-col items-center gap-2">
          {photoUrl && (
            <div className="mb-4">
              <img src={photoUrl} alt="Wybrane zdjęcie" style={{ maxWidth: '250px', maxHeight: '250px' }} />
            </div>
          )}
          <label className="bg-[#3df43d] text-[#102310] p-3 rounded-xl font-bold cursor-pointer">
            Wybierz zdjęcie
            <input
              type="file"
              accept="image/*"
              onChange={handlePhoto}
              style={{ display: 'none' }}
            />
          </label>
        </div>

        <button
          type="submit"
          className="bg-[#3df43d] text-[#102310] p-4 rounded-xl font-bold"
          disabled={loading}
        >
          {loading ? 'Zapisywanie...' : 'Dodaj recenzję'}
        </button>
      </form>
    </div>
  );
}

export default AddSimpleReviewPage;
