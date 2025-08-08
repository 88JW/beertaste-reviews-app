import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function HomePage({ user, handleLogout }) {
  const navigate = useNavigate();

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
