import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';

function MyReviewsPage() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [sortBy, setSortBy] = useState('date');
  const [filterBy, setFilterBy] = useState('all');

  // Sample data for demonstration - replace with real Firebase data
  const sampleReviews = [
    {
      id: '1',
      beerName: 'Cosmic Dust',
      brewery: 'Stellar Brewing Co.',
      style: 'IPA',
      rating: 4.5,
      photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJsWVr6itYlNpYtxVvOLcz_9719UpHx1A4g-TBWTrd7lRvA3E1ru38KMXZTHLBPai1Q7yf1prGdNEmcm18xw0-wcouK9xqmD5x5yFGcjgLIk2jAQd236xCIedwMusw0JlIv6U_LFLvx7Rw5bIRr2N-1Rt4zytgryRZV2ADlEoGc3SBDhYp59-wAmmgWLK1FI53Ex3A2JiAvEVqcR__JBpZoPkqpMLmEmb3ifA3FI-jrSIMTMotFbbR8_EbW71C6wvNdXZG9HxS3Lzz',
      date: '2024-01-15'
    },
    {
      id: '2', 
      beerName: 'Midnight Brew',
      brewery: 'Lunar Craft Beers',
      style: 'Stout',
      rating: 4.2,
      photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEELs7FSxSZ2VH_a8X_skpoOGoqcylRhYLAk1_plpssaMzb5ytsLaFOHEO-bJ_VfITlal4aufcxlS3Z7dNyT5XTwiUJogr2EykubQws12GERdEwnpdNgiNfjMtqAyN8ryf-e9kC8Gh2mljm70rU0wItMflO7bwtcLh8Uoh70OT031HCPGpHVwRJVAoTwaw3nuPD2wetp1m9TXnEtHz_N0R0om_CZcsQTeHKx1M39DPSwLQHDi0tyADhrpig_D3zU3IzyIZFij0TPwd',
      date: '2024-01-10'
    },
    {
      id: '3',
      beerName: 'Amber Horizon', 
      brewery: 'Solaris Ales',
      style: 'Amber Ale',
      rating: 4.0,
      photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYo1HlEtLcqrOrM4rBYkRihnhLLFarOsiL_Mn2D23NWVs8vTNIPD7iog8ItrZdNkM19kwYVKtUsd2qw74UeKlme3Ie-x-ySebNQ-4v_gtkStonZJvV_fllctxjEXEHyexUIuznHzuC9Vx8zLh2IOfhjpuY9mM0-eqiZ9KMFRXSMTLQNp3znZ5gr26-yMqYLy0olJNhmX7Cs6zBg5S2MOQAz3GhwegS_fiJhUx7RexB4W6H6HdoygQAsVXZdTl_FVUNAZtYdFbZpMKN',
      date: '2024-01-08'
    },
    {
      id: '4',
      beerName: 'Nebula Nectar',
      brewery: 'Galaxy Brews', 
      style: 'Pale Ale',
      rating: 3.8,
      photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-hb0H1QMPNCo38i3bYhb8jIQhlH71u27oLGKqU1rK9Nf7gLKH12-VUpj0jZ6UCRU-XJOnf3Xpg_GrGYXJlH8RoQ8rJdyrMgEvy2TOvAZwPx_fTyO-q5iFBwg1X5fx3d36xhd2PKs_UGGOIoT6_3AcNbwsqlWpx_4m4qVPp6b9CEyAN4A1LeMTOcv3zc6CdUe7vEPwV_F8DDpJxmLz_Px0a3t0BsqmmVE6Pz7hAtbIiWqc84tIIMghpTfUPxIPEXZw-Qgac7cario8',
      date: '2024-01-05'
    }
  ];

  // Function to fetch reviews from Firebase
  const fetchReviews = async (userId) => {
    try {
      setLoading(true);
      setError('');
      
      const reviewsQuery = query(
        collection(db, 'reviews'),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(reviewsQuery);
      const fetchedReviews = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedReviews.push({
          id: doc.id,
          beerName: data.beerName || '',
          brewery: data.brewery || '',
          style: data.style || '',
          rating: data.overallRating || data.overall || data.rating || 0, // Use overallRating first
          photoUrl: data.photoUrl || null,
          date: data.createdAt ? data.createdAt.toDate().toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          // Complete review data
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
        });
      });
      
      setReviews(fetchedReviews);
      
      // If no reviews found, show a message but don't show sample data
      if (fetchedReviews.length === 0) {
        console.log('No reviews found for user:', userId);
      }
      
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Błąd podczas pobierania recenzji: ' + error.message);
      // If there's an error, show sample data as fallback
      setReviews(sampleReviews);
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

  const handleReviewClick = (reviewId) => {
    navigate(`/review/${reviewId}`);
  };

  const filteredAndSortedReviews = reviews
    .filter(review => {
      if (filterBy === 'all') return true;
      if (filterBy === 'favorites') return review.overallRating >= 7;
      if (filterBy === 'wishlist') return review.overallRating < 7;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.overallRating || 0) - (a.overallRating || 0);
        case 'name':
          return a.beerName.localeCompare(b.beerName);
        case 'date':
          return new Date(b.createdAt?.toDate() || b.date) - new Date(a.createdAt?.toDate() || a.date);
        case 'style':
          return a.style.localeCompare(b.style);
        default:
          return 0;
      }
    });

  if (loading) {
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
        
        {filteredAndSortedReviews.length === 0 && !loading && !error ? (
          <div className="p-4">
            <div className="bg-[#183418] border border-[#316831] rounded-lg p-6 text-center">
              <div className="text-[#90cb90] mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="48px" height="48px" fill="currentColor" viewBox="0 0 256 256" className="mx-auto">
                  <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
                </svg>
              </div>
              <h3 className="text-white text-lg font-bold mb-2">Brak recenzji</h3>
              <p className="text-[#90cb90] text-sm mb-4">
                Nie masz jeszcze żadnych recenzji piw. Dodaj swoją pierwszą recenzję!
              </p>
              <Link 
                to="/add-review"
                className="inline-flex items-center gap-2 bg-[#3ef43e] text-[#102310] px-4 py-2 rounded-lg font-medium hover:bg-[#90cb90] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
                </svg>
                Dodaj recenzję
              </Link>
            </div>
          </div>
        ) : (
          filteredAndSortedReviews.map((review) => (
            <div key={review.id} className="p-4">
              <div 
                className="flex items-stretch justify-between gap-4 rounded-xl cursor-pointer hover:bg-[#183418] transition-colors p-2 -m-2"
                onClick={() => handleReviewClick(review.id)}
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
          ))
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
