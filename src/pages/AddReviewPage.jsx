import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    aromaIntensity: 3,
    aromaQuality: 3,
    aromaNotesText: '',
    color: '',
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
    overallRating: 5,
    comments: '',
    selectedIcon: null,
    photo: null
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

  const handleRatingChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handlePhoto = (e) => {
    // Get the selected file from the input
    const file = e.target.files[0];
    // Check if a file was selected
    if (file) {
      // Create a FileReader to read the file's content
      const reader = new FileReader();
      // Define what happens when the file is successfully loaded
      reader.onload = () => {
        // Create a new Image object
        const img = new Image();
        // Define what happens when the image is loaded
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = 800;
          canvas.height = (img.height * 800) / img.width;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const base64String = canvas.toDataURL('image/jpeg');
          setPhotoUrl(base64String); // Update the photoUrl state with the base64 string
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file); // Start reading the file as a data URL
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
        style: formData.style || 'Inne',
        tastingDate: formData.tastingDate || new Date().toISOString().split('T')[0],
        aromaIntensity: formData.aromaIntensity,
        aromaQuality: formData.aromaQuality,
        aromaNotesText: formData.aromaNotesText.trim(),
        color: formData.color || 'Inne',
        clarity: formData.clarity,
        foam: formData.foam,
        tasteIntensity: formData.tasteIntensity,
        tasteBalance: formData.tasteBalance,
        bitterness: formData.bitterness,
        sweetness: formData.sweetness,
        acidity: formData.acidity,
        tasteNotes: formData.tasteNotes.trim(),
        drinkability: formData.drinkability,
        complexity: formData.complexity,
        overallRating: formData.overallRating,
        comments: formData.comments.trim(),
        selectedIcon: formData.selectedIcon,
        photoUrl: photoUrl,
        userId: user.uid,
        userEmail: user.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'reviews'), reviewData);
      
      // Reset form after successful submission
      setFormData({
        beerName: '',
        brewery: '',
        style: '',
        tastingDate: '',
        aromaIntensity: 3,
        aromaQuality: 3,
        aromaNotesText: '',
        color: '',
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
        overallRating: 5,
        comments: '',
        selectedIcon: null,
        photo: null
      });
      setPhotoUrl(null);
      
      navigate('/my-reviews');
    } catch (error) {
      setError('Błąd podczas zapisywania recenzji: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const beerStyles = [
    'IPA',
    'Pale Ale',
    'Lager',
    'Stout',
    'Porter',
    'Wheat Beer',
    'Pilsner',
    'Saison',
    'Amber Ale',
    'Barleywine',
    'Blonde Ale',
    'Brown Ale',
    'Double IPA',
    'Hefeweizen',
    'Kolsch',
    'Tripel',
    'Dubbel',
    'Gose',
    'Bock',
    'Schwarzbier'
  ];

  const beerColors = [
    'Jasne',
    'Bursztynowe',
    'Ciemne',
    'Czarne',
    'Złote',
    'Miedziane',
    'Rubinowe',
    'Brązowe',
    'Słomkowe',
    'Białe',
    'Pomarańczowe',
    'Czerwone',
    'Kasztanowe',
    'Mahoniowe',
    'Kremowe'
  ];

  return (
    <div className="relative flex flex-col min-h-screen bg-[#102310] text-white font-sans">
      <div className="flex items-center bg-[#102310] p-4 pb-2 justify-between">
        <button onClick={() => navigate(-1)} className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
            <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
          </svg>
        </button>
        <h2 className="text-lg font-bold text-center flex-1">Dodaj nową recenzję</h2>
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
        <select
          name="style"
          value={formData.style}
          onChange={handleChange}
          className="form-input w-full rounded-xl bg-[#224922] text-white p-4"
        >
          <option value="">Wybierz styl piwa</option>
          {beerStyles.map((style) => (
            <option key={style} value={style}>
              {style}
            </option>
          ))}
        </select>
        <input
          type="date"
          name="tastingDate"
          value={formData.tastingDate}
          onChange={handleChange}
          className="form-input w-full rounded-xl bg-[#224922] text-white p-4"
        />

        <h3 className="text-lg font-bold">Wygląd</h3>
        <div className="flex flex-col gap-2">
          <label>Klarowność</label>
          <input
            type="range"
            name="clarity"
            min="1"
            max="5"
            value={formData.clarity}
            onChange={(e) => handleRatingChange('clarity', parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label>Piana</label>
          <input
            type="range"
            name="foam"
            min="1"
            max="5"
            value={formData.foam}
            onChange={(e) => handleRatingChange('foam', parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        <select
          name="color"
          value={formData.color}
          onChange={handleChange}
          className="form-input w-full rounded-xl bg-[#224922] text-white p-4"
        >
          <option value="">Wybierz kolor piwa</option>
          {beerColors.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>

        <h3 className="text-lg font-bold">Aromat</h3>
        <div className="flex flex-col gap-2">
          <label>Intensywność aromatu</label>
          <input
            type="range"
            name="aromaIntensity"
            min="1"
            max="5"
            value={formData.aromaIntensity}
            onChange={(e) => handleRatingChange('aromaIntensity', parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label>Jakość aromatu</label>
          <input
            type="range"
            name="aromaQuality"
            min="1"
            max="5"
            value={formData.aromaQuality}
            onChange={(e) => handleRatingChange('aromaQuality', parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        <textarea
          name="aromaNotesText"
          placeholder="Nuty aromatyczne"
          value={formData.aromaNotesText}
          onChange={handleChange}
          className="form-input w-full rounded-xl bg-[#224922] text-white p-4"
        ></textarea>

        <h3 className="text-lg font-bold">Smak</h3>
        <div className="flex flex-col gap-2">
          <label>Intensywność smaku</label>
          <input
            type="range"
            name="tasteIntensity"
            min="1"
            max="5"
            value={formData.tasteIntensity}
            onChange={(e) => handleRatingChange('tasteIntensity', parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label>Równowaga smaku</label>
          <input
            type="range"
            name="tasteBalance"
            min="1"
            max="5"
            value={formData.tasteBalance}
            onChange={(e) => handleRatingChange('tasteBalance', parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label>Goryczka</label>
          <input
            type="range"
            name="bitterness"
            min="1"
            max="5"
            value={formData.bitterness}
            onChange={(e) => handleRatingChange('bitterness', parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label>Słodycz</label>
          <input
            type="range"
            name="sweetness"
            min="1"
            max="5"
            value={formData.sweetness}
            onChange={(e) => handleRatingChange('sweetness', parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label>Kwasowość</label>
          <input
            type="range"
            name="acidity"
            min="1"
            max="5"
            value={formData.acidity}
            onChange={(e) => handleRatingChange('acidity', parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        <textarea
          name="tasteNotes"
          placeholder="Nuty smakowe"
          value={formData.tasteNotes}
          onChange={handleChange}
          className="form-input w-full rounded-xl bg-[#224922] text-white p-4"
        ></textarea>

        <h3 className="text-lg font-bold">Dodatkowe właściwości</h3>
        <div className="flex flex-col gap-2">
          <label>Pijalność</label>
          <input
            type="range"
            name="drinkability"
            min="1"
            max="5"
            value={formData.drinkability}
            onChange={(e) => handleRatingChange('drinkability', parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label>Złożoność</label>
          <input
            type="range"
            name="complexity"
            min="1"
            max="5"
            value={formData.complexity}
            onChange={(e) => handleRatingChange('complexity', parseInt(e.target.value))}
            className="w-full"
          />
        </div>

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

        <textarea
          name="comments"
          placeholder="Dodatkowe uwagi"
          value={formData.comments}
          onChange={handleChange}
          className="form-input w-full rounded-xl bg-[#224922] text-white p-4"
        ></textarea>

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

export default AddReviewPage;
