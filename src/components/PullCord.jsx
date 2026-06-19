import React, { useState, useEffect, useRef } from 'react';

const PullCord = ({ onPull, isWhiteScreen }) => {
  const [pullY, setPullY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hasPulled, setHasPulled] = useState(false);
  const startYRef = useRef(0);

  const maxPull = 125; // Clamped maximum pull
  const threshold = 65; // Pull threshold to switch states
  const baseLength = 160; // Base cord length

  const handleStart = (clientY) => {
    setIsDragging(true);
    startYRef.current = clientY;
  };

  const handleMove = (clientY) => {
    if (!isDragging) return;
    const deltaY = clientY - startYRef.current;
    if (deltaY > 0) {
      const newPull = Math.min(deltaY, maxPull);
      setPullY(newPull);
    } else {
      setPullY(0);
    }
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (pullY >= threshold) {
      onPull();
      setHasPulled(true);
    }
    setPullY(0);
  };

  useEffect(() => {
    const onMouseMove = (e) => handleMove(e.clientY);
    const onMouseUp = () => handleEnd();
    const onTouchMove = (e) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientY);
      }
    };
    const onTouchEnd = () => handleEnd();

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', onTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDragging, pullY]);

  const totalLength = baseLength + pullY;

  return (
    <>
      <div 
        className="fixed top-0 left-6 sm:left-10 lg:left-16 z-50 flex flex-col items-center select-none"
      >
        {/* Wire Cord */}
        <div 
          className="w-[3px] bg-neutral-900 transition-all duration-[1000ms] ease-in-out"
          style={{
            height: `${totalLength}px`,
            transition: isDragging ? 'none' : 'height 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        ></div>

        {/* Shaded Brass/Gold Pull Weight Handle */}
        <div
          onMouseDown={(e) => {
            e.preventDefault();
            handleStart(e.clientY);
          }}
          onTouchStart={(e) => {
            handleStart(e.touches[0].clientY);
          }}
          className="cursor-grab active:cursor-grabbing origin-top flex flex-col items-center"
          style={{
            transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          }}
        >
          {/* Custom polished brass cylinder pull toggle weight */}
          <svg
            width="16"
            height="34"
            viewBox="0 0 16 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`drop-shadow-[0_4px_6px_rgba(0,0,0,0.65)] transition-all duration-300 ${
              isDragging ? 'scale-y-[0.94] scale-x-[1.03]' : ''
            }`}
          >
            <defs>
              {/* Metallic brass gradient */}
              <linearGradient id="brassMetallic" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#664614" />
                <stop offset="25%" stopColor="#d4af37" />
                <stop offset="50%" stopColor="#fff4c2" />
                <stop offset="75%" stopColor="#b3922e" />
                <stop offset="100%" stopColor="#4a320c" />
              </linearGradient>
              {/* Matte dark plastic/metal for day state */}
              <linearGradient id="matteDark" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#222" />
                <stop offset="50%" stopColor="#444" />
                <stop offset="100%" stopColor="#1a1a1a" />
              </linearGradient>
            </defs>

            {/* Entry cap connector */}
            <rect x="6" y="0" width="4" height="4" fill={isWhiteScreen ? "#444" : "#1e1e1e"} />
            
            {/* Tapered weight body */}
            <path 
              d="M5 4H11L13.5 30H2.5L5 4Z" 
              fill={isWhiteScreen ? "url(#matteDark)" : "url(#brassMetallic)"} 
              className="transition-colors duration-1000 ease-in-out"
            />
            
            {/* Rounded bottom cap */}
            <path 
              d="M2.5 30H13.5V31.5C13.5 32.9 12.4 34 11 34H5C3.6 34 2.5 32.9 2.5 31.5V30Z" 
              fill={isWhiteScreen ? "url(#matteDark)" : "url(#brassMetallic)"}
              className="transition-colors duration-1000 ease-in-out"
            />
          </svg>
        </div>

        {/* Ambient warm light glow radiating below toggle weight in night mode */}
        <div 
          className={`absolute rounded-full pointer-events-none transition-all duration-1000 ease-in-out -translate-x-1/2 left-1/2 ${
            isWhiteScreen ? 'opacity-0 scale-50' : 'opacity-100 scale-100'
          }`}
          style={{
            top: `${totalLength + 28}px`,
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.07) 35%, rgba(245, 158, 11, 0) 70%)',
            filter: 'blur(10px)',
            transition: isDragging ? 'none' : 'top 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 1s ease-in-out, transform 1s ease-in-out'
          }}
        />
      </div>

      {/* Onboarding hint next to cord (Fades out when pulled) */}
      <div 
        className={`fixed top-[110px] left-14 sm:left-[72px] lg:left-[108px] z-50 flex items-center gap-2 pointer-events-none transition-all duration-[1000ms] ease-in-out ${
          hasPulled ? 'opacity-0 translate-x-[-12px] pointer-events-none' : 'opacity-100'
        } ${
          isWhiteScreen ? 'text-neutral-800' : 'text-amber-100/75'
        }`}
      >
        {/* Curved arrow pointing at the cord (left) */}
        <svg width="36" height="24" viewBox="0 0 36 24" fill="none">
          <path d="M30 6C22 5 14 8 6 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M12 15L6 15L6 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        {/* Helper text */}
        <div className="flex flex-col text-left leading-none font-inter text-[9px] sm:text-[10px] tracking-widest uppercase font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
          <span>Pull to</span>
          <span>Turn {isWhiteScreen ? 'off' : 'on'}</span>
        </div>
      </div>
    </>
  );
};

export default PullCord;
