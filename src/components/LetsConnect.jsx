import React from 'react';
import letsConnectNight from '../../image/Lets Connect.svg';
import letsConnectDay from '../../image/Lets Connect Day.svg';

const LetsConnect = ({ isDayMode }) => {
  return (
    <section
      id="lets-connect"
      className={`w-full h-screen relative overflow-hidden flex flex-col justify-center items-center transition-colors duration-1000 ease-in-out ${
        isDayMode ? 'bg-[#FAF8F5]' : 'bg-[#060504]'
      }`}
    >
      {/* Spotlight Ambient Glows */}
      {/* Day Glow */}
      <div
        className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-1000 ease-in-out"
        style={{
          background: 'radial-gradient(circle, rgba(180,138,83,0.03) 0%, rgba(0,0,0,0) 75%)',
          opacity: isDayMode ? 1 : 0,
        }}
      />
      {/* Night Glow */}
      <div
        className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-1000 ease-in-out"
        style={{
          background: 'radial-gradient(circle, rgba(212,180,138,0.06) 0%, rgba(0,0,0,0) 75%)',
          opacity: isDayMode ? 0 : 1,
        }}
      />

      {/* Image Wrapper */}
      <div className="w-full h-full z-10 relative">
        {/* Night Image */}
        <img
          src={letsConnectNight}
          alt="Let's Connect Night"
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none transition-opacity duration-1000 ease-in-out"
          draggable="false"
          style={{
            opacity: isDayMode ? 0 : 1,
            zIndex: 1,
            willChange: 'opacity',
          }}
        />
        {/* Day Image */}
        <img
          src={letsConnectDay}
          alt="Let's Connect Day"
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none transition-opacity duration-1000 ease-in-out"
          draggable="false"
          style={{
            opacity: isDayMode ? 1 : 0,
            zIndex: 2,
            willChange: 'opacity',
          }}
        />
      </div>
    </section>
  );
};

export default LetsConnect;
