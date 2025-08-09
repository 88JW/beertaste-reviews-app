import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

// Listy zgodne z AddReviewPage.jsx
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

function EditReviewPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
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
    photoUrl: null,
    // lokalne pole tylko do podglądu nowego zdjęcia
    photo: null
  });

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const ref = doc(db, 'reviews', id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          // scal z domyślnymi wartościami, by wszystkie kontrolki miały stan
          setFormData((prev) => ({ ...prev, ...data }));
        } else {
          setError('Recenzja nie została znaleziona.');
        }
      } catch (err) {
        setError('Błąd podczas pobierania recenzji: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReview();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRatingChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.beerName.trim() || !formData.brewery.trim()) {
      setError('Nazwa piwa i browar są wymagane');
      return;
    }
    if (!formData.overallRating || formData.overallRating === 0) {
      setError('Musisz wystawić ogólną ocenę');
      return;
    }

    setError('');

    try {
      const ref = doc(db, 'reviews', id);
      // budujemy payload bez lokalnego pola photo (plik)
      const updateData = {
        beerName: formData.beerName.trim(),
        brewery: formData.brewery.trim(),
        style: formData.style || 'Inne',
        tastingDate: formData.tastingDate || formData.tastingDate,
        aromaIntensity: formData.aromaIntensity,
        aromaQuality: formData.aromaQuality,
        aromaNotesText: (formData.aromaNotesText || '').trim(),
        color: formData.color || 'Inne',
        clarity: formData.clarity,
        foam: formData.foam,
        tasteIntensity: formData.tasteIntensity,
        tasteBalance: formData.tasteBalance,
        bitterness: formData.bitterness,
        sweetness: formData.sweetness,
        acidity: formData.acidity,
        tasteNotes: (formData.tasteNotes || '').trim(),
        drinkability: formData.drinkability,
        complexity: formData.complexity,
        overallRating: formData.overallRating,
        comments: (formData.comments || '').trim(),
        selectedIcon: formData.selectedIcon || null,
        // photoUrl bez zmian; upload pliku nieobsługiwany w tym formularzu
        photoUrl: formData.photoUrl || null,
        updatedAt: serverTimestamp()
      };

      await updateDoc(ref, updateData);
      navigate('/my-reviews');
    } catch (err) {
      setError('Błąd podczas aktualizacji recenzji: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="relative flex size-full min-h-screen flex-col bg-[#102310] justify-center items-center" style={{ fontFamily: '"Space Grotesk", "Noto Sans", sans-serif' }}>
        <div className="text-white text-xl">Ładowanie...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative flex size-full min-h-screen flex-col bg-[#102310] justify-center items-center" style={{ fontFamily: '"Space Grotesk", "Noto Sans", sans-serif' }}>
        <div className="text-white text-xl text-center px-4">{error}</div>
        <button onClick={() => navigate(-1)} className="mt-4 bg-[#3ef43e] text-black px-4 py-2 rounded-lg">Powrót</button>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-[#102310] text-white font-sans">
      <div className="flex items-center bg-[#102310] p-4 pb-2 justify-between">
        <button onClick={() => navigate(-1)} className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
            <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
          </svg>
        </button>
        <h2 className="text-lg font-bold text-center flex-1">Edytuj recenzję</h2>
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
            <option key={style} value={style}>{style}</option>
          ))}
        </select>
        <input
          type="date"
          name="tastingDate"
          value={formData.tastingDate || ''}
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
            <option key={color} value={color}>{color}</option>
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
        {/* podgląd istniejącego zdjęcia (jeśli jest) */}
        {formData.photoUrl && (
          <div className="relative w-full h-48 overflow-hidden rounded-lg border border-[#3ef43e]">
            <img src={formData.photoUrl} alt="Zdjęcie piwa" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex flex-col items-center gap-2">
          <input
            type="file"
            name="photo"
            onChange={(e) => handleRatingChange('photo', e.target.files[0])}
            className="form-input w-full rounded-xl bg-[#224922] text-white p-4"
          />
        </div>

        <button
          type="submit"
          className="bg-[#3df43d] text-[#102310] p-4 rounded-xl font-bold"
        >
          Zapisz zmiany
        </button>
      </form>
    </div>
  );
}

export default EditReviewPage;
