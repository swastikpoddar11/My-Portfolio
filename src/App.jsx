import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import PullCord from './components/PullCord';
import AboutMe from './components/AboutMe';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Contact from './components/Contact';
import LetsConnect from './components/LetsConnect';
import AdminProjects from './components/AdminProjects';
import landingDayVideo from './assets/landing_day.mp4';
import landingNightVideo from './assets/landing_night.mp4';
import portfolioData from './data/portfolio_data.json';

// Show admin page when URL path is /admin
const isAdminPath = () => window.location.pathname.replace(/\/$/, '') === '/admin';

// ─── Glowing Mouse Trail Component ──────────────────────────────────────────
const GlowingTrailCanvas = ({ isDayMode }) => {
  const canvasRef = useRef(null);
  const pointsRef = useRef([]);
  const isDrawingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleMouseDown = (e) => {
      isDrawingRef.current = true;
      pointsRef.current.push({
        x: e.clientX,
        y: e.clientY,
        time: Date.now(),
        isStart: true
      });
    };

    const handleMouseMove = (e) => {
      if (!isDrawingRef.current) return;
      pointsRef.current.push({
        x: e.clientX,
        y: e.clientY,
        time: Date.now(),
        isStart: false
      });
    };

    const handleMouseUp = () => {
      isDrawingRef.current = false;
    };

    const handleTouchStart = (e) => {
      isDrawingRef.current = true;
      if (e.touches.length > 0) {
        pointsRef.current.push({
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          time: Date.now(),
          isStart: true
        });
      }
    };

    const handleTouchMove = (e) => {
      if (!isDrawingRef.current) return;
      if (e.touches.length > 0) {
        pointsRef.current.push({
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          time: Date.now(),
          isStart: false
        });
      }
    };

    const handleTouchEnd = () => {
      isDrawingRef.current = false;
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseleave', handleMouseUp);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    const accentColor = isDayMode ? '#B48A53' : '#D4B48A';
    const LIFE_SPAN = 500; // ms for a point to live

    let animationFrameId;

    const render = () => {
      const points = pointsRef.current;
      if (points.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = Date.now();
      
      // Filter out dead points
      pointsRef.current = pointsRef.current.filter(p => now - p.time < LIFE_SPAN);

      const activePoints = pointsRef.current;
      if (activePoints.length > 1) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        for (let i = 1; i < activePoints.length; i++) {
          const p1 = activePoints[i - 1];
          const p2 = activePoints[i];

          if (p2.isStart) continue;

          const age1 = now - p1.time;
          const age2 = now - p2.time;
          const avgAge = (age1 + age2) / 2;
          const lifeRatio = 1 - avgAge / LIFE_SPAN;

          if (lifeRatio <= 0) continue;

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);

          ctx.strokeStyle = isDayMode 
            ? `rgba(180, 138, 83, ${lifeRatio * 0.85})` 
            : `rgba(212, 180, 138, ${lifeRatio * 0.95})`;
          ctx.lineWidth = 4.5 * lifeRatio;
          ctx.shadowColor = accentColor;
          ctx.shadowBlur = 12 * lifeRatio;

          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDayMode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[99999] w-full h-full"
    />
  );
};

function App() {
  const [isAdmin] = useState(isAdminPath);
  const [isDayMode, setIsDayMode] = useState(false);
  const [time, setTime] = useState(new Date());
  const nightVideoRef = useRef(null);
  const dayVideoRef = useRef(null);

  useEffect(() => {
    try {
      const localLastUpdated = localStorage.getItem('swastik_portfolio_last_updated');
      const incomingLastUpdated = portfolioData.lastUpdated;
      
      if (!localLastUpdated || parseInt(localLastUpdated) < incomingLastUpdated) {
        if (portfolioData.projects) {
          localStorage.setItem('swastik_portfolio_projects', JSON.stringify(portfolioData.projects));
        }
        if (portfolioData.categories) {
          localStorage.setItem('swastik_portfolio_categories', JSON.stringify(portfolioData.categories));
        }
        if (portfolioData.experiences) {
          localStorage.setItem('swastik_portfolio_experiences', JSON.stringify(portfolioData.experiences));
        }
        if (portfolioData.skills) {
          localStorage.setItem('swastik_portfolio_skills', JSON.stringify(portfolioData.skills));
        }
        if (portfolioData.resume) {
          localStorage.setItem('swastik_portfolio_resume', portfolioData.resume);
        }
        if (portfolioData.resumeName) {
          localStorage.setItem('swastik_portfolio_resume_name', portfolioData.resumeName);
        }
        
        localStorage.setItem('swastik_portfolio_last_updated', incomingLastUpdated.toString());
        localStorage.setItem('swastik_portfolio_blanks_initialized', 'true');
        
        window.dispatchEvent(new Event('storage'));
      }
    } catch (err) {
      console.error('Portfolio data synchronization failed:', err);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) return;
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) return;
    const accent = isDayMode ? '%23B48A53' : '%23D4B48A';
    const cursorSvg = `%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cdefs%3E%3Cfilter id='shadow' x='-25%25' y='-25%25' width='150%25' height='150%25'%3E%3CfeDropShadow dx='0.8' dy='1.2' stdDeviation='0.8' flood-opacity='0.35'/%3E%3C/filter%3E%3C/defs%3E%3Cg filter='url(%23shadow)'%3E%3Cpath d='M1.5,1.5 L5.5,3.2 L24.5,22.2 C25.2,22.9 25.2,24.1 24.5,24.8 C23.8,25.5 22.6,25.5 21.9,24.8 L2.9,5.8 L1.5,1.5 Z' fill='%23FFFFFF' stroke='rgba(0,0,0,0.15)' stroke-width='0.5'/%3E%3Cpath d='M1.5,1.5 L3.2,5 L5,3.2 Z' fill='%23F4EAD4'/%3E%3Cpath d='M1.5,1.5 L2.2,3 L3,2.2 Z' fill='${accent}'/%3E%3Cline x1='4.5' y1='2.8' x2='2.8' y2='4.5' stroke='${accent}' stroke-width='0.8'/%3E%3Cpath d='M22.5,22.8 C23.2,23.5 23.8,24.1 24.5,24.8 C24.8,24.5 24.8,24.1 24.5,23.8 L23.5,22.8 Z' fill='${accent}'/%3E%3C/g%3E%3C/svg%3E`;
    
    document.documentElement.style.cursor = `url("data:image/svg+xml;utf8,${cursorSvg}") 1 1, auto`;
  }, [isDayMode, isAdmin]);

  useEffect(() => {
    if (isAdmin) return;
    if (isDayMode) {
      dayVideoRef.current?.play().catch(()=>{});
      const t = setTimeout(() => {
        nightVideoRef.current?.pause();
      }, 1000);
      return () => clearTimeout(t);
    } else {
      nightVideoRef.current?.play().catch(()=>{});
      const t = setTimeout(() => {
        dayVideoRef.current?.pause();
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [isDayMode, isAdmin]);

  if (isAdmin) return <AdminProjects />;



  const formatTime = () => {
    let hours = time.getHours();
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return {
      timeStr: `${hours}:${minutes}`,
      ampm: ampm
    };
  };

  return (
    <div className={`relative min-h-screen transition-colors duration-1000 ease-in-out ${isDayMode ? 'bg-white' : 'bg-black'
      }`}>
      {/* Navbar - Kept floating at absolute top of initial viewport */}
      <Navbar isWhiteScreen={isDayMode} />

      {/* Stretchable Pull Cord (Fixed at top) */}
      <PullCord
        onPull={() => setIsDayMode(prev => !prev)}
        isWhiteScreen={isDayMode}
      />

      {/* Night Background Video (Default) */}
      <div 
        className={`fixed inset-0 z-0 transition-opacity duration-1000 ease-in-out ${isDayMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        style={{ willChange: 'opacity' }}
      >
        <video
          ref={nightVideoRef}
          src={landingNightVideo}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Day Background Video */}
      <div 
        className={`fixed inset-0 z-0 transition-opacity duration-1000 ease-in-out ${isDayMode ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ willChange: 'opacity' }}
      >
        <video
          ref={dayVideoRef}
          src={landingDayVideo}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Table Digital Clock (Overlaid on right-side dresser, hidden on mobile) */}
      <div className={`fixed right-[8%] sm:right-[10%] md:right-[12%] lg:right-[14%] bottom-[10%] sm:bottom-[11%] md:bottom-[12%] lg:bottom-[13%] z-10 select-none pointer-events-none hidden sm:flex items-center justify-center transition-opacity duration-1000 ease-in-out ${isDayMode ? 'opacity-0' : 'opacity-100'
        }`}>
        <div className="bg-[#0a0a0a] border border-zinc-800/80 rounded-lg px-3 py-1 flex items-center justify-center shadow-2xl scale-[0.8] md:scale-[0.9] lg:scale-100 origin-bottom-right">
          <span className={`font-mono text-lg sm:text-xl font-semibold tracking-wider transition-all duration-1000 ${isDayMode
              ? 'text-amber-600'
              : 'text-amber-500 drop-shadow-[0_0_5px_rgba(245,158,11,0.65)]'
            }`}>
            {formatTime().timeStr}
          </span>
        </div>
      </div>

      {/* Scrollable Content Container */}
      <div className="relative z-10 flex flex-col w-full">
        {/* Hero Section (Spacer to showcase workspace) */}
        <section className="min-h-screen flex items-center justify-center pointer-events-none relative">

          {/* Scroll to Explore Mouse Indicator */}
          <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none transition-colors duration-1000 ${isDayMode ? 'text-zinc-800' : 'text-white/70'
            }`}>
            <span className="font-inter text-[10px] sm:text-xs tracking-[0.2em] uppercase font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              Scroll to explore
            </span>
            <div className={`w-[22px] h-[36px] rounded-full border-2 flex justify-center py-2 transition-colors duration-1000 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] ${isDayMode ? 'border-zinc-800/60 bg-white/5' : 'border-white/40 bg-black/5'
              }`}>
              <div className={`w-[3px] h-[7px] rounded-full animate-scroll-wheel ${isDayMode ? 'bg-zinc-800' : 'bg-white/80'
                }`}></div>
            </div>
          </div>

        </section>

        {/* Content Panel — solid #090909 so About & Projects are one continuous surface */}
        <div className={`w-full transition-colors duration-1000 ease-in-out ${isDayMode
            ? 'bg-[#FAF8F5] text-zinc-900'
            : 'bg-[#090909] text-zinc-100'
          }`}>

          {/* About Section */}
          <AboutMe isDayMode={isDayMode} />

          {/* Projects Section */}
          <Projects isDayMode={isDayMode} />

          {/* Experience Section */}
          <Experience isDayMode={isDayMode} />

          {/* Contact Section */}
          <Contact isDayMode={isDayMode} />

          {/* Let's Connect Section */}
          <LetsConnect isDayMode={isDayMode} />

        </div>
      </div>
      
      {/* Dynamic Glowing Trail Canvas */}
      <GlowingTrailCanvas isDayMode={isDayMode} />
    </div>
  );
}

export default App;
