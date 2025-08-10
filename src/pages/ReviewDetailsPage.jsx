import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { FaTrash } from 'react-icons/fa';

function ReviewDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        setLoading(true);
        const reviewRef = doc(db, 'reviews', id);
        const reviewSnap = await getDoc(reviewRef);
        
        if (reviewSnap.exists()) {
          const data = reviewSnap.data();
          setReview({
            id: reviewSnap.id,
            ...data,
            createdAt: data.createdAt?.toDate()
          });
        } else {
          setError('Recenzja nie została znaleziona');
        }
      } catch (err) {
        console.error('Error fetching review:', err);
        setError('Błąd podczas pobierania recenzji: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [id]);

  const renderIcon = () => {
    if (!review?.selectedIcon) return '🍺';
    
    switch (review.selectedIcon) {
      case 'heart':
        return '❤️';
      case 'star':
        return '⭐';
      case 'thumbUp':
        return '😊';
      case 'thumbDown':
        return '😞';
      default:
        return '🍺';
    }
  };

  const renderStars = (rating) => {
    const filledStars = Math.floor(rating / 2); // Convert 10-point to 5-star scale
    const hasHalfStar = (rating % 2) >= 1;
    const stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < filledStars) {
        stars.push(
          <div key={i} className="text-[#3ef43e]">
            <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"/>
            </svg>
          </div>
        );
      } else if (i === filledStars && hasHalfStar) {
        stars.push(
          <div key={i} className="text-[#3ef43e]">
            <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M239.2,97.29a16,16,0,0,0-13.81-11L166,81.17,142.72,25.81h0a15.95,15.95,0,0,0-29.44,0L90.07,81.17,30.61,86.32a16,16,0,0,0-9.11,28.06L66.61,153.8,53.09,212.34a16,16,0,0,0,23.84,17.34l51-31,51.11,31a16,16,0,0,0,23.84-17.34l-13.51-58.6,45.1-39.36A16,16,0,0,0,239.2,97.29Zm-15.22,5-45.1,39.36a16,16,0,0,0-5.08,15.71L187.35,216v0l-51.07-31a15.9,15.9,0,0,0-16.54,0l-51,31h0L82.2,157.4a16,16,0,0,0-5.08-15.71L32,102.35a.37.37,0,0,1,0-.09l59.44-5.14a16,16,0,0,0,13.35-9.75L128,32.08l23.2,55.29a16,16,0,0,0,13.35,9.75L224,102.26S224,102.32,224,102.33Z"/>
            </svg>
          </div>
        );
      } else {
        stars.push(
          <div key={i} className="text-[#3ef43e]">
            <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M239.2,97.29a16,16,0,0,0-13.81-11L166,81.17,142.72,25.81h0a15.95,15.95,0,0,0-29.44,0L90.07,81.17,30.61,86.32a16,16,0,0,0-9.11,28.06L66.61,153.8,53.09,212.34a16,16,0,0,0,23.84,17.34l51-31,51.11,31a16,16,0,0,0,23.84-17.34l-13.51-58.6,45.1-39.36A16,16,0,0,0,239.2,97.29Zm-15.22,5-45.1,39.36a16,16,0,0,0-5.08,15.71L187.35,216v0l-51.07-31a15.9,15.9,0,0,0-16.54,0l-51,31h0L82.2,157.4a16,16,0,0,0-5.08-15.71L32,102.35a.37.37,0,0,1,0-.09l59.44-5.14a16,16,0,0,0,13.35-9.75L128,32.08l23.2,55.29a16,16,0,0,0,13.35,9.75L224,102.26S224,102.32,224,102.33Z"/>
            </svg>
          </div>
        );
      }
    }
    
    return stars;
  };

  if (loading) {
    return (
      <div className="relative flex size-full min-h-screen flex-col bg-[#102310] justify-center items-center" style={{ fontFamily: '"Space Grotesk", "Noto Sans", sans-serif' }}>
        <div className="text-white text-xl">Ładowanie...</div>
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="relative flex size-full min-h-screen flex-col bg-[#102310] justify-center items-center" style={{ fontFamily: '"Space Grotesk", "Noto Sans", sans-serif' }}>
        <div className="text-white text-xl">{error || 'Recenzja nie została znaleziona'}</div>
        <button 
          onClick={() => navigate('/my-reviews')}
          className="mt-4 bg-[#3ef43e] text-black px-4 py-2 rounded-lg"
        >
          Powrót do recenzji
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#102310] justify-between" style={{ fontFamily: '"Space Grotesk", "Noto Sans", sans-serif' }}>
      <div>
        {/* Header */}
        <div className="flex items-center bg-[#102310] p-4 pb-2 justify-between">
          <div 
            className="text-white flex size-12 shrink-0 items-center cursor-pointer" 
            onClick={() => navigate(-1)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
            </svg>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => navigate(`/edit-review/${id}`)}
              className="text-white bg-[#3ef43e] px-4 py-2 rounded-lg"
            >
              Edytuj
            </button>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="text-white bg-red-600 px-3 py-2 rounded-lg flex items-center"
              title="Usuń recenzję"
              disabled={deleting}
            >
              <FaTrash />
            </button>
          </div>
        </div>

        {/* Beer Info */}
        <h1 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 text-left pb-3 pt-5">
          {review.beerName}
        </h1>
        <p className="text-[#90cb90] text-sm font-normal leading-normal pb-3 pt-1 px-4">
          Browar: {review.brewery}
        </p>
        <p className="text-[#90cb90] text-sm font-normal leading-normal pb-3 pt-1 px-4">
          Styl: {review.style}
        </p>
        <p className="text-[#90cb90] text-sm font-normal leading-normal pb-3 pt-1 px-4">
          Data degustacji: {review.tastingDate || 'N/A'}
        </p>

        {/* Photo Section */}
        {review.photoUrl && (
          <div className="px-4 py-3">
            <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-lg border border-[#3ef43e]">
              <img
                src={review.photoUrl}
                alt="Zdjęcie piwa"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

  {/* Usunięto prostą sekcję "Oceny" z powodu duplikacji i błędnego pola "taste" */}

        {/* Rating Section */}
        <div className="flex flex-wrap gap-x-8 gap-y-6 p-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{renderIcon()}</span>
              <p className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                {review.overallRating || 'N/A'}
              </p>
            </div>
            <div className="flex gap-0.5">
              {renderStars(review.overallRating || 0)}
            </div>
            <p className="text-white text-sm font-normal leading-normal">
              {review.createdAt ? review.createdAt.toLocaleDateString('pl-PL') : 'N/A'}
            </p>
          </div>
        </div>

        {/* Review Details */}
        <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          Szczegóły oceny
        </h2>

        <div className="p-4 grid grid-cols-2">
          {/* Aromat */}
          <div className="flex flex-col gap-1 border-t border-solid border-t-[#316831] py-4 pr-2">
            <p className="text-[#90cb90] text-sm font-normal leading-normal">Intensywność aromatu</p>
            <p className="text-white text-sm font-normal leading-normal">{review.aromaIntensity || 'N/A'}/5</p>
          </div>
          <div className="flex flex-col gap-1 border-t border-solid border-t-[#316831] py-4 pl-2">
            <p className="text-[#90cb90] text-sm font-normal leading-normal">Jakość aromatu</p>
            <p className="text-white text-sm font-normal leading-normal">{review.aromaQuality || 'N/A'}/5</p>
          </div>

          {/* Wygląd */}
          <div className="flex flex-col gap-1 border-t border-solid border-t-[#316831] py-4 pr-2">
            <p className="text-[#90cb90] text-sm font-normal leading-normal">Kolor</p>
            <p className="text-white text-sm font-normal leading-normal">{review.color || 'N/A'}</p>
          </div>
          <div className="flex flex-col gap-1 border-t border-solid border-t-[#316831] py-4 pl-2">
            <p className="text-[#90cb90] text-sm font-normal leading-normal">Klarowność</p>
            <p className="text-white text-sm font-normal leading-normal">{review.clarity || 'N/A'}/5</p>
          </div>
          <div className="flex flex-col gap-1 border-t border-solid border-t-[#316831] py-4 pr-2">
            <p className="text-[#90cb90] text-sm font-normal leading-normal">Piana</p>
            <p className="text-white text-sm font-normal leading-normal">{review.foam || 'N/A'}/5</p>
          </div>

          {/* Smak */}
          <div className="flex flex-col gap-1 border-t border-solid border-t-[#316831] py-4 pr-2">
            <p className="text-[#90cb90] text-sm font-normal leading-normal">Równowaga smaku</p>
            <p className="text-white text-sm font-normal leading-normal">{review.tasteBalance || 'N/A'}/5</p>
          </div>
          <div className="flex flex-col gap-1 border-t border-solid border-t-[#316831] py-4 pl-2">
            <p className="text-[#90cb90] text-sm font-normal leading-normal">Goryczka</p>
            <p className="text-white text-sm font-normal leading-normal">{review.bitterness || 'N/A'}/5</p>
          </div>
          <div className="flex flex-col gap-1 border-t border-solid border-t-[#316831] py-4 pr-2">
            <p className="text-[#90cb90] text-sm font-normal leading-normal">Intensywność smaku</p>
            <p className="text-white text-sm font-normal leading-normal">{review.tasteIntensity || 'N/A'}/5</p>
          </div>

          <div className="flex flex-col gap-1 border-t border-solid border-t-[#316831] py-4 pr-2">
            <p className="text-[#90cb90] text-sm font-normal leading-normal">Słodycz</p>
            <p className="text-white text-sm font-normal leading-normal">{review.sweetness || 'N/A'}/5</p>
          </div>
          <div className="flex flex-col gap-1 border-t border-solid border-t-[#316831] py-4 pl-2">
            <p className="text-[#90cb90] text-sm font-normal leading-normal">Pijalność</p>
            <p className="text-white text-sm font-normal leading-normal">{review.drinkability || 'N/A'}/5</p>
          </div>

          {/* Additional Details */}
          <div className="flex flex-col gap-1 border-t border-solid border-t-[#316831] py-4 pr-2">
            <p className="text-[#90cb90] text-sm font-normal leading-normal">Złożoność</p>
            <p className="text-white text-sm font-normal leading-normal">{review.complexity || 'N/A'}/5</p>
          </div>
          <div className="flex flex-col gap-1 border-t border-solid border-t-[#316831] py-4 pl-2">
            <p className="text-[#90cb90] text-sm font-normal leading-normal">Kwasowość</p>
            <p className="text-white text-sm font-normal leading-normal">{review.acidity || 'N/A'}/5</p>
          </div>
        </div>

        {/* Notes Sections */}
        {review.aromaNotesText && (
          <div className="px-4 pb-2">
            <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] pb-2">Nuty aromatyczne</h3>
            <p className="text-[#90cb90] text-sm font-normal leading-normal">{review.aromaNotesText}</p>
          </div>
        )}

        {review.tasteNotes && (
          <div className="px-4 pb-4">
            <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] pb-2">Nuty smakowe</h3>
            <p className="text-[#90cb90] text-sm font-normal leading-normal">{review.tasteNotes}</p>
          </div>
        )}

        {/* Comments */}
        {review.comments && (
          <div className="px-4 pb-4">
            <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] pb-2">
              Komentarz
            </h3>
            <p className="text-[#90cb90] text-sm font-normal leading-normal">
              {review.comments}
            </p>
          </div>
        )}
        {/* Dialog potwierdzenia usunięcia */}
        {showDeleteDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-[#224922] p-6 rounded-xl shadow-lg text-white max-w-sm w-full">
              <h3 className="text-lg font-bold mb-4">Czy na pewno chcesz usunąć tę recenzję?</h3>
              <div className="flex gap-4 justify-end">
                <button
                  className="bg-gray-500 px-4 py-2 rounded-lg"
                  onClick={() => setShowDeleteDialog(false)}
                  disabled={deleting}
                >Anuluj</button>
                <button
                  className="bg-red-600 px-4 py-2 rounded-lg"
                  onClick={async () => {
                    setDeleting(true);
                    try {
                      await deleteDoc(doc(db, 'reviews', id));
                      setShowDeleteDialog(false);
                      navigate('/my-reviews');
                    } catch (err) {
                      setError('Błąd podczas usuwania recenzji: ' + err.message);
                    } finally {
                      setDeleting(false);
                    }
                  }}
                  disabled={deleting}
                >Usuń</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewDetailsPage;
