import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, limit, startAfter } from 'firebase/firestore';
import { auth, db } from '../firebase';

function MyReviewsPage() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [lastVisible, setLastVisible] = useState(null);

  const fetchReviews = async (userId, loadMore = false) => {
    try {
      setLoading(true);
      setError('');

      // Pobierz wszystkie recenzje użytkownika (bez limit, aby znaleźć najnowsze)
      const reviewsQuery = query(
        collection(db, 'reviews'),
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(reviewsQuery);
      const allUserReviews = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const review = {
          id: doc.id,
          beerName: data.beerName || '',
          brewery: data.brewery || '',
          style: data.style || '',
          rating: data.overallRating || data.overall || data.rating || 0,
          photoUrl: data.photoUrl || null,
          date: data.createdAt ? data.createdAt.toDate().toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          // Przywróć wszystkie dane recenzji
          tastingDate: data.tastingDate || '',
          aromaIntensity: data.aromaIntensity || 0,
          aromaQuality: data.aromaQuality || 0,
          aromaNotesText: data.aromaNotesText || '',
          color: data.color || '',
          clarity: data.clarity || 0,
          foam: data.foam || 0,
          tasteIntensity: data.tasteIntensity || 0,
          tasteBalance: data.tasteBalance || 0,
          bitterness: data.bitterness || 0,
          sweetness: data.sweetness || 0,
          acidity: data.acidity || 0,
          tasteNotes: data.tasteNotes || '',
          drinkability: data.drinkability || 0,
          complexity: data.complexity || 0,
          overallRating: data.overallRating || 0,
          comments: data.comments || '',
          selectedIcon: data.selectedIcon || null,
          userId: data.userId,
          createdAt: data.createdAt
        };
        
        allUserReviews.push(review);
      });

      // Sortuj wszystkie recenzje po dacie utworzenia (najnowsze pierwsze)
      allUserReviews.sort((a, b) => {
        // Jeśli jedno nie ma daty, umieść je na końcu
        if (!a.createdAt && !b.createdAt) return 0;
        if (!a.createdAt) return 1; // a na końcu
        if (!b.createdAt) return -1; // b na końcu
        
        // Oba mają datę - sortuj od najnowszych do najstarszych
        return b.createdAt.toDate() - a.createdAt.toDate();
      });

      if (loadMore) {
        // Implementacja Load More - pobierz kolejne 10 recenzji
        const currentLength = reviews.length;
        const nextBatch = allUserReviews.slice(currentLength, currentLength + 10);
        setReviews((prevReviews) => [...prevReviews, ...nextBatch]);
        
        // Sprawdź czy są jeszcze recenzje do załadowania
        if (currentLength + 10 >= allUserReviews.length) {
          setHasMore(false);
        }
      } else {
        // Pierwszego ładowania - pobierz pierwsze 10 recenzji
        const firstBatch = allUserReviews.slice(0, 10);
        setReviews(firstBatch);
        
        // Sprawdź czy są jeszcze recenzje do załadowania
        setHasMore(allUserReviews.length > 10);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Błąd podczas pobierania recenzji: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchReviews(currentUser.uid);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLoadMore = () => {
    if (user) {
      fetchReviews(user.uid, true);
    }
  };

  const filteredAndSortedReviews = reviews
    .filter(review => {
      if (filterBy === 'all') return true;
      if (filterBy === 'favorites') return review.overallRating >= 7;
      if (filterBy === 'wishlist') return review.overallRating < 7;
      return true;
    })
    .sort((a, b) => {
      // Tylko sortuj jeśli sortBy nie jest 'date', ponieważ recenzje już są posortowane po dacie
      if (sortBy === 'date') {
        // Zachowaj istniejące sortowanie po dacie z Firebase
        return 0;
      }
      
      switch (sortBy) {
        case 'rating':
          return (b.overallRating || 0) - (a.overallRating || 0);
        case 'name':
          return a.beerName.localeCompare(b.beerName);
        case 'style':
          return a.style.localeCompare(b.style);
        default:
          return 0;
      }
    });

  if (loading && reviews.length === 0) {
    return (
      <div className="relative flex size-full min-h-screen flex-col bg-[#102310] justify-center items-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-[#102310] dark justify-between group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Space Grotesk", "Noto Sans", sans-serif' }}
    >
      <div>
        {/* Header */}
        <div className="flex items-center bg-[#102310] p-4 pb-2 justify-between">
          <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pl-12">
            Brewery
          </h2>
          <div className="flex w-12 items-center justify-end">
            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 bg-transparent text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0">
              <div className="text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                </svg>
              </div>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 p-3 overflow-x-hidden">
          <button
            onClick={() => setFilterBy('all')}
            className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl pl-4 pr-4 ${
              filterBy === 'all' ? 'bg-[#3ef43e] text-[#102310]' : 'bg-[#224922] text-white'
            }`}
          >
            <p className="text-sm font-medium leading-normal">All</p>
          </button>
          <button
            onClick={() => setFilterBy('favorites')}
            className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl pl-4 pr-4 ${
              filterBy === 'favorites' ? 'bg-[#3ef43e] text-[#102310]' : 'bg-[#224922] text-white'
            }`}
          >
            <p className="text-sm font-medium leading-normal">Favorites</p>
          </button>
          <button
            onClick={() => setFilterBy('wishlist')}
            className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl pl-4 pr-4 ${
              filterBy === 'wishlist' ? 'bg-[#3ef43e] text-[#102310]' : 'bg-[#224922] text-white'
            }`}
          >
            <p className="text-sm font-medium leading-normal">Wishlist</p>
          </button>
        </div>

        {/* Sort Section */}
        <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Sort by</h3>
        <div className="flex gap-3 p-3 flex-wrap pr-4">
          <button
            onClick={() => setSortBy('rating')}
            className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl pl-4 pr-4 ${
              sortBy === 'rating' ? 'bg-[#3ef43e] text-[#102310]' : 'bg-[#224922] text-white'
            }`}
          >
            <p className="text-sm font-medium leading-normal">Rating</p>
          </button>
          <button
            onClick={() => setSortBy('name')}
            className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl pl-4 pr-4 ${
              sortBy === 'name' ? 'bg-[#3ef43e] text-[#102310]' : 'bg-[#224922] text-white'
            }`}
          >
            <p className="text-sm font-medium leading-normal">Name</p>
          </button>
          <button
            onClick={() => setSortBy('date')}
            className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl pl-4 pr-4 ${
              sortBy === 'date' ? 'bg-[#3ef43e] text-[#102310]' : 'bg-[#224922] text-white'
            }`}
          >
            <p className="text-sm font-medium leading-normal">Date</p>
          </button>
          <button
            onClick={() => setSortBy('style')}
            className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl pl-4 pr-4 ${
              sortBy === 'style' ? 'bg-[#3ef43e] text-[#102310]' : 'bg-[#224922] text-white'
            }`}
          >
            <p className="text-sm font-medium leading-normal">Style</p>
          </button>
        </div>

        {/* Reviews List */}
        {error && (
          <div className="p-4">
            <div className="bg-red-900/50 border border-red-700 rounded-lg p-4">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          </div>
        )}
        
        {filteredAndSortedReviews.map((review) => (
          <div key={review.id} className="p-4">
            <div 
              className="flex items-stretch justify-between gap-4 rounded-xl cursor-pointer hover:bg-[#183418] transition-colors p-2 -m-2"
              onClick={() => navigate(`/review/${review.id}`)}
            >
              <div className="flex flex-col gap-2 flex-[2_2_0px]">
                <div className="flex items-center gap-2">
                  <span className="text-2xl" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    {review.selectedIcon === 'heart' ? '❤️' : 
                     review.selectedIcon === 'star' ? '⭐' : 
                     review.selectedIcon === 'thumbUp' ? '😊' : 
                     review.selectedIcon === 'thumbDown' ? '😞' : '🍺'}
                  </span>
                  <span className="text-[#90cb90] text-lg font-bold">{review.overallRating ? `${review.overallRating}/10` : 'N/A'}</span>
                </div>
                <p className="text-white text-base font-bold leading-tight">{review.beerName}</p>
                <p className="text-[#90cb90] text-sm font-normal leading-normal">
                  {review.brewery} · {review.style}
                </p>
                <div className="flex items-center gap-2 text-xs text-[#90cb90]">
                  <span>Smak: {review.tasteBalance ? `${Math.round(review.tasteBalance / 2)}/5` : 'N/A'}</span>
                  <span>•</span>
                  <span>Aromat: {review.aromaIntensity ? `${Math.round(review.aromaIntensity / 2)}/5` : 'N/A'}</span>
                </div>
              </div>
              <div
                className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl flex-1"
                style={{ 
                  backgroundImage: review.photoUrl ? `url("${review.photoUrl}")` : `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23224922'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='%2390cb90' font-size='12' font-family='Arial'%3EBrak zdjęcia%3C/text%3E%3C/svg%3E")`
                }}
              ></div>
            </div>
          </div>
        ))}

        {hasMore && (
          <div className="p-4 text-center">
            <button
              onClick={handleLoadMore}
              className="bg-[#3ef43e] text-[#102310] px-4 py-2 rounded-lg font-medium hover:bg-[#90cb90] transition-colors"
            >
              Load More
            </button>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div>
        <div className="flex gap-2 border-t border-[#224922] bg-[#183418] px-4 pb-3 pt-2">
          <Link to="/" className="flex flex-1 flex-col items-center justify-end gap-1 text-[#90cb90]">
            <div className="text-[#90cb90] flex h-8 items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z" />
              </svg>
            </div>
            <p className="text-[#90cb90] text-xs font-medium leading-normal tracking-[0.015em]">Home</p>
          </Link>
          <Link to="/my-reviews" className="flex flex-1 flex-col items-center justify-end gap-1 text-white">
            <div className="text-white flex h-8 items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
              </svg>
            </div>
            <p className="text-white text-xs font-medium leading-normal tracking-[0.015em]">Search</p>
          </Link>
          <Link to="/add-review" className="flex flex-1 flex-col items-center justify-end gap-1 text-[#90cb90]">
            <div className="text-[#90cb90] flex h-8 items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
              </svg>
            </div>
            <p className="text-[#90cb90] text-xs font-medium leading-normal tracking-[0.015em]">Add</p>
          </Link>
          <Link to="/profile" className="flex flex-1 flex-col items-center justify-end gap-1 text-[#90cb90]">
            <div className="text-[#90cb90] flex h-8 items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z" />
              </svg>
            </div>
            <p className="text-[#90cb90] text-xs font-medium leading-normal tracking-[0.015em]">Profile</p>
          </Link>
        </div>
        <div className="h-5 bg-[#183418]"></div>
      </div>
    </div>
  );
}

export default MyReviewsPage;
