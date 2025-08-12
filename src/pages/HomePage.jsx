import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';

function HomePage({ user, handleLogout }) {
  const navigate = useNavigate();
  const [latestReview, setLatestReview] = useState(null);
  const [loadingReview, setLoadingReview] = useState(true);

  // Pobierz najnowszą recenzję użytkownika
  useEffect(() => {
    const fetchLatestReview = async () => {
      if (!user) return;
      
      try {
        setLoadingReview(true);
        
        // Pobierz wszystkie recenzje użytkownika i posortuj po dacie
        const reviewsQuery = query(
          collection(db, 'reviews'),
          where('userId', '==', user.uid)
        );

        const querySnapshot = await getDocs(reviewsQuery);
        const userReviews = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          userReviews.push({
            id: doc.id,
            beerName: data.beerName || '',
            brewery: data.brewery || '',
            style: data.style || '',
            rating: data.overallRating || data.overall || data.rating || 0,
            photoUrl: data.photoUrl || null,
            date: data.createdAt ? data.createdAt.toDate().toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            selectedIcon: data.selectedIcon || null,
            createdAt: data.createdAt
          });
        });

        // Sortuj po dacie (najnowsze pierwsze)
        userReviews.sort((a, b) => {
          if (!a.createdAt && !b.createdAt) return 0;
          if (!a.createdAt) return 1;
          if (!b.createdAt) return -1;
          return b.createdAt.toDate() - a.createdAt.toDate();
        });

        // Ustaw najnowszą recenzję
        if (userReviews.length > 0) {
          setLatestReview(userReviews[0]);
        }
      } catch (error) {
        console.error('Error fetching latest review:', error);
      } finally {
        setLoadingReview(false);
      }
    };

    fetchLatestReview();
  }, [user]);

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-[#102310] dark justify-between group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Space Grotesk", "Noto Sans", sans-serif' }}
    >
      {/* Header Section */}
      <div>
        <div className="flex items-center bg-[#102310] p-4 pb-2 justify-between">
          <div className="text-white flex size-12 shrink-0 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" />
            </svg>
          </div>
          <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Menu</h2>
        </div>

        {/* Latest Review Section */}
        <div className="px-4 py-3">
          <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] pb-3">
            Ostatnia recenzja
          </h3>
          
          {loadingReview ? (
            <div className="flex items-center justify-center p-8 rounded-lg border border-[#316831] bg-[#183418]">
              <div className="text-[#90cb90] text-sm">Ładowanie...</div>
            </div>
          ) : latestReview ? (
            <div
              className="flex items-stretch justify-between gap-4 rounded-lg border border-[#316831] bg-[#183418] p-4 cursor-pointer hover:bg-[#1e4a1e] transition-colors"
              onClick={() => navigate(`/review/${latestReview.id}`)}
            >
              <div className="flex flex-col gap-2 flex-[2_2_0px]">
                <div className="flex items-center gap-2">
                  <span className="text-xl" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    {latestReview.selectedIcon === 'heart' ? '❤️' : 
                     latestReview.selectedIcon === 'star' ? '⭐' : 
                     latestReview.selectedIcon === 'thumbUp' ? '😊' : 
                     latestReview.selectedIcon === 'thumbDown' ? '😞' : '🍺'}
                  </span>
                  <span className="text-[#90cb90] text-base font-bold">
                    {latestReview.rating ? `${latestReview.rating}/10` : 'N/A'}
                  </span>
                </div>
                <p className="text-white text-base font-bold leading-tight">{latestReview.beerName}</p>
                <p className="text-[#90cb90] text-sm font-normal leading-normal">
                  {latestReview.brewery} · {latestReview.style}
                </p>
                <p className="text-[#90cb90] text-xs opacity-75">
                  Dodano: {latestReview.date}
                </p>
              </div>
              <div
                className="w-16 h-16 bg-center bg-no-repeat bg-cover rounded-lg shrink-0"
                style={{ 
                  backgroundImage: latestReview.photoUrl ? 
                    `url("${latestReview.photoUrl}")` : 
                    `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23224922'/%3E%3Ctext x='32' y='38' text-anchor='middle' fill='%2390cb90' font-size='8' font-family='Arial'%3E🍺%3C/text%3E%3C/svg%3E")`
                }}
              ></div>
            </div>
          ) : (
            <div 
              className="flex items-center justify-center p-8 rounded-lg border border-[#316831] bg-[#183418] cursor-pointer hover:bg-[#1e4a1e] transition-colors"
              onClick={() => navigate('/add-review')}
            >
              <div className="text-center">
                <div className="text-[#90cb90] text-2xl mb-2">🍺</div>
                <p className="text-[#90cb90] text-sm">Nie masz jeszcze żadnych recenzji</p>
                <p className="text-[#90cb90] text-xs opacity-75 mt-1">Kliknij, aby dodać pierwszą</p>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Features</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
          {/* Reviews Card */}
          <Link
            to="/my-reviews"
            className="flex flex-1 gap-3 rounded-lg border border-[#316831] bg-[#183418] p-4 items-center hover:bg-[#1e4a1e] transition-colors"
          >
            <div className="text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M239.2,97.29a16,16,0,0,0-13.81-11L166,81.17,142.72,25.81h0a15.95,15.95,0,0,0-29.44,0L90.07,81.17,30.61,86.32a16,16,0,0,0-9.11,28.06L66.61,153.8,53.09,212.34a16,16,0,0,0,23.84,17.34l51-31,51.11,31a16,16,0,0,0,23.84-17.34l-13.51-58.6,45.1-39.36A16,16,0,0,0,239.2,97.29Zm-15.22,5-45.1,39.36a16,16,0,0,0-5.08,15.71L187.35,216v0l-51.07-31a15.9,15.9,0,0,0-16.54,0l-51,31h0L82.2,157.4a16,16,0,0,0-5.08-15.71L32,102.35a.37.37,0,0,1,0-.09l59.44-5.14a16,16,0,0,0,13.35-9.75L128,32.08l23.2,55.29a16,16,0,0,0,13.35,9.75L224,102.26S224,102.32,224,102.33Z" />
              </svg>
            </div>
            <h2 className="text-white text-base font-bold leading-tight">Reviews</h2>
          </Link>

          {/* Statistics Card */}
          <Link
            to="/profile"
            className="flex flex-1 gap-3 rounded-lg border border-[#316831] bg-[#183418] p-4 items-center hover:bg-[#1e4a1e] transition-colors"
          >
            <div className="text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,136H40V56H216V176ZM104,120v24a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm32-16v40a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm32-16v56a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Z" />
              </svg>
            </div>
            <h2 className="text-white text-base font-bold leading-tight">Statistics</h2>
          </Link>

          {/* Add Review Card */}
          <Link
            to="/add-review"
            className="flex flex-1 gap-3 rounded-lg border border-[#316831] bg-[#183418] p-4 items-center hover:bg-[#1e4a1e] transition-colors"
          >
            <div className="text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
              </svg>
            </div>
            <h2 className="text-white text-base font-bold leading-tight">Add Review</h2>
          </Link>

          {/* Quiz Card */}
          <Link
            to="/quiz"
            className="flex flex-1 gap-3 rounded-lg border border-[#316831] bg-[#183418] p-4 items-center hover:bg-[#1e4a1e] transition-colors"
          >
            <div className="text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Zm104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" />
              </svg>
            </div>
            <h2 className="text-white text-base font-bold leading-tight">Quiz</h2>
          </Link>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div>
        <div className="flex gap-2 border-t border-[#224922] bg-[#183418] px-4 pb-3 pt-2">
          {/* Home - Active */}
          <Link to="/" className="flex flex-1 flex-col items-center justify-end gap-1 rounded-full text-white">
            <div className="text-white flex h-8 items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z" />
              </svg>
            </div>
          </Link>

          {/* Search */}
          <Link to="/my-reviews" className="flex flex-1 flex-col items-center justify-end gap-1 text-[#90cb90]">
            <div className="text-[#90cb90] flex h-8 items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
              </svg>
            </div>
          </Link>

          {/* Add */}
          <Link to="/add-review" className="flex flex-1 flex-col items-center justify-end gap-1 text-[#90cb90]">
            <div className="text-[#90cb90] flex h-8 items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,176H48V48H208V208Zm-32-80a8,8,0,0,1-8,8H136v32a8,8,0,0,1-16,0V136H88a8,8,0,0,1,0-16h32V88a8,8,0,0,1,16,0v32h32A8,8,0,0,1,176,128Z" />
              </svg>
            </div>
          </Link>

          {/* Profile */}
          <Link to="/profile" className="flex flex-1 flex-col items-center justify-end gap-1 text-[#90cb90]">
            <div className="text-[#90cb90] flex h-8 items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z" />
              </svg>
            </div>
          </Link>
        </div>
        <div className="h-5 bg-[#183418]"></div>
      </div>
    </div>
  );
}

export default HomePage;
