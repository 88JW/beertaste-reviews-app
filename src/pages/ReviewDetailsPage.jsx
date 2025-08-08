import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

function ReviewDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          <div className="flex w-12 items-center justify-end">
            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 bg-transparent text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0">
              <div className="text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M229.66,109.66l-48,48a8,8,0,0,1-11.32-11.32L204.69,112H165a88,88,0,0,0-85.23,66,8,8,0,0,1-15.5-4A103.94,103.94,0,0,1,165,96h39.71L170.34,61.66a8,8,0,0,1,11.32-11.32l48,48A8,8,0,0,1,229.66,109.66ZM192,208H40V88a8,8,0,0,0-16,0V208a16,16,0,0,0,16,16H192a8,8,0,0,0,0-16Z"></path>
                </svg>
              </div>
            </button>
          </div>
        </div>

        {/* Beer Photo */}
        <div className="@container">
          <div className="@[480px]:px-4 @[480px]:py-3">
            <div
              className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden bg-[#102310] @[480px]:rounded-xl min-h-80"
              style={{
                backgroundImage: review.photoUrl 
                  ? `url("${review.photoUrl}")` 
                  : `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='320' viewBox='0 0 400 320'%3E%3Crect width='400' height='320' fill='%23224922'/%3E%3Ctext x='200' y='170' text-anchor='middle' fill='%2390cb90' font-size='24' font-family='Arial'%3EBrak zdjęcia%3C/text%3E%3C/svg%3E")`
              }}
            ></div>
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
            <p className="text-white text-base font-normal leading-normal">
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
            <p className="text-white text-sm font-normal leading-normal">{review.aromaIntensity || 'N/A'}/10</p>
          </div>
          <div className="flex flex-col gap-1 border-t border-solid border-t-[#316831] py-4 pl-2">
            <p className="text-[#90cb90] text-sm font-normal leading-normal">Jakość aromatu</p>
            <p className="text-white text-sm font-normal leading-normal">{review.aromaQuality || 'N/A'}/10</p>
          </div>

          {/* Wygląd */}
          <div className="flex flex-col gap-1 border-t border-solid border-t-[#316831] py-4 pr-2">
            <p className="text-[#90cb90] text-sm font-normal leading-normal">Kolor</p>
            <p className="text-white text-sm font-normal leading-normal">{review.color || 'N/A'}</p>
          </div>
          <div className="flex flex-col gap-1 border-t border-solid border-t-[#316831] py-4 pl-2">
            <p className="text-[#90cb90] text-sm font-normal leading-normal">Klarowność</p>
            <p className="text-white text-sm font-normal leading-normal">{review.clarity || 'N/A'}/10</p>
          </div>

          {/* Smak */}
          <div className="flex flex-col gap-1 border-t border-solid border-t-[#316831] py-4 pr-2">
            <p className="text-[#90cb90] text-sm font-normal leading-normal">Równowaga smaku</p>
            <p className="text-white text-sm font-normal leading-normal">{review.tasteBalance || 'N/A'}/10</p>
          </div>
          <div className="flex flex-col gap-1 border-t border-solid border-t-[#316831] py-4 pl-2">
            <p className="text-[#90cb90] text-sm font-normal leading-normal">Goryczka</p>
            <p className="text-white text-sm font-normal leading-normal">{review.bitterness || 'N/A'}/10</p>
          </div>

          <div className="flex flex-col gap-1 border-t border-solid border-t-[#316831] py-4 pr-2">
            <p className="text-[#90cb90] text-sm font-normal leading-normal">Słodycz</p>
            <p className="text-white text-sm font-normal leading-normal">{review.sweetness || 'N/A'}/10</p>
          </div>
          <div className="flex flex-col gap-1 border-t border-solid border-t-[#316831] py-4 pl-2">
            <p className="text-[#90cb90] text-sm font-normal leading-normal">Pijalność</p>
            <p className="text-white text-sm font-normal leading-normal">{review.drinkability || 'N/A'}/10</p>
          </div>
        </div>

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

        {/* Notes */}
        {(review.aromaNotesText || review.tasteNotes) && (
          <div className="px-4 pb-4">
            <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] pb-2">
              Notatki
            </h3>
            {review.aromaNotesText && (
              <div className="mb-2">
                <p className="text-[#90cb90] text-xs font-normal leading-normal">Aromat:</p>
                <p className="text-white text-sm font-normal leading-normal">{review.aromaNotesText}</p>
              </div>
            )}
            {review.tasteNotes && (
              <div>
                <p className="text-[#90cb90] text-xs font-normal leading-normal">Smak:</p>
                <p className="text-white text-sm font-normal leading-normal">{review.tasteNotes}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div>
        <div className="flex gap-2 border-t border-[#224922] bg-[#183418] px-4 pb-3 pt-2">
          <a 
            className="just flex flex-1 flex-col items-center justify-end gap-1 rounded-full text-white cursor-pointer" 
            onClick={() => navigate('/menu')}
          >
            <div className="text-white flex h-8 items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z"></path>
              </svg>
            </div>
          </a>
          <a 
            className="just flex flex-1 flex-col items-center justify-end gap-1 text-[#90cb90] cursor-pointer" 
            onClick={() => navigate('/my-reviews')}
          >
            <div className="text-[#90cb90] flex h-8 items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
              </svg>
            </div>
          </a>
          <a 
            className="just flex flex-1 flex-col items-center justify-end gap-1 text-[#90cb90] cursor-pointer" 
            onClick={() => navigate('/add-review')}
          >
            <div className="text-[#90cb90] flex h-8 items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,176H48V48H208V208Zm-32-80a8,8,0,0,1-8,8H136v32a8,8,0,0,1-16,0V136H88a8,8,0,0,1,0-16h32V88a8,8,0,0,1,16,0v32h32A8,8,0,0,1,176,128Z"></path>
              </svg>
            </div>
          </a>
          <a 
            className="just flex flex-1 flex-col items-center justify-end gap-1 text-[#90cb90] cursor-pointer" 
            onClick={() => navigate('/profile')}
          >
            <div className="text-[#90cb90] flex h-8 items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
              </svg>
            </div>
          </a>
        </div>
        <div className="h-5 bg-[#183418]"></div>
      </div>
    </div>
  );
}

export default ReviewDetailsPage;
